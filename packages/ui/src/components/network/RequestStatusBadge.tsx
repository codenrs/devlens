import React from 'react';
import type { NetworkRequestRecord } from '@codenrs/devlens-core';

export function RequestStatusBadge({ request }: { request: NetworkRequestRecord }) {
  if (request.status === 'pending') return <span className="devlens-muted">Pending</span>;

  if (request.status === 'success') {
    return <span className="devlens-badge devlens-badge-success">{request.statusCode}</span>;
  }

  return <span className="devlens-badge devlens-badge-error">{request.statusCode ?? 'ERR'}</span>;
}
