# DevLens

**See what your app is really doing.**

DevLens is a modern Laravel Debugbar-inspired debugging and performance inspection toolkit for React and Next.js applications.

It gives frontend developers a lightweight in-app debug drawer for monitoring APIs, console logs, performance, routes, renders, and runtime errors.

Created by **Noore Rabbi Shagor** under **CodeNRS**.

## Features

- Floating developer debugbar
- Expandable inspector drawer
- Network request monitoring
- Console log/warn/error tracking
- FPS and long task monitoring
- Route navigation tracking
- Component render tracking
- React error boundary tracking
- React support
- Next.js App Router and Pages Router support
- Dark, light, and system themes
- Development-first and lightweight runtime design
- Zero configuration setup
- Development-only runtime safety

## Installation

### React

Using pnpm:

```bash
pnpm add @codenrs/devlens-react @codenrs/devlens-ui
```

Using npm:

```bash
npm install @codenrs/devlens-react @codenrs/devlens-ui
```

Using yarn:

```bash
yarn add @codenrs/devlens-react @codenrs/devlens-ui
```

### Next.js

Using pnpm:

```bash
pnpm add @codenrs/devlens-next @codenrs/devlens-ui
```

Using npm:

```bash
npm install @codenrs/devlens-next @codenrs/devlens-ui
```

Using yarn:

```bash
yarn add @codenrs/devlens-next @codenrs/devlens-ui
```

## React Usage

```tsx
import { DevLens } from '@codenrs/devlens-react';
import '@codenrs/devlens-ui/styles/devlens.css';

export function App() {
  return (
    <>
      <YourApp />
      <DevLens />
    </>
  );
}
```

## Next.js Usage

Create a client component:

```tsx
'use client';

import { NextDevLens } from '@codenrs/devlens-next';
import '@codenrs/devlens-ui/styles/devlens.css';

export function DevLensClient() {
  return <NextDevLens />;
}
```

Then use it in your layout.

## Render Tracking

Render tracking is opt-in to keep DevLens lightweight.

```tsx
import { useDevLensRender } from '@codenrs/devlens-react';

function ProductCard() {
  useDevLensRender('ProductCard');

  return <div>Product</div>;
}
```

## Error Boundary Tracking

```tsx
import { DevLensErrorBoundary } from '@codenrs/devlens-react';

export function App() {
  return (
    <DevLensErrorBoundary fallback={<p>Something went wrong.</p>}>
      <YourApp />
    </DevLensErrorBoundary>
  );
}
```

## Philosophy

DevLens should be:

- invisible by default
- powerful when expanded
- lightweight
- fast
- developer friendly

DevLens should never feel bloated, intrusive, or difficult to set up.

## License

AGPL-3.0-only
