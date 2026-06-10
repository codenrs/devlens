# @codenrs/devlens-next

Modern debugging and performance inspection toolkit for Next.js applications.

DevLens provides a lightweight in-app developer inspector inspired by Laravel Debugbar.

Monitor:

- API requests
- console logs
- runtime errors
- route changes
- component renders
- FPS and long tasks
- application performance

Supports both:

- Next.js App Router
- Next.js Pages Router

---

# Installation

Using npm:

```bash id="t9d3m1"
npm install @codenrs/devlens-next
```

Using pnpm:

```bash id="j6vn4m"
pnpm add @codenrs/devlens-next
```

Using yarn:

```bash id="u6v4pn"
yarn add @codenrs/devlens-next
```

---

# App Router Setup

## 1. Create a client component

Create:

```txt id="q8f4ps"
components/devlens-client.tsx
```

```tsx id="t8x9qf"
'use client';

import { NextDevLens } from '@codenrs/devlens-next';
import '@codenrs/devlens-next/styles.css';

export function DevLensClient() {
  return <NextDevLens />;
}
```

---

## 2. Add DevLens to your root layout

```tsx id="g1b9ne"
import { DevLensClient } from '@/components/devlens-client';

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

---

# Pages Router Setup

Add DevLens to:

```txt id="5c34jg"
pages/_app.tsx
```

```tsx id="k2t7qm"
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

---

# Render Tracking

Render tracking is opt-in to keep DevLens lightweight.

```tsx id="n4r2zb"
import { useDevLensRender } from '@codenrs/devlens-react';

function ProductCard() {
  useDevLensRender('ProductCard');

  return <div>Product</div>;
}
```

---

# Features

- Network request monitoring
- Console log tracking
- Runtime error monitoring
- FPS monitoring
- Long task monitoring
- Route navigation tracking
- Component render tracking
- Expandable debug drawer
- Dark, light, and system themes
- App Router support
- Pages Router support
- Development-only runtime safety

---

# License

AGPL-3.0-only

Created by **Noore Rabbi Shagor** under **CodeNRS**.
