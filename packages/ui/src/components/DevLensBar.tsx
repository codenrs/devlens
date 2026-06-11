import React, { useEffect, useMemo, useState } from 'react';
import {
  consoleStore,
  devlensCore,
  errorStore,
  networkStore,
  performanceStore,
  renderStore,
  type ConsoleRecord,
  type DevLensErrorSnapshot,
  type NetworkRequestRecord,
  type PerformanceSnapshot,
  type RenderSnapshot,
} from '@nrshagor/devlens-core';
import type { DevLensBarProps, DevLensTabId, DevLensTheme } from '../types';
import { readDevLensUiState, writeDevLensUiState } from '../utils/storage';
import { DevLensDrawer } from './DevLensDrawer';

export function DevLensBar({
  position = 'bottom-right',
  defaultTheme = 'system',
}: DevLensBarProps) {
  const storedUiState = readDevLensUiState();

  const [drawerOpen, setDrawerOpen] = useState(storedUiState.drawerOpen ?? false);
  const [activeTab, setActiveTab] = useState<DevLensTabId>(storedUiState.activeTab ?? 'network');
  const [theme, setTheme] = useState<DevLensTheme>(storedUiState.theme ?? defaultTheme);
  const [requests, setRequests] = useState<NetworkRequestRecord[]>([]);
  const [consoleRecords, setConsoleRecords] = useState<ConsoleRecord[]>([]);
  const [errorSnapshot, setErrorSnapshot] = useState<DevLensErrorSnapshot>({
    records: [],
    lastUpdatedAt: Date.now(),
  });
  const [renderSnapshot, setRenderSnapshot] = useState<RenderSnapshot>({
    records: [],
    lastUpdatedAt: Date.now(),
  });
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
    const unsubscribeRenderStore = renderStore.subscribe(setRenderSnapshot);
    const unsubscribeErrorStore = errorStore.subscribe(setErrorSnapshot);

    return () => {
      unsubscribeStore();
      unsubscribeConsoleStore();
      unsubscribePerformanceStore();
      unsubscribeRenderStore();
      unsubscribeErrorStore();
    };
  }, []);

  const apiCount = requests.length;
  // const apiErrorCount = requests.filter((request) => request.status === 'error').length;
  const runtimeErrorCount = errorSnapshot.records.length;
  // const totalErrorCount = apiErrorCount + runtimeErrorCount;
  const totalErrorCount = runtimeErrorCount;
  const slowCount = requests.filter((request) => request.isSlow).length;

  const renderCount = useMemo(
    () => renderSnapshot.records.reduce((sum, record) => sum + record.renderCount, 0),
    [renderSnapshot.records],
  );

  const handleDrawerToggle = () => {
    setDrawerOpen((value) => {
      const nextValue = !value;
      writeDevLensUiState({ drawerOpen: nextValue });
      return nextValue;
    });
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    writeDevLensUiState({ drawerOpen: false });
  };

  const handleTabChange = (tab: DevLensTabId) => {
    setActiveTab(tab);
    writeDevLensUiState({ activeTab: tab });
  };

  const handleThemeChange = (nextTheme: DevLensTheme) => {
    setTheme(nextTheme);
    writeDevLensUiState({ theme: nextTheme });
  };

  return (
    <div className={`devlens-root devlens-theme-${theme}`}>
      <DevLensDrawer
        open={drawerOpen}
        requests={requests}
        consoleRecords={consoleRecords}
        performanceSnapshot={performanceSnapshot}
        runtimeErrorCount={runtimeErrorCount}
        theme={theme}
        activeTab={activeTab}
        onActiveTabChange={handleTabChange}
        onThemeChange={handleThemeChange}
        onClose={handleDrawerClose}
      />

      <div className={`devlens-bar devlens-bar-${position}`} onClick={handleDrawerToggle}>
        <strong className="devlens-brand">DevLens</strong>
        <span>API {apiCount}</span>
        <span>Slow {slowCount}</span>
        <span>Errors {totalErrorCount}</span>
        <span>Render {renderCount}</span>
        <span>FPS {performanceSnapshot.fps || '--'}</span>
      </div>
    </div>
  );
}
