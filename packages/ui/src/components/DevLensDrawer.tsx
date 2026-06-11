import React from 'react';
import type {
  ConsoleRecord,
  NetworkRequestRecord,
  PerformanceSnapshot,
} from '@nrshagor/devlens-core';
import type { DevLensTab, DevLensTabId, DevLensTheme } from '../types';
import { getNextTheme } from '../utils/format';
import { ConsolePanel } from './console/ConsolePanel';
import { NetworkPanel } from './network/NetworkPanel';
import { OverviewPanel } from './overview/OverviewPanel';
import { PerformancePanel } from './performance/PerformancePanel';
import { SettingsPanel } from './settings/SettingsPanel';
import { RoutesPanel } from './routes/RoutesPanel';
import { RenderPanel } from './render/RenderPanel';
import { ErrorPanel } from './errors/ErrorPanel';

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

  if (activeTab === 'performance') {
    return <PerformancePanel performanceSnapshot={performanceSnapshot} />;
  }

  if (activeTab === 'routes') {
    return <RoutesPanel />;
  }

  if (activeTab === 'render') {
    return <RenderPanel />;
  }

  if (activeTab === 'errors') {
    return <ErrorPanel />;
  }

  return <SettingsPanel theme={theme} onThemeChange={onThemeChange} />;
}

export function DevLensDrawer({
  open,
  requests,
  consoleRecords,
  performanceSnapshot,
  runtimeErrorCount,
  theme,
  activeTab,
  onActiveTabChange,
  onThemeChange,
  onClose,
}: {
  open: boolean;
  requests: NetworkRequestRecord[];
  consoleRecords: ConsoleRecord[];
  performanceSnapshot: PerformanceSnapshot;
  runtimeErrorCount: number;
  theme: DevLensTheme;
  activeTab: DevLensTabId;
  onActiveTabChange: (tab: DevLensTabId) => void;
  onThemeChange: (theme: DevLensTheme) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  const consoleErrorCount = consoleRecords.filter((record) => record.level === 'error').length;
  const apiErrorCount = requests.filter((request) => request.status === 'error').length;

  const tabs: DevLensTab[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'network', label: 'Network', badge: requests.length },
    { id: 'console', label: 'Console', badge: consoleErrorCount || consoleRecords.length },
    { id: 'performance', label: 'Performance' },
    { id: 'routes', label: 'Routes' },
    { id: 'render', label: 'Render' },
    { id: 'errors', label: 'Errors', badge: apiErrorCount + runtimeErrorCount },
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
            onClick={() => onThemeChange(getNextTheme(theme))}
          >
            Theme: {theme}
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
            onClick={() => onActiveTabChange(tab.id)}
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
