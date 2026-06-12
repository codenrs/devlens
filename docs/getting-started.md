# Getting Started

DevLens is a lightweight debugging and inspection toolkit for React and Next.js applications.

It adds a floating developer debugbar and expandable inspector drawer directly inside your application during development.

DevLens helps developers inspect:

- API requests
- Fetch and Axios traffic
- console logs
- runtime errors
- component renders
- route navigation
- FPS and long tasks
- memory usage
- frontend performance

---

# Installation

## React

### pnpm

```bash id="4lh5mv"
pnpm add @nrshagor/devlens-react
```

### npm

```bash id="sh1lql"
npm install @nrshagor/devlens-react
```

### yarn

```bash id="d4i0nh"
yarn add @nrshagor/devlens-react
```

---

## Next.js

### pnpm

```bash id="g7zzsv"
pnpm add @nrshagor/devlens-next
```

### npm

```bash id="st1a1o"
npm install @nrshagor/devlens-next
```

### yarn

```bash id="g2wgj7"
yarn add @nrshagor/devlens-next
```

---

# Basic React Setup

```tsx id="g2w8zw"
import { DevLens } from '@nrshagor/devlens-react';
import '@nrshagor/devlens-react/styles.css';

export function App() {
  return (
    <>
      <YourApplication />
      <DevLens />
    </>
  );
}
```

---

# Basic Next.js Setup

## App Router

Create:

```txt id="4v89l7"
components/devlens-client.tsx
```

```tsx id="k0gwzd"
'use client';

import { NextDevLens } from '@nrshagor/devlens-next';
import '@nrshagor/devlens-next/styles.css';

export function DevLensClient() {
  return <NextDevLens />;
}
```

Add it to:

```txt id="w59k2w"
app/layout.tsx
```

```tsx id="yn0u4k"
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

# Included Features

## Monitoring

- Fetch API monitoring
- Optional Axios monitoring
- Console monitoring
- Runtime error monitoring
- Unhandled promise rejection tracking
- FPS monitoring
- Long task monitoring
- Memory usage monitoring
- Route tracking
- Duplicate API request detection

---

## React Developer Tools

- Component render tracking
- Render metrics
- Render history panel
- React error boundary tracking

---

## Developer Experience

- Floating debugbar
- Expandable inspection drawer
- Keyboard shortcut toggle (`Ctrl + Shift + D`)
- Searchable network panel
- Dark, light, and system themes
- Responsive drawer UI
- Zero configuration setup
- Lightweight runtime architecture

---

# Runtime Safety

DevLens is designed primarily for development workflows.

The toolkit is intentionally built to avoid:

- heavy runtime overhead
- deep object retention
- unnecessary rerenders
- expensive observers
- large memory allocations
- production performance impact

Most advanced monitoring systems are opt-in or internally optimized to remain lightweight.

---

# Development Philosophy

Core DevLens principles:

- lightweight runtime impact
- minimal setup
- development-first tooling
- safe real-world usage
- fast inspection workflows
- expandable but non-intrusive UI

DevLens should never feel bloated or difficult to integrate.

---

# Related Packages

- `@nrshagor/devlens-react`
- `@nrshagor/devlens-next`

---

# Created By

Created by **Noore Rabbi Shagor**.
