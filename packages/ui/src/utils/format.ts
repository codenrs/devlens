import type { PerformanceSnapshot } from '@codenrs/devlens-core';
import type { DevLensTheme } from '../types';

export function formatDuration(value?: number) {
  if (!value) return '--';
  return `${value}ms`;
}

export function formatFps(value?: number) {
  if (!value) return '--';
  return value;
}

export function formatConsoleTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString();
}

export function formatPerformanceTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString();
}

export function getFpsStatusLabel(status: PerformanceSnapshot['status']) {
  if (status === 'good') return 'Good';
  if (status === 'warning') return 'Warning';
  if (status === 'poor') return 'Poor';
  return 'Idle';
}

export function getPerformanceStatusClass(fps: number) {
  if (fps >= 50) return 'good';
  if (fps >= 30) return 'warning';
  return 'poor';
}

export function getNextTheme(theme: DevLensTheme): DevLensTheme {
  if (theme === 'system') return 'dark';
  if (theme === 'dark') return 'light';
  return 'system';
}
