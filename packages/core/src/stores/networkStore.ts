import type { NetworkRequestRecord } from '../network/types';

type NetworkStoreListener = (requests: NetworkRequestRecord[]) => void;

const MAX_NETWORK_REQUESTS = 200;
const DUPLICATE_REQUEST_WINDOW_MS = 1000;

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

function getRequestKey(record: NetworkRequestRecord) {
  return `${record.method.toUpperCase()} ${record.url}`;
}

function getDuplicateInfo(record: NetworkRequestRecord) {
  const requestKey = getRequestKey(record);

  const duplicateCount = requests.filter((request) => {
    if (request.id === record.id) return false;

    const isSameRequest = getRequestKey(request) === requestKey;
    const isInsideWindow =
      Math.abs(record.startTime - request.startTime) <= DUPLICATE_REQUEST_WINDOW_MS;

    return isSameRequest && isInsideWindow;
  }).length;

  return {
    isDuplicate: duplicateCount > 0,
    duplicateCount: duplicateCount > 0 ? duplicateCount + 1 : undefined,
  };
}

function applyDuplicateInfo(record: NetworkRequestRecord): NetworkRequestRecord {
  const duplicateInfo = getDuplicateInfo(record);

  return {
    ...record,
    ...duplicateInfo,
  };
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
    const nextRecord = applyDuplicateInfo(record);

    requests.unshift(nextRecord);
    trimRequests();
    notify();
  },

  updateRequest(record: NetworkRequestRecord) {
    const index = requests.findIndex((request) => request.id === record.id);

    if (index === -1) {
      const nextRecord = applyDuplicateInfo(record);

      requests.unshift(nextRecord);
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
