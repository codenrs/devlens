import { createDevLensId } from '@nrshagor/devlens-shared';
import type { DevLensErrorRecord, DevLensErrorSnapshot, DevLensErrorSource } from '../errors/types';

type ErrorStoreListener = (snapshot: DevLensErrorSnapshot) => void;

const MAX_ERROR_RECORDS = 100;

const snapshot: DevLensErrorSnapshot = {
  records: [],
  lastUpdatedAt: Date.now(),
};

const listeners = new Set<ErrorStoreListener>();

function createSnapshot(): DevLensErrorSnapshot {
  return {
    ...snapshot,
    records: snapshot.records.slice(),
  };
}

function notify() {
  const currentSnapshot = createSnapshot();
  listeners.forEach((listener) => listener(currentSnapshot));
}

export const errorStore = {
  getSnapshot() {
    return createSnapshot();
  },

  subscribe(listener: ErrorStoreListener) {
    listeners.add(listener);
    listener(createSnapshot());

    return () => {
      listeners.delete(listener);
    };
  },

  addError(input: { source: DevLensErrorSource; error: unknown; componentStack?: string }) {
    const error = input.error instanceof Error ? input.error : new Error(String(input.error));
    const timestamp = Date.now();

    const record: DevLensErrorRecord = {
      id: createDevLensId('error'),
      source: input.source,
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: input.componentStack,
      timestamp,
    };

    snapshot.records.unshift(record);

    if (snapshot.records.length > MAX_ERROR_RECORDS) {
      snapshot.records.length = MAX_ERROR_RECORDS;
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
