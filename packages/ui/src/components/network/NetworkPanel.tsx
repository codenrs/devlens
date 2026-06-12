import React, { useEffect, useMemo, useState } from 'react';
import type { NetworkRequestRecord } from '@nrshagor/devlens-core';
import { formatDuration } from '../../utils/format';
import { NetworkDetailsPanel } from './NetworkDetailsPanel';
import { RequestFlags } from './RequestFlags';
import { RequestStatusBadge } from './RequestStatusBadge';

type RequestFilter = 'all' | 'success' | 'error' | 'slow' | 'pending';

export function NetworkPanel({ requests }: { requests: NetworkRequestRecord[] }) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<RequestFilter>('all');

  const selectedRequest = requests.find((request) => request.id === selectedRequestId) ?? null;

  useEffect(() => {
    if (!selectedRequestId) return;

    const stillExists = requests.some((request) => request.id === selectedRequestId);

    if (!stillExists) setSelectedRequestId(null);
  }, [requests, selectedRequestId]);

  const filteredRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        request.url.toLowerCase().includes(normalizedSearch) ||
        request.method.toLowerCase().includes(normalizedSearch);

      if (!matchesSearch) return false;

      if (filter === 'success') {
        return request.status === 'success';
      }

      if (filter === 'error') {
        return request.status === 'error';
      }

      if (filter === 'slow') {
        return request.isSlow;
      }

      if (filter === 'pending') {
        return request.status === 'pending';
      }

      return true;
    });
  }, [requests, search, filter]);

  if (selectedRequest) {
    return (
      <NetworkDetailsPanel request={selectedRequest} onBack={() => setSelectedRequestId(null)} />
    );
  }

  return (
    <div className="devlens-panel">
      <div className="devlens-network-toolbar">
        <input
          type="text"
          placeholder="Search requests..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="devlens-network-search"
        />

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as RequestFilter)}
          className="devlens-network-filter"
        >
          <option value="all">All</option>
          <option value="success">Success</option>
          <option value="error">Error</option>
          <option value="slow">Slow</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="devlens-empty">No matching requests found.</div>
      ) : (
        <table className="devlens-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>URL</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Flags</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.map((request) => (
              <tr
                key={request.id}
                className="devlens-table-row-clickable"
                onClick={() => setSelectedRequestId(request.id)}
              >
                <td>{request.method}</td>

                <td className="devlens-url" title={request.url}>
                  {request.url}
                </td>

                <td>
                  <RequestStatusBadge request={request} />
                </td>

                <td>{formatDuration(request.duration)}</td>

                <td>
                  <RequestFlags request={request} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
