import { createDevLensId, isBrowser } from '@codenrs/devlens-shared';
import { devlensCore } from '../index';
import { networkStore } from '../stores/networkStore';
import type { NetworkRequestRecord } from './types';

const SLOW_REQUEST_THRESHOLD_MS = 300;

let originalFetch: typeof fetch | null = null;
let installed = false;

export function installFetchInterceptor() {
  if (!isBrowser() || installed || typeof window.fetch !== 'function') {
    return;
  }

  originalFetch = window.fetch.bind(window);
  installed = true;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const id = createDevLensId('fetch');
    const startTime = performance.now();

    const url =
      typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

    const method = init?.method || 'GET';

    const pendingRecord: NetworkRequestRecord = {
      id,
      url,
      method,
      status: 'pending',
      startTime,
    };

    networkStore.addRequest(pendingRecord);
    devlensCore.emit('network:request', pendingRecord);

    try {
      const response = await originalFetch!(input, init);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      const isSuccess = response.ok;
      const isSlow = isSuccess && duration >= SLOW_REQUEST_THRESHOLD_MS;

      const record: NetworkRequestRecord = {
        ...pendingRecord,
        status: isSuccess ? 'success' : 'error',
        statusCode: response.status,
        endTime,
        duration,
        isSlow,
      };

      networkStore.updateRequest(record);
      devlensCore.emit(isSuccess ? 'network:response' : 'network:error', record);

      if (isSlow) {
        devlensCore.emit('network:slow', record);
      }

      return response;
    } catch (error) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      const record: NetworkRequestRecord = {
        ...pendingRecord,
        status: 'error',
        endTime,
        duration,
        isSlow: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown fetch error',
      };

      networkStore.updateRequest(record);
      devlensCore.emit('network:error', record);

      throw error;
    }
  };
}

export function uninstallFetchInterceptor() {
  if (!installed || !originalFetch) {
    return;
  }

  window.fetch = originalFetch;
  originalFetch = null;
  installed = false;
}
