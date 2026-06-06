import React from 'react';
import type { NetworkRequestRecord } from '@codenrs/devlens-core';

export function RequestFlags({ request }: { request: NetworkRequestRecord }) {
  const hasFlags = request.isSlow || request.status === 'error';

  if (!hasFlags) return <span className="devlens-muted">--</span>;

  return (
    <div className="devlens-flags">
      {request.isSlow && <span className="devlens-badge devlens-badge-slow">Slow</span>}
      {request.status === 'error' && (
        <span className="devlens-badge devlens-badge-error">Error</span>
      )}
    </div>
  );
}
