import type { NetworkRequestRecord } from '../network/types';

type NetworkStoreListener = (requests: NetworkRequestRecord[]) => void;

const requests: NetworkRequestRecord[] = [];
const listeners = new Set<NetworkStoreListener>();

function notify() {
  const snapshot = [...requests];
  listeners.forEach((listener) => listener(snapshot));
}

export const networkStore = {
  getRequests() {
    return [...requests];
  },

  subscribe(listener: NetworkStoreListener) {
    listeners.add(listener);
    listener([...requests]);

    return () => {
      listeners.delete(listener);
    };
  },

  addRequest(record: NetworkRequestRecord) {
    requests.unshift(record);
    notify();
  },

  updateRequest(record: NetworkRequestRecord) {
    const index = requests.findIndex((request) => request.id === record.id);

    if (index === -1) {
      requests.unshift(record);
    } else {
      requests[index] = {
        ...requests[index],
        ...record,
      };
    }

    notify();
  },

  clear() {
    requests.length = 0;
    notify();
  },
};
