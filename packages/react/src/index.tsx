import React, { useEffect, useState } from 'react';
import {
  installConsoleInterceptor,
  installFetchInterceptor,
  installFpsMonitor,
  installLongTaskMonitor,
  uninstallConsoleInterceptor,
  uninstallFetchInterceptor,
  uninstallFpsMonitor,
  uninstallLongTaskMonitor,
  installRouteMonitor,
  uninstallRouteMonitor,
} from '@codenrs/devlens-core';
import { DevLensBar, type DevLensBarProps } from '@codenrs/devlens-ui';

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

    return () => {
      uninstallFetchInterceptor();
      uninstallConsoleInterceptor();
      uninstallFpsMonitor();
      uninstallLongTaskMonitor();
      uninstallRouteMonitor();
    };
  }, [shouldRender, mounted]);

  if (!shouldRender || !mounted) {
    return null;
  }

  return <DevLensBar {...props} />;
}
