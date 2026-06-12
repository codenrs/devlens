# DevLens

**See what your app is really doing.**

DevLens is a modern Laravel Debugbar-inspired developer toolkit for React and Next.js applications.

It provides a lightweight in-app inspector for monitoring:

- API requests
- Axios and Fetch traffic
- console logs
- runtime errors
- component renders
- route navigation
- FPS and long tasks
- application performance

Built for developers who want real-time frontend debugging without opening multiple browser tools.

Created by **Noore Rabbi Shagor**.

---

# Screenshots

## Floating Debugbar

![DevLens Floating Bar](docs/assets/devlens-floating-bar.png)

---

## Overview Panel

![DevLens Overview](docs/assets/devlens-overview.png)

---

## Network Details

![DevLens Network Details](docs/assets/devlens-network-details.png)

---

# Features

## Core Monitoring

- Floating developer debugbar
- Expandable inspector drawer
- Fetch API request monitoring
- Optional Axios request monitoring
- Console log/warn/error/info/debug capture
- Runtime error monitoring
- Unhandled promise rejection tracking
- Route navigation tracking
- FPS monitoring
- Long task monitoring
- Memory usage monitoring
- Duplicate API request detection

---

## React Developer Tools

- Component render tracking
- React error boundary tracking
- Render metrics
- Render history panel

---

## Developer Experience

- Keyboard shortcut toggle (`Ctrl + Shift + D`)
- Network request search and filtering
- Dark, light, and system themes
- Responsive drawer UI
- Development-first lightweight runtime design
- Zero configuration setup
- Safe development-only runtime behavior
- HMR-safe monitor lifecycle

---

## Framework Support

- React
- Next.js App Router
- Next.js Pages Router
- Vite
- CRA
- Client-side React applications

---

# Installation

## React

### pnpm

```bash
pnpm add @nrshagor/devlens-react
```

### npm

```bash
npm install @nrshagor/devlens-react
```

### yarn

```bash
yarn add @nrshagor/devlens-react
```

---

## Next.js

### pnpm

```bash
pnpm add @nrshagor/devlens-next
```

### npm

```bash
npm install @nrshagor/devlens-next
```

### yarn

```bash
yarn add @nrshagor/devlens-next
```

---

# React Setup

Add DevLens inside your main application component.

```tsx
import { DevLens } from '@nrshagor/devlens-react';
import '@nrshagor/devlens-react/styles.css';

export function App() {
  return (
    <>
      <YourApp />
      <DevLens />
    </>
  );
}
```

---

# Next.js Setup

## Step 1 — Create a client component

Create:

```txt
components/devlens-client.tsx
```

```tsx
'use client';

import { NextDevLens } from '@nrshagor/devlens-next';
import '@nrshagor/devlens-next/styles.css';

export function DevLensClient() {
  return <NextDevLens />;
}
```

---

## Step 2 — Add DevLens to your app

### App Router (`app/layout.tsx`)

```tsx
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

### Pages Router (`pages/_app.tsx`)

```tsx
import type { AppProps } from 'next/app';
import { DevLensClient } from '@/components/devlens-client';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <DevLensClient />
    </>
  );
}
```

---

# Render Tracking

Render tracking is opt-in to keep DevLens lightweight.

```tsx
import { useDevLensRender } from '@nrshagor/devlens-react';

function ProductCard() {
  useDevLensRender('ProductCard');

  return <div>Product</div>;
}
```

---

# Axios Monitoring

DevLens supports optional Axios monitoring without bundling Axios itself.

You provide your own Axios instance manually.

```tsx
import { useEffect } from 'react';
import axios from 'axios';

import {
  DevLens,
  installAxiosInterceptor,
  uninstallAxiosInterceptor,
} from '@nrshagor/devlens-react';

import '@nrshagor/devlens-react/styles.css';

const axiosClient = axios.create({
  baseURL: 'https://api.example.com',
});

export function App() {
  useEffect(() => {
    installAxiosInterceptor(axiosClient);

    return () => {
      uninstallAxiosInterceptor(axiosClient);
    };
  }, []);

  return (
    <>
      <YourApp />
      <DevLens />
    </>
  );
}
```

---

# Error Boundary Tracking

```tsx
import { DevLensErrorBoundary } from '@nrshagor/devlens-react';

export function App() {
  return (
    <DevLensErrorBoundary fallback={<p>Something went wrong.</p>}>
      <YourApp />
    </DevLensErrorBoundary>
  );
}
```

---

# Keyboard Shortcut

Toggle DevLens anywhere in development mode:

```txt
Ctrl + Shift + D
```

---

# Philosophy

DevLens should be:

- invisible by default
- powerful when expanded
- lightweight
- fast
- developer friendly

DevLens should never feel bloated, intrusive, or difficult to set up.

---

# Packages

- `@nrshagor/devlens-react`
- `@nrshagor/devlens-next`
- `@nrshagor/devlens-ui`
- `@nrshagor/devlens-core`
- `@nrshagor/devlens-shared`

---

# License

AGPL-3.0-only
