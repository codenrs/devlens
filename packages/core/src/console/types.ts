export type ConsoleLogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

export interface ConsoleRecord {
  id: string;
  level: ConsoleLogLevel;
  args: unknown[];
  message: string;
  timestamp: number;
}
