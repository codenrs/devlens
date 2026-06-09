import React, { useEffect, useState } from 'react';
import {
  installConsoleInterceptor,
  installFetchInterceptor,
  installFpsMonitor,
  installLongTaskMonitor,
  installRouteMonitor,
  installRuntimeErrorMonitor,
  uninstallConsoleInterceptor,
  uninstallFetchInterceptor,
  uninstallFpsMonitor,
  uninstallLongTaskMonitor,
  uninstallRouteMonitor,
  uninstallRuntimeErrorMonitor,
} from '@codenrs/devlens-core';
import { DevLensBar, type DevLensBarProps } from '@codenrs/devlens-ui';

export * from './useDevLensRender';
export * from './DevLensErrorBoundary';
export type { DevLensBarProps };

export type DevLensProps = DevLensBarProps & {
  enabled?: boolean;
};

export function DevLens({ enabled, ...props }: DevLensProps) {
  const shouldRender = enabled ?? process.env.NODE_ENV === 'development';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!shouldRender || !mounted) {
      return;
    }

    installFetchInterceptor();
    installConsoleInterceptor();
    installFpsMonitor();
    installLongTaskMonitor();
    installRouteMonitor();
    installRuntimeErrorMonitor();

    return () => {
      uninstallFetchInterceptor();
      uninstallConsoleInterceptor();
      uninstallFpsMonitor();
      uninstallLongTaskMonitor();
      uninstallRouteMonitor();
      uninstallRuntimeErrorMonitor();
    };
  }, [shouldRender, mounted]);

  if (!shouldRender || !mounted) {
    return null;
  }

  return <DevLensBar {...props} />;
}
