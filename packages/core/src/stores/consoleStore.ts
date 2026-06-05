import type { ConsoleRecord } from '../console/types';

type ConsoleStoreListener = (records: ConsoleRecord[]) => void;

const records: ConsoleRecord[] = [];
const listeners = new Set<ConsoleStoreListener>();

const MAX_CONSOLE_RECORDS = 300;

function notify() {
  const snapshot = [...records];
  listeners.forEach((listener) => listener(snapshot));
}

export const consoleStore = {
  getRecords() {
    return [...records];
  },

  subscribe(listener: ConsoleStoreListener) {
    listeners.add(listener);
    listener([...records]);

    return () => {
      listeners.delete(listener);
    };
  },

  addRecord(record: ConsoleRecord) {
    records.unshift(record);

    if (records.length > MAX_CONSOLE_RECORDS) {
      records.pop();
    }

    notify();
  },

  clear() {
    records.length = 0;
    notify();
  },
};
