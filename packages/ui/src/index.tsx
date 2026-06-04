import React, { useEffect, useState } from 'react';
import { devlensCore, networkStore, type NetworkRequestRecord } from '@codenrs/devlens-core';

export type DevLensBarProps = {
  position?: 'bottom-left' | 'bottom-right';
};

function RequestStatusBadge({ request }: { request: NetworkRequestRecord }) {
  if (request.status === 'pending') {
    return <span className="devlens-muted">Pending</span>;
  }

  if (request.status === 'success') {
    return <span className="devlens-badge devlens-badge-success">{request.statusCode}</span>;
  }

  return <span className="devlens-badge devlens-badge-error">{request.statusCode ?? 'ERR'}</span>;
}

function RequestFlags({ request }: { request: NetworkRequestRecord }) {
  const hasFlags = request.isSlow || request.status === 'error';

  if (!hasFlags) {
    return <span className="devlens-muted">--</span>;
  }

  return (
    <div className="devlens-flags">
      {request.isSlow && <span className="devlens-badge devlens-badge-slow">Slow</span>}

      {request.status === 'error' && (
        <span className="devlens-badge devlens-badge-error">Error</span>
      )}
    </div>
  );
}

function NetworkDetailsPanel({
  request,
  onBack,
}: {
  request: NetworkRequestRecord;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(request.url);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="devlens-details">
      <div className="devlens-details-toolbar">
        <button type="button" className="devlens-back-button" onClick={onBack}>
          ← Back
        </button>

        <button type="button" className="devlens-copy-button" onClick={handleCopyUrl}>
          {copied ? 'Copied' : 'Copy URL'}
        </button>
      </div>

      <div className="devlens-details-card">
        <div className="devlens-details-title-row">
          <span className="devlens-method-pill">{request.method}</span>
          <RequestStatusBadge request={request} />
          <RequestFlags request={request} />
        </div>

        <div className="devlens-details-url" title={request.url}>
          {request.url}
        </div>
      </div>

      <div className="devlens-details-grid">
        <div className="devlens-detail-item">
          <span className="devlens-detail-label">Status</span>
          <strong>{request.status}</strong>
        </div>

        <div className="devlens-detail-item">
          <span className="devlens-detail-label">Status Code</span>
          <strong>{request.statusCode ?? '--'}</strong>
        </div>

        <div className="devlens-detail-item">
          <span className="devlens-detail-label">Duration</span>
          <strong>{request.duration ? `${request.duration}ms` : '--'}</strong>
        </div>

        <div className="devlens-detail-item">
          <span className="devlens-detail-label">Slow</span>
          <strong>{request.isSlow ? 'Yes' : 'No'}</strong>
        </div>

        <div className="devlens-detail-item">
          <span className="devlens-detail-label">Start Time</span>
          <strong>{Math.round(request.startTime)}ms</strong>
        </div>

        <div className="devlens-detail-item">
          <span className="devlens-detail-label">End Time</span>
          <strong>{request.endTime ? `${Math.round(request.endTime)}ms` : '--'}</strong>
        </div>
      </div>

      {request.errorMessage && (
        <div className="devlens-error-box">
          <div className="devlens-error-title">Error Message</div>
          <pre>{request.errorMessage}</pre>
        </div>
      )}
    </div>
  );
}

function NetworkPanel({ requests }: { requests: NetworkRequestRecord[] }) {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const selectedRequest = requests.find((request) => request.id === selectedRequestId) ?? null;

  useEffect(() => {
    if (!selectedRequestId) return;

    const stillExists = requests.some((request) => request.id === selectedRequestId);

    if (!stillExists) {
      setSelectedRequestId(null);
    }
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

              <td>{request.duration ? `${request.duration}ms` : '--'}</td>

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

function DevLensDrawer({
  open,
  requests,
  onClose,
}: {
  open: boolean;
  requests: NetworkRequestRecord[];
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="devlens-drawer">
      <div className="devlens-drawer-header">
        <div className="devlens-drawer-title">DevLens Inspector</div>

        <button type="button" className="devlens-close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="devlens-tabs">
        <button type="button" className="devlens-tab">
          Network
        </button>
      </div>

      <NetworkPanel requests={requests} />
    </div>
  );
}

export function DevLensBar({ position = 'bottom-right' }: DevLensBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [requests, setRequests] = useState<NetworkRequestRecord[]>([]);

  useEffect(() => {
    devlensCore.emit('devlens:init', { source: 'ui' });

    const unsubscribeStore = networkStore.subscribe(setRequests);

    return () => {
      unsubscribeStore();
    };
  }, []);

  const apiCount = requests.length;
  const errorCount = requests.filter((request) => request.status === 'error').length;
  const slowCount = requests.filter((request) => request.isSlow).length;

  return (
    <div className="devlens-root">
      <DevLensDrawer open={drawerOpen} requests={requests} onClose={() => setDrawerOpen(false)} />

      <div
        className={`devlens-bar devlens-bar-${position}`}
        onClick={() => setDrawerOpen((value) => !value)}
      >
        <strong className="devlens-brand">DevLens</strong>
        <span>API {apiCount}</span>
        <span>Slow {slowCount}</span>
        <span>Errors {errorCount}</span>
        <span>FPS --</span>
      </div>
    </div>
  );
}
