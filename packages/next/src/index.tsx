'use client';

import React from 'react';
import { DevLens, type DevLensProps } from '@nrshagor/devlens-react';

export type NextDevLensProps = DevLensProps;

export function NextDevLens(props: NextDevLensProps) {
  return <DevLens {...props} />;
}

export { DevLens };
export type { DevLensProps };
