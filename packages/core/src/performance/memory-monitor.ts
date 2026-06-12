import { isBrowser } from '@nrshagor/devlens-shared';
import { performanceStore } from '../stores/performanceStore';
import type { MemorySnapshot } from './types';

const MEMORY_MONITOR_INTERVAL_MS = 3000;

let installed = false;
let installCount = 0;
let intervalId: number | null = null;

type PerformanceWithMemory = Performance & {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
};

function getMemorySnapshot(): MemorySnapshot | null {
  const performanceWithMemory = performance as PerformanceWithMemory;
  const memory = performanceWithMemory.memory;

  if (!memory) {
    return null;
  }

  const usagePercent =
    memory.jsHeapSizeLimit > 0
      ? Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
      : 0;

  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usagePercent,
    supported: true,
    timestamp: Date.now(),
  };
}

function collectMemory() {
  const snapshot = getMemorySnapshot();

  if (!snapshot) {
    return;
  }

  performanceStore.setMemory(snapshot);
}

export function installMemoryMonitor() {
  if (!isBrowser()) {
    return;
  }

  installCount += 1;

  if (installed) {
    return;
  }

  collectMemory();

  intervalId = window.setInterval(collectMemory, MEMORY_MONITOR_INTERVAL_MS);
  installed = true;
}

export function uninstallMemoryMonitor() {
  if (!installed) {
    return;
  }

  installCount = Math.max(0, installCount - 1);

  if (installCount > 0) {
    return;
  }

  if (intervalId !== null) {
    window.clearInterval(intervalId);
  }

  intervalId = null;
  installed = false;
}
