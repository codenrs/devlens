import type { FpsSample, PerformanceSnapshot, PerformanceStatus } from '../performance/types';

type PerformanceStoreListener = (snapshot: PerformanceSnapshot) => void;

const MAX_FPS_SAMPLES = 60;

const snapshot: PerformanceSnapshot = {
  fps: 0,
  averageFps: 0,
  minFps: 0,
  maxFps: 0,
  status: 'idle',
  samples: [],
  lastUpdatedAt: Date.now(),
};

const listeners = new Set<PerformanceStoreListener>();

function getPerformanceStatus(fps: number): PerformanceStatus {
  if (fps <= 0) return 'idle';
  if (fps >= 50) return 'good';
  if (fps >= 30) return 'warning';

  return 'poor';
}

function calculateAverage(samples: FpsSample[]) {
  if (samples.length === 0) return 0;

  const total = samples.reduce((sum, sample) => sum + sample.fps, 0);

  return Math.round(total / samples.length);
}

function notify() {
  const currentSnapshot: PerformanceSnapshot = {
    ...snapshot,
    samples: [...snapshot.samples],
  };

  listeners.forEach((listener) => listener(currentSnapshot));
}

export const performanceStore = {
  getSnapshot() {
    return {
      ...snapshot,
      samples: [...snapshot.samples],
    };
  },

  subscribe(listener: PerformanceStoreListener) {
    listeners.add(listener);
    listener({
      ...snapshot,
      samples: [...snapshot.samples],
    });

    return () => {
      listeners.delete(listener);
    };
  },

  setFps(fps: number) {
    const timestamp = Date.now();

    snapshot.samples.push({
      fps,
      timestamp,
    });

    if (snapshot.samples.length > MAX_FPS_SAMPLES) {
      snapshot.samples.shift();
    }

    const fpsValues = snapshot.samples.map((sample) => sample.fps);

    snapshot.fps = fps;
    snapshot.averageFps = calculateAverage(snapshot.samples);
    snapshot.minFps = fpsValues.length ? Math.min(...fpsValues) : 0;
    snapshot.maxFps = fpsValues.length ? Math.max(...fpsValues) : 0;
    snapshot.status = getPerformanceStatus(fps);
    snapshot.lastUpdatedAt = timestamp;

    notify();
  },

  reset() {
    snapshot.fps = 0;
    snapshot.averageFps = 0;
    snapshot.minFps = 0;
    snapshot.maxFps = 0;
    snapshot.status = 'idle';
    snapshot.samples = [];
    snapshot.lastUpdatedAt = Date.now();

    notify();
  },
};
