import { createDevLensId } from '@nrshagor/devlens-shared';
import type { RouteNavigationType, RouteRecord, RouteSnapshot } from '../router/types';

type RouteStoreListener = (snapshot: RouteSnapshot) => void;

const MAX_ROUTE_HISTORY = 100;

const snapshot: RouteSnapshot = {
  currentPath: typeof window !== 'undefined' ? window.location.pathname : '/',
  previousPath: null,
  history: [],
  lastUpdatedAt: Date.now(),
};

const listeners = new Set<RouteStoreListener>();

function getNow() {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

function createSnapshot(): RouteSnapshot {
  return {
    ...snapshot,
    history: snapshot.history.slice(),
  };
}

function notify() {
  const currentSnapshot = createSnapshot();

  listeners.forEach((listener) => listener(currentSnapshot));
}

export const routeStore = {
  getSnapshot() {
    return createSnapshot();
  },

  subscribe(listener: RouteStoreListener) {
    listeners.add(listener);
    listener(createSnapshot());

    return () => {
      listeners.delete(listener);
    };
  },

  addRoute(
    pathname: string,
    fullPath: string,
    navigationType: RouteNavigationType,
    startedAt: number,
  ) {
    const completedAt = Date.now();
    const duration = Math.max(0, getNow() - startedAt);

    const record: RouteRecord = {
      id: createDevLensId('route'),
      pathname,
      fullPath,
      navigationType,
      startedAt,
      completedAt,
      duration,
    };

    snapshot.previousPath = snapshot.currentPath;
    snapshot.currentPath = pathname;
    snapshot.history.unshift(record);

    if (snapshot.history.length > MAX_ROUTE_HISTORY) {
      snapshot.history.length = MAX_ROUTE_HISTORY;
    }

    snapshot.lastUpdatedAt = completedAt;

    notify();
  },

  clear() {
    snapshot.history = [];
    snapshot.previousPath = null;
    snapshot.lastUpdatedAt = Date.now();

    notify();
  },
};
