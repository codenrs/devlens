export type PerformanceStatus = 'good' | 'warning' | 'poor' | 'idle';

export interface FpsSample {
  fps: number;
  timestamp: number;
}

export interface LongTaskRecord {
  id: string;
  name: string;
  startTime: number;
  duration: number;
  timestamp: number;
}

export interface MemorySnapshot {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usagePercent: number;
  supported: boolean;
  timestamp: number;
}

export interface PerformanceSnapshot {
  fps: number;
  averageFps: number;
  minFps: number;
  maxFps: number;
  status: PerformanceStatus;
  samples: FpsSample[];
  longTasks: LongTaskRecord[];
  memory?: MemorySnapshot;
  lastUpdatedAt: number;
}
