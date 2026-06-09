export type DevLensErrorSource = 'react' | 'runtime' | 'promise';

export type DevLensErrorRecord = {
  id: string;
  source: DevLensErrorSource;
  message: string;
  name?: string;
  stack?: string;
  componentStack?: string;
  timestamp: number;
};

export type DevLensErrorSnapshot = {
  records: DevLensErrorRecord[];
  lastUpdatedAt: number;
};
