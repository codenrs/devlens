'use client';

import { NextDevLens } from '@nrshagor/devlens-next';

export function DevLensClient() {
  return <NextDevLens defaultTheme="system" position="bottom-right" />;
}
