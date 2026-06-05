import { createDevLensId, type DevLensEvent, type DevLensEventType } from '@codenrs/devlens-shared';

export * from './network';
export * from './stores/networkStore';
export * from './console';
export * from './stores/consoleStore';
export * from './performance';
export * from './stores/performanceStore';

type DevLensListener<TPayload = unknown> = (event: DevLensEvent<TPayload>) => void;

class DevLensCore {
  private listeners = new Map<DevLensEventType, Set<DevLensListener>>();
  private events: DevLensEvent[] = [];
  private maxEvents = 500;

  emit<TPayload = unknown>(type: DevLensEventType, payload?: TPayload): DevLensEvent<TPayload> {
    const event: DevLensEvent<TPayload> = {
      id: createDevLensId('event'),
      type,
      timestamp: Date.now(),
      payload,
    };

    this.events.push(event);

    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    this.listeners.get(type)?.forEach((listener) => listener(event));

    return event;
  }

  subscribe<TPayload = unknown>(
    type: DevLensEventType,
    listener: DevLensListener<TPayload>,
  ): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }

    this.listeners.get(type)?.add(listener as DevLensListener);

    return () => {
      this.listeners.get(type)?.delete(listener as DevLensListener);
    };
  }

  getEvents(): DevLensEvent[] {
    return [...this.events];
  }

  clear(): void {
    this.events = [];
  }
}

export const devlensCore = new DevLensCore();

export type { DevLensEvent, DevLensEventType };
