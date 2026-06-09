import { useEffect, useRef } from 'react';
import { renderStore } from '@codenrs/devlens-core';

export function useDevLensRender(componentName: string) {
  const startedAt = useRef(0);

  startedAt.current = performance.now();

  useEffect(() => {
    const duration = performance.now() - startedAt.current;

    renderStore.trackRender(componentName, duration);
  });
}
