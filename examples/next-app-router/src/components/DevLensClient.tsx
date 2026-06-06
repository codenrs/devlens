'use client';

import { NextDevLens } from '@codenrs/devlens-next';

export function DevLensClient() {
  return <NextDevLens defaultTheme="system" position="bottom-right" />;
}
