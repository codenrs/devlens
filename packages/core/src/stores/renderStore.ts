import { createDevLensId } from '@codenrs/devlens-shared';
import type { RenderRecord, RenderSnapshot } from '../render/types';

type RenderStoreListener = (snapshot: RenderSnapshot) => void;

const MAX_RENDER_RECORDS = 200;

const snapshot: RenderSnapshot = {
  records: [],
  lastUpdatedAt: Date.now(),
};

const listeners = new Set<RenderStoreListener>();

function createSnapshot(): RenderSnapshot {
  return {
    ...snapshot,
    records: snapshot.records.slice(),
  };
}

function notify() {
  const currentSnapshot = createSnapshot();

  listeners.forEach((listener) => listener(currentSnapshot));
}

export const renderStore = {
  getSnapshot() {
    return createSnapshot();
  },

  subscribe(listener: RenderStoreListener) {
    listeners.add(listener);

    listener(createSnapshot());

    return () => {
      listeners.delete(listener);
    };
  },

  trackRender(componentName: string, duration: number) {
    const timestamp = Date.now();

    const existing = snapshot.records.find((record) => record.componentName === componentName);

    if (existing) {
      existing.renderCount += 1;
      existing.duration = duration;
      existing.timestamp = timestamp;
    } else {
      snapshot.records.unshift({
        id: createDevLensId('render'),
        componentName,
        renderCount: 1,
        duration,
        timestamp,
      });

      if (snapshot.records.length > MAX_RENDER_RECORDS) {
        snapshot.records.length = MAX_RENDER_RECORDS;
      }
    }

    snapshot.lastUpdatedAt = timestamp;

    notify();
  },

  clear() {
    snapshot.records = [];
    snapshot.lastUpdatedAt = Date.now();

    notify();
  },
};
