import React, { useEffect, useState } from 'react';
import { devlensCore, networkStore, type NetworkRequestRecord } from '@codenrs/devlens-core';

export type DevLensBarProps = {
  position?: 'bottom-left' | 'bottom-right';
};

type DevLensTabId = 'overview' | 'network' | 'console' | 'performance' | 'settings';

type DevLensTab = {
  id: DevLensTabId;
  label: string;
  badge?: number;
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

function PlaceholderPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="devlens-placeholder">
      <div className="devlens-placeholder-title">{title}</div>
      <p>{description}</p>
    </div>
  );
}
function formatDuration(value?: number) {
  if (!value) return '--';

  return `${value}ms`;
}

function OverviewMetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="devlens-overview-card">
      <span className="devlens-overview-label">{label}</span>
      <strong className="devlens-overview-value">{value}</strong>
      <span className="devlens-overview-hint">{hint}</span>
    </div>
  );
}

function OverviewPanel({ requests }: { requests: NetworkRequestRecord[] }) {
  const completedRequests = requests.filter((request) => request.status !== 'pending');
  const errorCount = requests.filter((request) => request.status === 'error').length;
  const slowCount = requests.filter((request) => request.isSlow).length;

  const totalDuration = completedRequests.reduce(
    (sum, request) => sum + (request.duration ?? 0),
    0,
  );

  const averageDuration =
    completedRequests.length > 0 ? Math.round(totalDuration / completedRequests.length) : undefined;

  const latestRequest = requests[0];

  return (
    <div className="devlens-overview">
      <div className="devlens-overview-grid">
        <OverviewMetricCard
          label="API Requests"
          value={requests.length}
          hint="Captured fetch calls"
        />
        <OverviewMetricCard label="Slow Requests" value={slowCount} hint="Successful slow APIs" />
        <OverviewMetricCard label="Errors" value={errorCount} hint="Failed API responses" />
        <OverviewMetricCard
          label="Avg Duration"
          value={formatDuration(averageDuration)}
          hint="Completed requests"
        />
      </div>

      <div className="devlens-overview-section">
        <div className="devlens-overview-section-title">Latest Request</div>

        {latestRequest ? (
          <div className="devlens-latest-request">
            <div className="devlens-latest-request-top">
              <span className="devlens-method-pill">{latestRequest.method}</span>
              <RequestStatusBadge request={latestRequest} />
              <RequestFlags request={latestRequest} />
            </div>

            <div className="devlens-details-url" title={latestRequest.url}>
              {latestRequest.url}
            </div>

            <div className="devlens-latest-request-meta">
              <span>Duration: {formatDuration(latestRequest.duration)}</span>
              <span>Status: {latestRequest.statusCode ?? latestRequest.status}</span>
            </div>
          </div>
        ) : (
          <div className="devlens-empty">No requests captured yet.</div>
        )}
      </div>
    </div>
  );
}

function DevLensTabContent({
  activeTab,
  requests,
}: {
  activeTab: DevLensTabId;
  requests: NetworkRequestRecord[];
}) {
  if (activeTab === 'network') {
    return <NetworkPanel requests={requests} />;
  }

  if (activeTab === 'overview') {
    return <OverviewPanel requests={requests} />;
  }

  if (activeTab === 'console') {
    return (
      <PlaceholderPanel
        title="Console"
        description="Console logs, warnings, errors, and traces will appear here in a future step."
      />
    );
  }

  if (activeTab === 'performance') {
    return (
      <PlaceholderPanel
        title="Performance"
        description="Performance metrics like FPS, memory usage, long tasks, and render timing will appear here."
      />
    );
  }

  return (
    <PlaceholderPanel
      title="Settings"
      description="DevLens preferences, theme, slow request threshold, and visibility options will appear here."
    />
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
  const [activeTab, setActiveTab] = useState<DevLensTabId>('network');

  if (!open) return null;

  const errorCount = requests.filter((request) => request.status === 'error').length;

  const tabs: DevLensTab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'network', label: 'Network', badge: requests.length },
    { id: 'console', label: 'Console', badge: errorCount },
    { id: 'performance', label: 'Performance' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="devlens-drawer">
      <div className="devlens-drawer-header">
        <div className="devlens-drawer-title">DevLens Inspector</div>

        <button type="button" className="devlens-close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="devlens-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`devlens-tab ${activeTab === tab.id ? 'devlens-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.label}</span>

            {typeof tab.badge === 'number' && tab.badge > 0 && (
              <span className="devlens-tab-badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      <DevLensTabContent activeTab={activeTab} requests={requests} />
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
