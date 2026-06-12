# React Usage

DevLens provides a lightweight React integration through:

```tsx id="6v2hpo"
import { DevLens } from '@nrshagor/devlens-react';
```

It adds a floating developer debugbar and expandable inspector drawer directly inside your React application during development.

---

# Basic Setup

```tsx id="4v1jcz"
import { DevLens } from '@nrshagor/devlens-react';
import '@nrshagor/devlens-react/styles.css';

function App() {
  return (
    <>
      <main>Your React application</main>

      <DevLens />
    </>
  );
}

export default App;
```

---

# Development Mode

DevLens is intended primarily for development workflows.

Typical usage:

```tsx id="mp02zz"
<DevLens />
```

Optional manual control:

```tsx id="vz40na"
<DevLens enabled={true} />
```

By default, DevLens automatically enables itself only during development mode.

---

# Position

You can control the floating debugbar position.

```tsx id="7v91of"
<DevLens position="bottom-left" />
```

Supported positions:

- `bottom-left`
- `bottom-right`

---

# Theme

Set the default DevLens theme:

```tsx id="j8x5fz"
<DevLens defaultTheme="dark" />
```

Supported themes:

- `dark`
- `light`
- `system`

Users can also switch themes directly from the DevLens Settings panel.

---

# Keyboard Shortcut

Toggle DevLens anywhere during development:

```txt id="8m1rkr"
Ctrl + Shift + D
```

---

# Render Tracking

Render tracking is intentionally opt-in to keep DevLens lightweight.

```tsx id="tx76ix"
import { useDevLensRender } from '@nrshagor/devlens-react';

function ProductCard() {
  useDevLensRender('ProductCard');

  return <div>Product Card</div>;
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

```tsx id="gk4vta"
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

Captured Axios requests appear inside the Network panel.

---

# Error Boundary Tracking

DevLens includes a lightweight React error boundary.

```tsx id="0cz2gy"
import { DevLensErrorBoundary } from '@nrshagor/devlens-react';

function App() {
  return (
    <DevLensErrorBoundary fallback={<p>Something went wrong.</p>}>
      <YourApplication />
    </DevLensErrorBoundary>
  );
}
```

Captured React errors appear inside the Runtime Errors panel.

---

# Included Monitoring

The React adapter currently includes:

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

## React Developer Tools

- Component render tracking
- Render metrics
- Render history panel
- React error boundary tracking

---

# Performance Philosophy

DevLens is intentionally designed to avoid:

- expensive React runtime patching
- Fiber tree traversal
- deep object cloning
- unbounded memory growth
- excessive rerenders
- production-heavy instrumentation

The goal is to remain lightweight even in large React applications.

Most advanced monitoring systems are optimized or opt-in.

---

# Recommended Usage

Recommended environments:

- local development
- debugging sessions
- staging environments

Not recommended for permanent production usage.

---

# Related Packages

- `@nrshagor/devlens-react`
- `@nrshagor/devlens-next`

---

# Created By

Created by **Noore Rabbi Shagor**.
