# Next.js Usage

DevLens provides Next.js integration through:

```tsx
import { NextDevLens } from '@codenrs/devlens-next';
```

DevLens supports:

- Next.js App Router
- Next.js Pages Router
- client-side route tracking
- hydration-safe rendering

## Install

Using npm:

```bash
npm install @codenrs/devlens-next @codenrs/devlens-ui
```

Using pnpm:

```bash
pnpm add @codenrs/devlens-next @codenrs/devlens-ui
```

Using yarn:

```bash
yarn add @codenrs/devlens-next @codenrs/devlens-ui
```

## App Router Setup

Create a client component.

Example:

```tsx
'use client';

import { NextDevLens } from '@codenrs/devlens-next';
import '@codenrs/devlens-ui/styles/devlens.css';

export function DevLensClient() {
  return <NextDevLens />;
}
```

Use the client component inside your root layout:

```tsx
import { DevLensClient } from '@/components/DevLensClient';

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

## Pages Router Setup

Inside `_app.tsx`:

```tsx
import type { AppProps } from 'next/app';

import { NextDevLens } from '@codenrs/devlens-next';
import '@codenrs/devlens-ui/styles/devlens.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />

      <NextDevLens />
    </>
  );
}
```

## Route Tracking

DevLens automatically tracks browser route navigation events.

Tracked navigation types include:

- pushState
- replaceState
- popstate
- hashchange

The Routes panel displays:

- current route
- previous route
- navigation history
- navigation timing

## Render Tracking

Render tracking remains opt-in in Next.js applications.

Example:

```tsx
import { useDevLensRender } from '@codenrs/devlens-react';

export function ProductCard() {
  useDevLensRender('ProductCard');

  return <div>Product</div>;
}
```

## Hydration Safety

DevLens uses mounted rendering guards to help avoid hydration mismatch issues.

The debug UI is rendered only after the client has mounted.

## Performance Philosophy

DevLens avoids:

- deep Next.js runtime patching
- expensive observers
- unnecessary serialization
- large retained snapshots

The goal is to remain lightweight inside modern Next.js applications.

## Recommended Usage

Recommended environments:

- local development
- debugging sessions
- staging environments

Production usage should remain optional and carefully evaluated.
