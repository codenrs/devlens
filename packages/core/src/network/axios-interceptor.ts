import { createDevLensId, isBrowser } from '@nrshagor/devlens-shared';
import { devlensCore } from '../index';
import { networkStore } from '../stores/networkStore';
import type { NetworkRequestRecord } from './types';

const SLOW_REQUEST_THRESHOLD_MS = 300;
const AXIOS_META_KEY = '__devlensAxiosMeta';

type LooseRecord = Record<string, unknown>;

type AxiosLikeConfig = LooseRecord & {
  url?: string;
  baseURL?: string;
  method?: string;
};

type AxiosLikeResponse = LooseRecord & {
  status?: number;
  config?: unknown;
};

type AxiosLikeError = LooseRecord & {
  message?: string;
  config?: unknown;
  response?: AxiosLikeResponse;
};

type AxiosMeta = {
  id: string;
  startTime: number;
  pendingRecord: NetworkRequestRecord;
};

type DevLensAxiosInterceptorManager = {
  use: (
    onFulfilled?: (...args: never[]) => unknown,
    onRejected?: (...args: never[]) => unknown,
  ) => number;
  eject: (id: number) => void;
};

export type DevLensAxiosInstance = {
  interceptors: {
    request: DevLensAxiosInterceptorManager;
    response: DevLensAxiosInterceptorManager;
  };
};

type AxiosInterceptorState = {
  requestInterceptorId: number;
  responseInterceptorId: number;
  installCount: number;
};

const installedAxiosInstances = new WeakMap<object, AxiosInterceptorState>();

function isRecord(value: unknown): value is LooseRecord {
  return (typeof value === 'object' || typeof value === 'function') && value !== null;
}

function isDevLensAxiosInstance(value: unknown): value is DevLensAxiosInstance {
  return (
    isRecord(value) &&
    isRecord(value.interceptors) &&
    isRecord(value.interceptors.request) &&
    isRecord(value.interceptors.response) &&
    typeof value.interceptors.request.use === 'function' &&
    typeof value.interceptors.request.eject === 'function' &&
    typeof value.interceptors.response.use === 'function' &&
    typeof value.interceptors.response.eject === 'function'
  );
}

function toAxiosConfig(value: unknown): AxiosLikeConfig {
  return isRecord(value) ? (value as AxiosLikeConfig) : {};
}

function toAxiosResponse(value: unknown): AxiosLikeResponse {
  return isRecord(value) ? (value as AxiosLikeResponse) : {};
}

function toAxiosError(value: unknown): AxiosLikeError {
  return isRecord(value) ? (value as AxiosLikeError) : {};
}

function getAxiosMeta(config: unknown): AxiosMeta | undefined {
  if (!isRecord(config)) {
    return undefined;
  }

  return config[AXIOS_META_KEY] as AxiosMeta | undefined;
}

function setAxiosMeta(config: unknown, meta: AxiosMeta) {
  if (!isRecord(config)) {
    return;
  }

  Object.defineProperty(config, AXIOS_META_KEY, {
    value: meta,
    enumerable: false,
    configurable: true,
  });
}

function getAxiosUrl(config: AxiosLikeConfig): string {
  const url = typeof config.url === 'string' ? config.url : '';
  const baseURL = typeof config.baseURL === 'string' ? config.baseURL : '';

  if (!baseURL || /^https?:\/\//i.test(url)) {
    return url;
  }

  return `${baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
}

function getAxiosMethod(config: AxiosLikeConfig): string {
  return String(config.method || 'GET').toUpperCase();
}

export function installAxiosInterceptor(axiosInstance: unknown) {
  if (!isBrowser() || !isDevLensAxiosInstance(axiosInstance)) {
    return;
  }

  const existingState = installedAxiosInstances.get(axiosInstance);

  if (existingState) {
    existingState.installCount += 1;
    return;
  }

  const requestInterceptorId = axiosInstance.interceptors.request.use((value: unknown) => {
    const config = toAxiosConfig(value);
    const id = createDevLensId('axios');
    const startTime = performance.now();

    const pendingRecord: NetworkRequestRecord = {
      id,
      url: getAxiosUrl(config),
      method: getAxiosMethod(config),
      status: 'pending',
      startTime,
    };

    setAxiosMeta(value, {
      id,
      startTime,
      pendingRecord,
    });

    networkStore.addRequest(pendingRecord);
    devlensCore.emit('network:request', pendingRecord);

    return value;
  });

  const responseInterceptorId = axiosInstance.interceptors.response.use(
    (value: unknown) => {
      const response = toAxiosResponse(value);
      const meta = getAxiosMeta(response.config);

      if (!meta) {
        return value;
      }

      const endTime = performance.now();
      const duration = Math.round(endTime - meta.startTime);
      const statusCode = response.status;
      const isSuccess =
        typeof statusCode === 'number' ? statusCode >= 200 && statusCode < 400 : true;
      const isSlow = isSuccess && duration >= SLOW_REQUEST_THRESHOLD_MS;

      const record: NetworkRequestRecord = {
        ...meta.pendingRecord,
        status: isSuccess ? 'success' : 'error',
        statusCode,
        endTime,
        duration,
        isSlow,
      };

      networkStore.updateRequest(record);
      devlensCore.emit(isSuccess ? 'network:response' : 'network:error', record);

      if (isSlow) {
        devlensCore.emit('network:slow', record);
      }

      return value;
    },
    (error: unknown) => {
      const axiosError = toAxiosError(error);
      const meta = getAxiosMeta(axiosError.config);

      if (!meta) {
        return Promise.reject(error);
      }

      const endTime = performance.now();
      const duration = Math.round(endTime - meta.startTime);
      const statusCode = axiosError.response?.status;

      const record: NetworkRequestRecord = {
        ...meta.pendingRecord,
        status: 'error',
        statusCode,
        endTime,
        duration,
        isSlow: false,
        errorMessage: axiosError.message || 'Unknown axios error',
      };

      networkStore.updateRequest(record);
      devlensCore.emit('network:error', record);

      return Promise.reject(error);
    },
  );

  installedAxiosInstances.set(axiosInstance, {
    requestInterceptorId,
    responseInterceptorId,
    installCount: 1,
  });
}

export function uninstallAxiosInterceptor(axiosInstance: unknown) {
  if (!isDevLensAxiosInstance(axiosInstance)) {
    return;
  }

  const state = installedAxiosInstances.get(axiosInstance);

  if (!state) {
    return;
  }

  state.installCount = Math.max(0, state.installCount - 1);

  if (state.installCount > 0) {
    return;
  }

  axiosInstance.interceptors.request.eject(state.requestInterceptorId);
  axiosInstance.interceptors.response.eject(state.responseInterceptorId);

  installedAxiosInstances.delete(axiosInstance);
}
