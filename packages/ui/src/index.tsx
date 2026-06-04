import React, { useEffect, useState } from 'react';
import { devlensCore } from '@codenrs/devlens-core';

type DevLensBarPosition = 'bottom-left' | 'bottom-right';

export type DevLensBarProps = {
  position?: DevLensBarPosition;
};

export function DevLensBar({ position = 'bottom-right' }: DevLensBarProps) {
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    devlensCore.emit('devlens:init', {
      source: 'ui',
    });

    setEventCount(devlensCore.getEvents().length);
  }, []);

  const positionStyle =
    position === 'bottom-left' ? { left: 16, right: 'auto' } : { right: 16, left: 'auto' };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        ...positionStyle,
        zIndex: 999999,
        height: 44,
        padding: '0 14px',
        borderRadius: 999,
        background: 'rgba(12, 12, 24, 0.92)',
        color: '#ffffff',
        border: '1px solid rgba(168, 85, 247, 0.45)',
        boxShadow: '0 10px 35px rgba(168, 85, 247, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: 13,
        backdropFilter: 'blur(12px)',
      }}
    >
      <strong style={{ color: '#c084fc' }}>DevLens</strong>
      <span>Events {eventCount}</span>
      <span>API 0</span>
      <span>Errors 0</span>
      <span>FPS --</span>
    </div>
  );
}
