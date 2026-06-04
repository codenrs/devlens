export type DevLensEnvironment = 'development' | 'production' | 'test';

export type DevLensSeverity = 'info' | 'warning' | 'error';

export type DevLensEventType =
  | 'devlens:init'
  | 'network:request'
  | 'network:response'
  | 'network:error'
  | 'network:slow'
  | 'console:log'
  | 'console:warn'
  | 'console:error'
  | 'runtime:error'
  | 'performance:metric'
  | 'react:render'
  | 'next:route';

export interface DevLensEvent<TPayload = unknown> {
  id: string;
  type: DevLensEventType;
  timestamp: number;
  payload?: TPayload;
}

export interface DevLensPlugin {
  name: string;
  setup: () => void | (() => void);
}

export const createDevLensId = (prefix = 'devlens'): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};

export const isDevelopment = (): boolean => {
  return typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
};
