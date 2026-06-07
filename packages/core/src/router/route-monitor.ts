import { routeStore } from '../stores/routeStore';

let installed = false;

let originalPushState: History['pushState'] | null = null;
let originalReplaceState: History['replaceState'] | null = null;

function captureNavigation(type: 'push' | 'replace' | 'popstate' | 'hash') {
  const startedAt = performance.now();

  queueMicrotask(() => {
    routeStore.addRoute(window.location.pathname, window.location.href, type, startedAt);
  });
}

function handlePopState() {
  captureNavigation('popstate');
}

function handleHashChange() {
  captureNavigation('hash');
}

export function installRouteMonitor() {
  if (installed || typeof window === 'undefined') {
    return;
  }

  installed = true;

  originalPushState = window.history.pushState;
  originalReplaceState = window.history.replaceState;

  window.history.pushState = function (...args) {
    originalPushState?.apply(window.history, args);

    captureNavigation('push');
  };

  window.history.replaceState = function (...args) {
    originalReplaceState?.apply(window.history, args);

    captureNavigation('replace');
  };

  window.addEventListener('popstate', handlePopState);
  window.addEventListener('hashchange', handleHashChange);
}

export function uninstallRouteMonitor() {
  if (!installed || typeof window === 'undefined') {
    return;
  }

  if (originalPushState) {
    window.history.pushState = originalPushState;
  }

  if (originalReplaceState) {
    window.history.replaceState = originalReplaceState;
  }

  window.removeEventListener('popstate', handlePopState);
  window.removeEventListener('hashchange', handleHashChange);

  installed = false;
}
