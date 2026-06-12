# @nrshagor/devlens-react

Modern debugging and performance inspection toolkit for React applications.

DevLens provides a lightweight in-app developer inspector inspired by Laravel Debugbar.

Monitor:

- API requests
- Fetch and Axios traffic
- console logs
- runtime errors
- component renders
- route navigation
- FPS and long tasks
- memory usage
- application performance

Built for modern React development workflows.

---

# Related Packages

- Next.js package: `@nrshagor/devlens-next`

---

# Installation

## npm

```bash
npm install @nrshagor/devlens-react
```

## pnpm

```bash
pnpm add @nrshagor/devlens-react
```

## yarn

```bash
yarn add @nrshagor/devlens-react
```

---

# Basic Setup

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
- Zero configuration setup
- Lightweight development-first runtime design
- HMR-safe lifecycle handling

---

# Render Tracking

Render tracking is opt-in to keep DevLens lightweight.

```tsx
import { useDevLensRender } from '@nrshagor/devlens-react';

function ProductCard() {
  useDevLensRender('ProductCard');

  return <div>Product Card</div>;
}
```

---

# Axios Monitoring

DevLens supports optional Axios monitoring without bundling Axios itself.

You manually provide your Axios instance.

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

Toggle DevLens anywhere during development:

```txt
Ctrl + Shift + D
```

---

# Requirements

- React 18+
- Client-side React application

---

# License

AGPL-3.0-only

Created by **Noore Rabbi Shagor**.
