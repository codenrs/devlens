import React, { useEffect } from 'react';
import { installFetchInterceptor, uninstallFetchInterceptor } from '@codenrs/devlens-core';
import { DevLensBar, type DevLensBarProps } from '@codenrs/devlens-ui';
import '@codenrs/devlens-ui/styles/devlens.css';

export type DevLensProps = DevLensBarProps & {
  enabled?: boolean;
};

export function DevLens({ enabled, ...props }: DevLensProps) {
  const shouldRender = enabled ?? process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    installFetchInterceptor();

    return () => {
      uninstallFetchInterceptor();
    };
  }, [shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return <DevLensBar {...props} />;
}
