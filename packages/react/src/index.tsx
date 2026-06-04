import React from 'react';
import { DevLensBar, type DevLensBarProps } from '@codenrs/devlens-ui';

export type DevLensProps = DevLensBarProps & {
  enabled?: boolean;
};

export function DevLens({ enabled, ...props }: DevLensProps) {
  const shouldRender = enabled ?? process.env.NODE_ENV === 'development';

  if (!shouldRender) {
    return null;
  }

  return <DevLensBar {...props} />;
}
