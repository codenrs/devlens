# @codenrs/devlens-react

Modern debugging and performance inspection toolkit for React applications.

DevLens provides a lightweight in-app developer inspector inspired by Laravel Debugbar.

Monitor:

- API requests
- console logs
- runtime errors
- component renders
- route changes
- FPS and long tasks
- application performance

---

# Installation

Using npm:

```bash id="v3c8mx"
npm install @codenrs/devlens-react
```

Using pnpm:

```bash id="p4t7qa"
pnpm add @codenrs/devlens-react
```

Using yarn:

```bash id="y8m1rq"
yarn add @codenrs/devlens-react
```

---

# Setup

Add DevLens inside your main application component.

```tsx id="d6k2ns"
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

---

# Render Tracking

Render tracking is opt-in to keep DevLens lightweight.

```tsx id="z9f4pm"
import { useDevLensRender } from '@codenrs/devlens-react';

function ProductCard() {
  useDevLensRender('ProductCard');

  return <div>Product Card</div>;
}
```

---

# Error Boundary Tracking

```tsx id="q7w1vt"
import { DevLensErrorBoundary } from '@codenrs/devlens-react';

export function App() {
  return (
    <DevLensErrorBoundary fallback={<p>Something went wrong.</p>}>
      <YourApp />
    </DevLensErrorBoundary>
  );
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
- Development-only runtime safety

---

# License

AGPL-3.0-only

Created by **Noore Rabbi Shagor** under **CodeNRS**.
