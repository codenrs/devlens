import { errorStore } from '../stores/errorStore';

let installed = false;

let previousOnError: OnErrorEventHandler | null = null;
let previousOnUnhandledRejection: ((event: PromiseRejectionEvent) => void) | null = null;

function normalizeRuntimeError(
  message: string | Event,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error,
) {
  if (error instanceof Error) {
    return error;
  }

  const normalizedMessage =
    typeof message === 'string' ? message : message.type || 'Unknown runtime error';

  const location = source ? ` at ${source}:${lineno ?? 0}:${colno ?? 0}` : '';

  return new Error(`${normalizedMessage}${location}`);
}

function handleWindowError(
  message: string | Event,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error,
) {
  errorStore.addError({
    source: 'runtime',
    error: normalizeRuntimeError(message, source, lineno, colno, error),
  });

  if (typeof previousOnError === 'function') {
    return previousOnError(message, source, lineno, colno, error);
  }

  return false;
}

function handleUnhandledRejection(event: PromiseRejectionEvent) {
  errorStore.addError({
    source: 'promise',
    error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
  });

  if (previousOnUnhandledRejection) {
    previousOnUnhandledRejection(event);
  }
}

export function installRuntimeErrorMonitor() {
  if (installed || typeof window === 'undefined') {
    return;
  }

  installed = true;

  previousOnError = window.onerror;
  previousOnUnhandledRejection = window.onunhandledrejection;

  window.onerror = handleWindowError;
  window.onunhandledrejection = handleUnhandledRejection;
}

export function uninstallRuntimeErrorMonitor() {
  if (!installed || typeof window === 'undefined') {
    return;
  }

  window.onerror = previousOnError;
  window.onunhandledrejection = previousOnUnhandledRejection;

  previousOnError = null;
  previousOnUnhandledRejection = null;
  installed = false;
}
