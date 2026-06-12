import React, { useEffect, useMemo, useState } from 'react';
import {
  consoleStore,
  devlensCore,
  errorStore,
  networkStore,
  performanceStore,
  renderStore,
  routeStore,
  type ConsoleRecord,
  type DevLensErrorSnapshot,
  type NetworkRequestRecord,
  type PerformanceSnapshot,
  type RenderSnapshot,
  type RouteSnapshot,
} from '@nrshagor/devlens-core';
import type { DevLensBarProps, DevLensTabId, DevLensTheme } from '../types';
import { readDevLensUiState, writeDevLensUiState } from '../utils/storage';
import { DevLensDrawer } from './DevLensDrawer';

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();

  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    target.isContentEditable
  );
}

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
  const [routeSnapshot, setRouteSnapshot] = useState<RouteSnapshot>(routeStore.getSnapshot());
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

    const unsubscribeNetworkStore = networkStore.subscribe(setRequests);
    const unsubscribeConsoleStore = consoleStore.subscribe(setConsoleRecords);
    const unsubscribePerformanceStore = performanceStore.subscribe(setPerformanceSnapshot);
    const unsubscribeRenderStore = renderStore.subscribe(setRenderSnapshot);
    const unsubscribeErrorStore = errorStore.subscribe(setErrorSnapshot);
    const unsubscribeRouteStore = routeStore.subscribe(setRouteSnapshot);

    return () => {
      unsubscribeNetworkStore();
      unsubscribeConsoleStore();
      unsubscribePerformanceStore();
      unsubscribeRenderStore();
      unsubscribeErrorStore();
      unsubscribeRouteStore();
    };
  }, []);

  const apiCount = requests.length;
  const runtimeErrorCount = errorSnapshot.records.length;
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
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const isDevLensToggle = event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'd';

      if (!isDevLensToggle || isEditableTarget(event.target)) {
        return;
      }

      event.preventDefault();

      setDrawerOpen((value) => {
        const nextValue = !value;
        writeDevLensUiState({ drawerOpen: nextValue });
        return nextValue;
      });
    };

    window.addEventListener('keydown', handleShortcut);

    return () => {
      window.removeEventListener('keydown', handleShortcut);
    };
  }, []);
  return (
    <div className={`devlens-root devlens-theme-${theme}`}>
      <DevLensDrawer
        open={drawerOpen}
        requests={requests}
        consoleRecords={consoleRecords}
        performanceSnapshot={performanceSnapshot}
        renderSnapshot={renderSnapshot}
        routeSnapshot={routeSnapshot}
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
        <span>Errors {runtimeErrorCount}</span>
        <span>Render {renderCount}</span>
        <span>FPS {performanceSnapshot.fps || '--'}</span>
      </div>
    </div>
  );
}
