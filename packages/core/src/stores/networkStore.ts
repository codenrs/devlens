import type { NetworkRequestRecord } from '../network/types';

type NetworkStoreListener = (requests: NetworkRequestRecord[]) => void;

const MAX_NETWORK_REQUESTS = 200;

const requests: NetworkRequestRecord[] = [];
const listeners = new Set<NetworkStoreListener>();

function notify() {
  const snapshot = [...requests];
  listeners.forEach((listener) => listener(snapshot));
}

function trimRequests() {
  if (requests.length > MAX_NETWORK_REQUESTS) {
    requests.length = MAX_NETWORK_REQUESTS;
  }
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
    trimRequests();
    notify();
  },

  updateRequest(record: NetworkRequestRecord) {
    const index = requests.findIndex((request) => request.id === record.id);

    if (index === -1) {
      requests.unshift(record);
      trimRequests();
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
