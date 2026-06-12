# @nrshagor/devlens-next

Modern debugging and performance inspection toolkit for Next.js applications.

DevLens provides a lightweight in-app developer inspector inspired by Laravel Debugbar.

Monitor:

- API requests
- Fetch and Axios traffic
- console logs
- runtime errors
- route navigation
- component renders
- FPS and long tasks
- memory usage
- application performance

Supports both:

- Next.js App Router
- Next.js Pages Router

Built for modern Next.js development workflows.

---

# Related Packages

- React package: `@nrshagor/devlens-react`

---

# Installation

## npm

```bash id="jgrj7k"
npm install @nrshagor/devlens-next
```

## pnpm

```bash id="p9m4rs"
pnpm add @nrshagor/devlens-next
```

## yarn

```bash id="d4p7ew"
yarn add @nrshagor/devlens-next
```

---

# App Router Setup

## Step 1 — Create a client component

Create:

```txt id="2vw6eo"
components/devlens-client.tsx
```

```tsx id="u8q1ha"
'use client';

import { NextDevLens } from '@nrshagor/devlens-next';
import '@nrshagor/devlens-next/styles.css';

export function DevLensClient() {
  return <NextDevLens />;
}
```

---

## Step 2 — Add DevLens to your root layout

```tsx id="q5k9ra"
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

```txt id="r8n5ob"
pages/_app.tsx
```

```tsx id="x7z3vk"
import type { AppProps } from 'next/app';

import { NextDevLens } from '@nrshagor/devlens-next';
import '@nrshagor/devlens-next/styles.css';

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

Render hooks come from the React package.

```tsx id="z7tv8a"
import { useDevLensRender } from '@nrshagor/devlens-react';

function ProductCard() {
  useDevLensRender('ProductCard');

  return <div>Product</div>;
}
```

---

# Axios Monitoring

DevLens supports optional Axios monitoring without bundling Axios itself.

You manually provide your Axios instance.

```tsx id="y2s6pm"
import { useEffect } from 'react';
import axios from 'axios';

import { installAxiosInterceptor, uninstallAxiosInterceptor } from '@nrshagor/devlens-react';

const axiosClient = axios.create({
  baseURL: 'https://api.example.com',
});

export function AxiosSetup() {
  useEffect(() => {
    installAxiosInterceptor(axiosClient);

    return () => {
      uninstallAxiosInterceptor(axiosClient);
    };
  }, []);

  return null;
}
```

---

# Features

## Monitoring

- Fetch API request monitoring
- Optional Axios request monitoring
- Console log/warn/error/info/debug capture
- Runtime error monitoring
- Unhandled promise rejection tracking
- FPS monitoring
- Long task monitoring
- Memory usage monitoring
- Route navigation tracking
- Duplicate API request detection

---

## React Developer Tools

- Component render tracking
- Render metrics
- Render history panel
- React error boundary tracking

---

## Developer Experience

- Floating developer debugbar
- Expandable inspector drawer
- Keyboard shortcut toggle (`Ctrl + Shift + D`)
- Network request filtering
- Searchable network panel
- Dark, light, and system themes
- Responsive drawer UI
- Zero configuration setup
- Lightweight development-first runtime design
- HMR-safe lifecycle handling

---

# Keyboard Shortcut

Toggle DevLens anywhere during development:

```txt id="k5x9re"
Ctrl + Shift + D
```

---

# Requirements

- Next.js 13+
- React 18+
- Client-side rendering support

---

# License

AGPL-3.0-only

Created by **Noore Rabbi Shagor**.
