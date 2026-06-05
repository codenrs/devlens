export type PerformanceStatus = 'good' | 'warning' | 'poor' | 'idle';

export interface FpsSample {
  fps: number;
  timestamp: number;
}

export interface PerformanceSnapshot {
  fps: number;
  averageFps: number;
  minFps: number;
  maxFps: number;
  status: PerformanceStatus;
  samples: FpsSample[];
  lastUpdatedAt: number;
}
