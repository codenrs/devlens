import type { PerformanceSnapshot } from '../performance/types';

type PerformanceStoreListener = (snapshot: PerformanceSnapshot) => void;

const snapshot: PerformanceSnapshot = {
  fps: 0,
  lastUpdatedAt: Date.now(),
};

const listeners = new Set<PerformanceStoreListener>();

function notify() {
  const currentSnapshot = { ...snapshot };
  listeners.forEach((listener) => listener(currentSnapshot));
}

export const performanceStore = {
  getSnapshot() {
    return { ...snapshot };
  },

  subscribe(listener: PerformanceStoreListener) {
    listeners.add(listener);
    listener({ ...snapshot });

    return () => {
      listeners.delete(listener);
    };
  },

  setFps(fps: number) {
    snapshot.fps = fps;
    snapshot.lastUpdatedAt = Date.now();
    notify();
  },

  reset() {
    snapshot.fps = 0;
    snapshot.lastUpdatedAt = Date.now();
    notify();
  },
};
