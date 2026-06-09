# @codenrs/devlens-react

React adapter for DevLens.

DevLens is a modern Laravel Debugbar-inspired debugging and performance inspection toolkit for React applications.

## Installation

Using npm:

```bash
npm install @codenrs/devlens-react
```

Using pnpm:

```bash
pnpm add @codenrs/devlens-react
```

Using yarn:

```bash
yarn add @codenrs/devlens-react
```

## Usage

```tsx
import { DevLens } from '@codenrs/devlens-react';
import '@codenrs/devlens-react/styles.css';

export function App() {
  return (
    <>
      <YourApp />
      <DevLens />
    </>
  );
}
```

## Render Tracking

```tsx
import { useDevLensRender } from '@codenrs/devlens-react';

function ProductCard() {
  useDevLensRender('ProductCard');

  return <div>Product Card</div>;
}
```

## Error Boundary

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

## Features

- Network monitoring
- Console tracking
- FPS monitoring
- Route tracking
- Render tracking
- Runtime error tracking
- Expandable debug drawer
- Dark and light themes
- Development-only runtime safety

## License

AGPL-3.0-only

Created by Noore Rabbi Shagor under CodeNRS.
