import React, { useEffect, useState } from 'react';
import type { NetworkRequestRecord } from '@nrshagor/devlens-core';
import { formatDuration } from '../../utils/format';
import { NetworkDetailsPanel } from './NetworkDetailsPanel';
import { RequestFlags } from './RequestFlags';
import { RequestStatusBadge } from './RequestStatusBadge';

export function NetworkPanel({ requests }: { requests: NetworkRequestRecord[] }) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const selectedRequest = requests.find((request) => request.id === selectedRequestId) ?? null;

  useEffect(() => {
    if (!selectedRequestId) return;

    const stillExists = requests.some((request) => request.id === selectedRequestId);

    if (!stillExists) setSelectedRequestId(null);
  }, [requests, selectedRequestId]);

  if (selectedRequest) {
    return (
      <NetworkDetailsPanel request={selectedRequest} onBack={() => setSelectedRequestId(null)} />
    );
  }

  if (requests.length === 0) {
    return <div className="devlens-empty">No network requests captured yet.</div>;
  }

  return (
    <div className="devlens-panel">
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
          {requests.map((request) => (
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
    </div>
  );
}
