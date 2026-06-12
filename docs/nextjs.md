# Next.js Usage

DevLens provides lightweight debugging and performance inspection for Next.js applications.

```tsx id="9ax2qp"
import { NextDevLens } from '@nrshagor/devlens-next';
```

DevLens supports:

- Next.js App Router
- Next.js Pages Router
- client-side route tracking
- hydration-safe rendering
- lightweight development monitoring

---

# Install

Using npm:

```bash id="0mn4ql"
npm install @nrshagor/devlens-next
```

Using pnpm:

```bash id="1jt9vx"
pnpm add @nrshagor/devlens-next
```

Using yarn:

```bash id="5zr2dp"
yarn add @nrshagor/devlens-next
```

---

# App Router Setup

## 1. Create a Client Component

Create:

```txt id="1bv7mm"
components/devlens-client.tsx
```

```tsx id="7kp1re"
'use client';

import { NextDevLens } from '@nrshagor/devlens-next';
import '@nrshagor/devlens-next/styles.css';

export function DevLensClient() {
  return <NextDevLens />;
}
```

---

## 2. Add DevLens to Your Root Layout

```tsx id="x8v4zt"
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

Add DevLens inside:

```txt id="9o4lma"
pages/_app.tsx
```

```tsx id="7u0nke"
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

# Keyboard Shortcut

Toggle DevLens anywhere during development:

```txt id="3sy8kp"
Ctrl + Shift + D
```

---

# Route Tracking

DevLens automatically tracks browser route navigation events.

Tracked navigation types include:

- `pushState`
- `replaceState`
- `popstate`
- `hashchange`

The Routes panel displays:

- current route
- previous route
- navigation history
- navigation timing

---

# Render Tracking

Render tracking remains intentionally opt-in to keep DevLens lightweight.

```tsx id="3vq0gh"
import { useDevLensRender } from '@nrshagor/devlens-react';

export function ProductCard() {
  useDevLensRender('ProductCard');

  return <div>Product</div>;
}
```

Tracked render data includes:

- component name
- render count
- latest render duration
- last render timestamp

Render tracking appears inside:

- Render panel
- Overview metrics
- Debugbar render counter

---

# Axios Monitoring

DevLens supports optional Axios monitoring without bundling Axios itself.

You manually provide your Axios instance.

```tsx id="2dc8zn"
'use client';

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

Axios requests appear inside the Network panel.

---

# Included Monitoring

The Next.js adapter currently includes:

## Network Monitoring

- Fetch API monitoring
- Optional Axios monitoring
- Duplicate API request detection
- Network search and filtering

---

## Runtime Monitoring

- Console monitoring
- Runtime error monitoring
- Unhandled promise rejection tracking
- Route tracking

---

## Performance Monitoring

- FPS tracking
- Long task monitoring
- Memory usage monitoring

---

## Developer Experience

- Floating debugbar
- Expandable inspector drawer
- Keyboard shortcut toggle
- Dark/light/system themes
- Hydration-safe rendering

---

# Hydration Safety

DevLens uses mounted rendering guards to help avoid hydration mismatch issues.

The debug UI is rendered only after the client has mounted.

---

# Performance Philosophy

DevLens intentionally avoids:

- deep Next.js runtime patching
- expensive observers
- unnecessary serialization
- large retained snapshots
- production-heavy instrumentation

The goal is to remain lightweight inside modern Next.js applications.

Most advanced monitoring systems remain optimized or opt-in.

---

# Recommended Usage

Recommended environments:

- local development
- debugging sessions
- staging environments

Production usage should remain optional and carefully evaluated.

---

# Related Packages

- `@nrshagor/devlens-next`
- `@nrshagor/devlens-react`

---

# Created By

Created by **Noore Rabbi Shagor**.
