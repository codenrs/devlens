import { createDevLensId, isBrowser } from '@codenrs/devlens-shared';
import { consoleStore } from '../stores/consoleStore';
import type { ConsoleLogLevel, ConsoleRecord } from './types';

const CONSOLE_METHODS: ConsoleLogLevel[] = ['log', 'info', 'warn', 'error', 'debug'];

const originalConsoleMethods = new Map<ConsoleLogLevel, (...args: unknown[]) => void>();

let installed = false;

function formatConsoleMessage(args: unknown[]) {
  return args
    .map((arg) => {
      if (typeof arg === 'string') return arg;

      if (arg instanceof Error) {
        return arg.stack || arg.message;
      }

      try {
        return JSON.stringify(arg, null, 2);
      } catch {
        return String(arg);
      }
    })
    .join(' ');
}

export function installConsoleInterceptor() {
  if (!isBrowser() || installed) {
    return;
  }

  installed = true;

  CONSOLE_METHODS.forEach((level) => {
    const currentMethod = console[level];

    if (typeof currentMethod !== 'function') {
      return;
    }

    const originalMethod = currentMethod.bind(console);
    originalConsoleMethods.set(level, originalMethod);

    const patchedMethod = (...args: unknown[]) => {
      const record: ConsoleRecord = {
        id: createDevLensId(`console-${level}`),
        level,
        args,
        message: formatConsoleMessage(args),
        timestamp: Date.now(),
      };

      consoleStore.addRecord(record);
      originalMethod(...args);
    };

    Object.defineProperty(console, level, {
      value: patchedMethod,
      configurable: true,
      writable: true,
    });
  });
}

export function uninstallConsoleInterceptor() {
  if (!installed) {
    return;
  }

  originalConsoleMethods.forEach((originalMethod, level) => {
    Object.defineProperty(console, level, {
      value: originalMethod,
      configurable: true,
      writable: true,
    });
  });

  originalConsoleMethods.clear();
  installed = false;
}
