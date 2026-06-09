# @codenrs/devlens-next

Next.js adapter for DevLens.

DevLens is a modern Laravel Debugbar-inspired debugging and performance inspection toolkit for Next.js applications.

Supports both:

- App Router
- Pages Router

## Installation

Using npm:

```bash id="rq9r6f"
npm install @codenrs/devlens-next
```

Using pnpm:

```bash id="3nh3s9"
pnpm add @codenrs/devlens-next
```

Using yarn:

```bash id="qqw7l9"
yarn add @codenrs/devlens-next
```

## App Router Usage

Create a client component:

```tsx id="zv38l8"
'use client';

import { NextDevLens } from '@codenrs/devlens-next';
import '@codenrs/devlens-next/styles.css';

export function DevLensClient() {
  return <NextDevLens />;
}
```

Then add it to your layout:

```tsx id="h8n0zu"
import { DevLensClient } from './DevLensClient';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <DevLensClient />
      </body>
    </html>
  );
}
```

## Pages Router Usage

```tsx id="rwea8m"
import type { AppProps } from 'next/app';

import { NextDevLens } from '@codenrs/devlens-next';
import '@codenrs/devlens-next/styles.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <NextDevLens />
    </>
  );
}
```

## Features

- Network monitoring
- Console tracking
- FPS monitoring
- Route tracking
- Render tracking
- Runtime error tracking
- Expandable debug drawer
- App Router support
- Pages Router support
- Dark and light themes
- Development-only runtime safety

## License

AGPL-3.0-only

Created by Noore Rabbi Shagor under CodeNRS.
