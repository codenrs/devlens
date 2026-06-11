import { createDevLensId, isBrowser } from '@nrshagor/devlens-shared';
import { performanceStore } from '../stores/performanceStore';
import type { LongTaskRecord } from './types';

let observer: PerformanceObserver | null = null;
let installed = false;
let installCount = 0;

export function installLongTaskMonitor() {
  if (!isBrowser() || typeof PerformanceObserver === 'undefined') {
    return;
  }

  installCount += 1;

  if (installed) {
    return;
  }

  try {
    observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const record: LongTaskRecord = {
          id: createDevLensId('long-task'),
          name: entry.name || 'longtask',
          startTime: Math.round(entry.startTime),
          duration: Math.round(entry.duration),
          timestamp: Date.now(),
        };

        performanceStore.addLongTask(record);
      });
    });

    observer.observe({ entryTypes: ['longtask'] });
    installed = true;
  } catch {
    observer = null;
    installed = false;
    installCount = Math.max(0, installCount - 1);
  }
}

export function uninstallLongTaskMonitor() {
  if (!installed) {
    return;
  }

  installCount = Math.max(0, installCount - 1);

  if (installCount > 0) {
    return;
  }

  observer?.disconnect();
  observer = null;
  installed = false;
}
