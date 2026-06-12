import { createDevLensId, isBrowser } from '@nrshagor/devlens-shared';
import { devlensCore } from '../index';
import { networkStore } from '../stores/networkStore';
import type { NetworkRequestRecord } from './types';

const SLOW_REQUEST_THRESHOLD_MS = 300;

let originalOpen: typeof XMLHttpRequest.prototype.open | null = null;
let originalSend: typeof XMLHttpRequest.prototype.send | null = null;
let installed = false;
let installCount = 0;

type XhrMeta = {
  id: string;
  method: string;
  url: string;
  startTime: number;
  pendingRecord: NetworkRequestRecord;
};

const xhrMeta = new WeakMap<XMLHttpRequest, XhrMeta>();

function normalizeXhrUrl(url: string | URL) {
  return typeof url === 'string' ? url : url.toString();
}

export function installXhrInterceptor() {
  if (!isBrowser() || typeof XMLHttpRequest === 'undefined') {
    return;
  }

  installCount += 1;

  if (installed) {
    return;
  }

  originalOpen = XMLHttpRequest.prototype.open;
  originalSend = XMLHttpRequest.prototype.send;
  installed = true;

  XMLHttpRequest.prototype.open = function devlensXhrOpen(
    method: string,
    url: string | URL,
    async?: boolean,
    username?: string | null,
    password?: string | null,
  ) {
    const id = createDevLensId('xhr');
    const startTime = performance.now();
    const normalizedUrl = normalizeXhrUrl(url);
    const normalizedMethod = String(method || 'GET').toUpperCase();

    const pendingRecord: NetworkRequestRecord = {
      id,
      url: normalizedUrl,
      method: normalizedMethod,
      status: 'pending',
      startTime,
    };

    xhrMeta.set(this, {
      id,
      method: normalizedMethod,
      url: normalizedUrl,
      startTime,
      pendingRecord,
    });

    return originalOpen?.call(this, method, url, async ?? true, username ?? null, password ?? null);
  };

  XMLHttpRequest.prototype.send = function devlensXhrSend(
    body?: Document | XMLHttpRequestBodyInit | null,
  ) {
    const meta = xhrMeta.get(this);

    if (!meta || !originalSend) {
      return originalSend?.call(this, body ?? null);
    }

    networkStore.addRequest(meta.pendingRecord);
    devlensCore.emit('network:request', meta.pendingRecord);

    const finalize = () => {
      const endTime = performance.now();
      const duration = Math.round(endTime - meta.startTime);
      const statusCode = this.status;
      const isSuccess = statusCode >= 200 && statusCode < 400;
      const isSlow = isSuccess && duration >= SLOW_REQUEST_THRESHOLD_MS;

      const record: NetworkRequestRecord = {
        ...meta.pendingRecord,
        status: isSuccess ? 'success' : 'error',
        statusCode,
        endTime,
        duration,
        isSlow,
        errorMessage: isSuccess ? undefined : this.statusText || 'XHR request failed',
      };

      networkStore.updateRequest(record);
      devlensCore.emit(isSuccess ? 'network:response' : 'network:error', record);

      if (isSlow) {
        devlensCore.emit('network:slow', record);
      }

      xhrMeta.delete(this);
    };

    const handleError = () => {
      const endTime = performance.now();
      const duration = Math.round(endTime - meta.startTime);

      const record: NetworkRequestRecord = {
        ...meta.pendingRecord,
        status: 'error',
        statusCode: this.status || undefined,
        endTime,
        duration,
        isSlow: false,
        errorMessage: this.statusText || 'XHR request failed',
      };

      networkStore.updateRequest(record);
      devlensCore.emit('network:error', record);

      xhrMeta.delete(this);
    };

    this.addEventListener('loadend', finalize, { once: true });
    this.addEventListener('error', handleError, { once: true });
    this.addEventListener('abort', handleError, { once: true });
    this.addEventListener('timeout', handleError, { once: true });

    return originalSend.call(this, body ?? null);
  };
}

export function uninstallXhrInterceptor() {
  if (!installed) {
    return;
  }

  installCount = Math.max(0, installCount - 1);

  if (installCount > 0) {
    return;
  }

  if (originalOpen) {
    XMLHttpRequest.prototype.open = originalOpen;
  }

  if (originalSend) {
    XMLHttpRequest.prototype.send = originalSend;
  }

  originalOpen = null;
  originalSend = null;
  installed = false;
}
