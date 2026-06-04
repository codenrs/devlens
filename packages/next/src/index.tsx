'use client';

import React from 'react';
import { DevLens, type DevLensProps } from '@codenrs/devlens-react';

export function NextDevLens(props: DevLensProps) {
  return <DevLens {...props} />;
}

export { DevLens };
export type { DevLensProps };
