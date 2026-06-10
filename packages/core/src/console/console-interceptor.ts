import { createDevLensId, isBrowser } from '@codenrs/devlens-shared';
import { consoleStore } from '../stores/consoleStore';
import type { ConsoleLogLevel, ConsoleRecord } from './types';

const CONSOLE_METHODS: ConsoleLogLevel[] = ['log', 'info', 'warn', 'error', 'debug'];

const MAX_CONSOLE_ARG_LENGTH = 3000;
const MAX_CONSOLE_MESSAGE_LENGTH = 6000;

const originalConsoleMethods = new Map<ConsoleLogLevel, (...args: unknown[]) => void>();

let installed = false;
let installCount = 0;
let isCapturing = false;

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;

  return `${value.slice(0, maxLength)}... [truncated]`;
}

function safeStringify(value: unknown) {
  const seen = new WeakSet<object>();

  try {
    return JSON.stringify(
      value,
      (_key, nestedValue) => {
        if (typeof nestedValue === 'object' && nestedValue !== null) {
          if (seen.has(nestedValue)) {
            return '[Circular]';
          }

          seen.add(nestedValue);
        }

        if (typeof nestedValue === 'function') {
          return `[Function ${nestedValue.name || 'anonymous'}]`;
        }

        if (typeof nestedValue === 'bigint') {
          return nestedValue.toString();
        }

        return nestedValue;
      },
      2,
    );
  } catch {
    return String(value);
  }
}

function formatConsoleArg(arg: unknown) {
  if (typeof arg === 'string') return truncate(arg, MAX_CONSOLE_ARG_LENGTH);

  if (arg instanceof Error) {
    return truncate(arg.stack || arg.message, MAX_CONSOLE_ARG_LENGTH);
  }

  if (arg === undefined) return 'undefined';
  if (arg === null) return 'null';

  return truncate(safeStringify(arg), MAX_CONSOLE_ARG_LENGTH);
}

function formatConsoleMessage(args: unknown[]) {
  const message = args.map(formatConsoleArg).join(' ');

  return truncate(message, MAX_CONSOLE_MESSAGE_LENGTH);
}

function sanitizeArgs(args: unknown[]) {
  return args.map((arg) => {
    if (typeof arg === 'string') return truncate(arg, MAX_CONSOLE_ARG_LENGTH);

    if (arg instanceof Error) {
      return truncate(arg.stack || arg.message, MAX_CONSOLE_ARG_LENGTH);
    }

    return formatConsoleArg(arg);
  });
}

export function installConsoleInterceptor() {
  if (!isBrowser()) {
    return;
  }

  installCount += 1;

  if (installed) {
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
      originalMethod(...args);

      if (isCapturing) {
        return;
      }

      isCapturing = true;

      try {
        const record: ConsoleRecord = {
          id: createDevLensId(`console-${level}`),
          level,
          args: sanitizeArgs(args),
          message: formatConsoleMessage(args),
          timestamp: Date.now(),
        };

        consoleStore.addRecord(record);
      } finally {
        isCapturing = false;
      }
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

  installCount = Math.max(0, installCount - 1);

  if (installCount > 0) {
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
  isCapturing = false;
}
