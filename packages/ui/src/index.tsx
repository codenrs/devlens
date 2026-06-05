import React, { useEffect, useState } from 'react';
import {
  consoleStore,
  devlensCore,
  networkStore,
  performanceStore,
  type ConsoleRecord,
  type NetworkRequestRecord,
  type PerformanceSnapshot,
} from '@codenrs/devlens-core';

export type DevLensTheme = 'dark' | 'light';

export type DevLensBarProps = {
  position?: 'bottom-left' | 'bottom-right';
  defaultTheme?: DevLensTheme;
};

type DevLensTabId = 'overview' | 'network' | 'console' | 'performance' | 'settings';

type DevLensTab = {
  id: DevLensTabId;
  label: string;
  badge?: number;
};

function RequestStatusBadge({ request }: { request: NetworkRequestRecord }) {
  if (request.status === 'pending') return <span className="devlens-muted">Pending</span>;

  if (request.status === 'success') {
    return <span className="devlens-badge devlens-badge-success">{request.statusCode}</span>;
  }

  return <span className="devlens-badge devlens-badge-error">{request.statusCode ?? 'ERR'}</span>;
}

function RequestFlags({ request }: { request: NetworkRequestRecord }) {
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
      window.setTimeout(() => setCopied(false), 1200);
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

function formatFps(value?: number) {
  if (!value) return '--';
  return value;
}

function formatConsoleTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString();
}

function formatPerformanceTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString();
}

function getFpsStatusLabel(status: PerformanceSnapshot['status']) {
  if (status === 'good') return 'Good';
  if (status === 'warning') return 'Warning';
  if (status === 'poor') return 'Poor';
  return 'Idle';
}

function getPerformanceStatusClass(fps: number) {
  if (fps >= 50) return 'good';
  if (fps >= 30) return 'warning';
  return 'poor';
}

function OverviewMetricCard({
  label,
  value,
  hint,
  status,
}: {
  label: string;
  value: string | number;
  hint: string;
  status?: PerformanceSnapshot['status'];
}) {
  return (
    <div className="devlens-overview-card">
      <div className="devlens-overview-card-head">
        <span className="devlens-overview-label">{label}</span>

        {status && (
          <span className={`devlens-status-pill devlens-status-pill-${status}`}>
            {getFpsStatusLabel(status)}
          </span>
        )}
      </div>

      <strong className="devlens-overview-value">{value}</strong>
      <span className="devlens-overview-hint">{hint}</span>
    </div>
  );
}

function ConsoleMessage({ message, compact = false }: { message: string; compact?: boolean }) {
  return (
    <pre
      className={
        compact
          ? 'devlens-console-message devlens-console-message-compact'
          : 'devlens-console-message'
      }
    >
      {message}
    </pre>
  );
}

function OverviewPanel({
  requests,
  consoleRecords,
  performanceSnapshot,
}: {
  requests: NetworkRequestRecord[];
  consoleRecords: ConsoleRecord[];
  performanceSnapshot: PerformanceSnapshot;
}) {
  const completedRequests = requests.filter((request) => request.status !== 'pending');
  const errorCount = requests.filter((request) => request.status === 'error').length;
  const slowCount = requests.filter((request) => request.isSlow).length;
  const consoleErrorCount = consoleRecords.filter((record) => record.level === 'error').length;
  const consoleWarnCount = consoleRecords.filter((record) => record.level === 'warn').length;

  const totalDuration = completedRequests.reduce(
    (sum, request) => sum + (request.duration ?? 0),
    0,
  );
  const averageDuration =
    completedRequests.length > 0 ? Math.round(totalDuration / completedRequests.length) : undefined;

  const latestRequest = requests[0];
  const latestConsoleRecord = consoleRecords[0];

  return (
    <div className="devlens-overview">
      <div className="devlens-overview-grid">
        <OverviewMetricCard
          label="API Requests"
          value={requests.length}
          hint="Captured fetch calls"
        />
        <OverviewMetricCard label="Slow Requests" value={slowCount} hint="Successful slow APIs" />
        <OverviewMetricCard label="API Errors" value={errorCount} hint="Failed API responses" />
        <OverviewMetricCard
          label="Avg Duration"
          value={formatDuration(averageDuration)}
          hint="Completed requests"
        />
      </div>

      <div className="devlens-overview-grid devlens-overview-grid-compact">
        <OverviewMetricCard
          label="Console Logs"
          value={consoleRecords.length}
          hint="Captured console entries"
        />
        <OverviewMetricCard label="Warnings" value={consoleWarnCount} hint="console.warn entries" />
        <OverviewMetricCard
          label="Console Errors"
          value={consoleErrorCount}
          hint="console.error entries"
        />
        <OverviewMetricCard
          label="FPS"
          value={formatFps(performanceSnapshot.fps)}
          hint={`Avg ${formatFps(performanceSnapshot.averageFps)} FPS`}
          status={performanceSnapshot.status}
        />
      </div>

      <div className="devlens-overview-split">
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

        <div className="devlens-overview-section">
          <div className="devlens-overview-section-title">Latest Console</div>

          {latestConsoleRecord ? (
            <div
              className={`devlens-overview-console devlens-console-row-${latestConsoleRecord.level}`}
            >
              <div className="devlens-console-meta">
                <span
                  className={`devlens-console-level devlens-console-level-${latestConsoleRecord.level}`}
                >
                  {latestConsoleRecord.level}
                </span>

                <span className="devlens-console-time">
                  {formatConsoleTime(latestConsoleRecord.timestamp)}
                </span>
              </div>

              <ConsoleMessage message={latestConsoleRecord.message} compact />
            </div>
          ) : (
            <div className="devlens-empty">No console logs captured yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConsolePanel({ records }: { records: ConsoleRecord[] }) {
  const warnCount = records.filter((record) => record.level === 'warn').length;
  const errorCount = records.filter((record) => record.level === 'error').length;

  return (
    <div className="devlens-console">
      <div className="devlens-console-toolbar">
        <div className="devlens-console-summary">
          <strong>{records.length}</strong>
          <span>logs</span>
          <span>•</span>
          <span>{warnCount} warnings</span>
          <span>•</span>
          <span>{errorCount} errors</span>
        </div>

        <button
          type="button"
          className="devlens-clear-button"
          onClick={() => consoleStore.clear()}
          disabled={records.length === 0}
        >
          Clear
        </button>
      </div>

      {records.length === 0 ? (
        <div className="devlens-empty">No console logs captured yet.</div>
      ) : (
        <div className="devlens-console-panel">
          {records.map((record) => (
            <div
              key={record.id}
              className={`devlens-console-row devlens-console-row-${record.level}`}
            >
              <div className="devlens-console-meta">
                <span className={`devlens-console-level devlens-console-level-${record.level}`}>
                  {record.level}
                </span>

                <span className="devlens-console-time">{formatConsoleTime(record.timestamp)}</span>
              </div>

              <ConsoleMessage message={record.message} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PerformancePanel({ performanceSnapshot }: { performanceSnapshot: PerformanceSnapshot }) {
  const samples = performanceSnapshot.samples.slice(-24);
  const latestLongTask = performanceSnapshot.longTasks[0];

  return (
    <div className="devlens-performance">
      <div className="devlens-overview-grid">
        <OverviewMetricCard
          label="Current FPS"
          value={formatFps(performanceSnapshot.fps)}
          hint="requestAnimationFrame based"
          status={performanceSnapshot.status}
        />

        <OverviewMetricCard
          label="Average FPS"
          value={formatFps(performanceSnapshot.averageFps)}
          hint="Last 60 samples"
        />

        <OverviewMetricCard
          label="Long Tasks"
          value={performanceSnapshot.longTasks.length}
          hint="Main thread blocking"
        />

        <OverviewMetricCard
          label="Latest Block"
          value={latestLongTask ? formatDuration(latestLongTask.duration) : '--'}
          hint="Most recent long task"
        />
      </div>

      <div className="devlens-overview-section">
        <div className="devlens-overview-section-title">FPS Timeline</div>

        {samples.length === 0 ? (
          <div className="devlens-empty">FPS samples will appear here shortly.</div>
        ) : (
          <div className="devlens-fps-bars">
            {samples.map((sample) => (
              <div
                key={sample.timestamp}
                className="devlens-fps-bar-wrap"
                title={`${sample.fps} FPS`}
              >
                <div
                  className={`devlens-fps-bar devlens-fps-bar-${getPerformanceStatusClass(sample.fps)}`}
                  style={{ height: `${Math.max(8, Math.min(100, (sample.fps / 60) * 100))}%` }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="devlens-overview-section">
        <div className="devlens-section-toolbar">
          <div className="devlens-overview-section-title">Long Tasks</div>

          <button
            type="button"
            className="devlens-clear-button"
            onClick={() => performanceStore.clearLongTasks()}
            disabled={performanceSnapshot.longTasks.length === 0}
          >
            Clear
          </button>
        </div>

        {performanceSnapshot.longTasks.length === 0 ? (
          <div className="devlens-empty">No long tasks detected yet.</div>
        ) : (
          <div className="devlens-long-task-list">
            {performanceSnapshot.longTasks.map((task) => (
              <div key={task.id} className="devlens-long-task-row">
                <div className="devlens-long-task-main">
                  <span className="devlens-badge devlens-badge-slow">
                    {formatDuration(task.duration)}
                  </span>

                  <span className="devlens-long-task-name">{task.name}</span>
                </div>

                <span className="devlens-console-time">
                  {formatPerformanceTime(task.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsPanel({
  theme,
  onThemeChange,
}: {
  theme: DevLensTheme;
  onThemeChange: (theme: DevLensTheme) => void;
}) {
  return (
    <div className="devlens-settings">
      <div className="devlens-overview-section">
        <div className="devlens-overview-section-title">Appearance</div>

        <div className="devlens-setting-row">
          <div>
            <div className="devlens-setting-title">Theme</div>
            <div className="devlens-setting-description">
              Switch DevLens UI between dark and light mode.
            </div>
          </div>

          <div className="devlens-theme-switch">
            <button
              type="button"
              className={`devlens-theme-option ${theme === 'dark' ? 'devlens-theme-option-active' : ''}`}
              onClick={() => onThemeChange('dark')}
            >
              Dark
            </button>

            <button
              type="button"
              className={`devlens-theme-option ${theme === 'light' ? 'devlens-theme-option-active' : ''}`}
              onClick={() => onThemeChange('light')}
            >
              Light
            </button>
          </div>
        </div>
      </div>

      <div className="devlens-overview-section">
        <div className="devlens-overview-section-title">Developer UX</div>
        <p className="devlens-settings-text">
          More preferences like slow request threshold, default tab, and panel size will be added in
          later steps.
        </p>
      </div>
    </div>
  );
}

function DevLensTabContent({
  activeTab,
  requests,
  consoleRecords,
  performanceSnapshot,
  theme,
  onThemeChange,
}: {
  activeTab: DevLensTabId;
  requests: NetworkRequestRecord[];
  consoleRecords: ConsoleRecord[];
  performanceSnapshot: PerformanceSnapshot;
  theme: DevLensTheme;
  onThemeChange: (theme: DevLensTheme) => void;
}) {
  if (activeTab === 'network') return <NetworkPanel requests={requests} />;

  if (activeTab === 'overview') {
    return (
      <OverviewPanel
        requests={requests}
        consoleRecords={consoleRecords}
        performanceSnapshot={performanceSnapshot}
      />
    );
  }

  if (activeTab === 'console') return <ConsolePanel records={consoleRecords} />;

  if (activeTab === 'performance')
    return <PerformancePanel performanceSnapshot={performanceSnapshot} />;

  return <SettingsPanel theme={theme} onThemeChange={onThemeChange} />;
}

function DevLensDrawer({
  open,
  requests,
  consoleRecords,
  performanceSnapshot,
  theme,
  onThemeChange,
  onClose,
}: {
  open: boolean;
  requests: NetworkRequestRecord[];
  consoleRecords: ConsoleRecord[];
  performanceSnapshot: PerformanceSnapshot;
  theme: DevLensTheme;
  onThemeChange: (theme: DevLensTheme) => void;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<DevLensTabId>('network');

  if (!open) return null;

  const consoleErrorCount = consoleRecords.filter((record) => record.level === 'error').length;

  const tabs: DevLensTab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'network', label: 'Network', badge: requests.length },
    { id: 'console', label: 'Console', badge: consoleErrorCount || consoleRecords.length },
    { id: 'performance', label: 'Performance' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="devlens-drawer">
      <div className="devlens-drawer-header">
        <div className="devlens-drawer-title">DevLens Inspector</div>

        <div className="devlens-drawer-actions">
          <button
            type="button"
            className="devlens-header-action"
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>

          <button type="button" className="devlens-close-button" onClick={onClose}>
            ×
          </button>
        </div>
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

      <DevLensTabContent
        activeTab={activeTab}
        requests={requests}
        consoleRecords={consoleRecords}
        performanceSnapshot={performanceSnapshot}
        theme={theme}
        onThemeChange={onThemeChange}
      />
    </div>
  );
}

export function DevLensBar({ position = 'bottom-right', defaultTheme = 'dark' }: DevLensBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [theme, setTheme] = useState<DevLensTheme>(defaultTheme);
  const [requests, setRequests] = useState<NetworkRequestRecord[]>([]);
  const [consoleRecords, setConsoleRecords] = useState<ConsoleRecord[]>([]);
  const [performanceSnapshot, setPerformanceSnapshot] = useState<PerformanceSnapshot>({
    fps: 0,
    averageFps: 0,
    minFps: 0,
    maxFps: 0,
    status: 'idle',
    samples: [],
    longTasks: [],
    lastUpdatedAt: Date.now(),
  });

  useEffect(() => {
    devlensCore.emit('devlens:init', { source: 'ui' });

    const unsubscribeStore = networkStore.subscribe(setRequests);
    const unsubscribeConsoleStore = consoleStore.subscribe(setConsoleRecords);
    const unsubscribePerformanceStore = performanceStore.subscribe(setPerformanceSnapshot);

    return () => {
      unsubscribeStore();
      unsubscribeConsoleStore();
      unsubscribePerformanceStore();
    };
  }, []);

  const apiCount = requests.length;
  const errorCount = requests.filter((request) => request.status === 'error').length;
  const slowCount = requests.filter((request) => request.isSlow).length;

  return (
    <div className={`devlens-root devlens-theme-${theme}`}>
      <DevLensDrawer
        open={drawerOpen}
        requests={requests}
        consoleRecords={consoleRecords}
        performanceSnapshot={performanceSnapshot}
        theme={theme}
        onThemeChange={setTheme}
        onClose={() => setDrawerOpen(false)}
      />

      <div
        className={`devlens-bar devlens-bar-${position}`}
        onClick={() => setDrawerOpen((value) => !value)}
      >
        <strong className="devlens-brand">DevLens</strong>
        <span>API {apiCount}</span>
        <span>Slow {slowCount}</span>
        <span>Errors {errorCount}</span>
        <span>FPS {performanceSnapshot.fps || '--'}</span>
      </div>
    </div>
  );
}
