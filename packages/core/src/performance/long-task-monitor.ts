import { createDevLensId, isBrowser } from '@codenrs/devlens-shared';
import { performanceStore } from '../stores/performanceStore';
import type { LongTaskRecord } from './types';

let observer: PerformanceObserver | null = null;
let installed = false;

export function installLongTaskMonitor() {
  if (!isBrowser() || installed || typeof PerformanceObserver === 'undefined') {
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
  }
}

export function uninstallLongTaskMonitor() {
  if (!installed) {
    return;
  }

  observer?.disconnect();
  observer = null;
  installed = false;
}
