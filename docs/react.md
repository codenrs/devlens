# React Usage

DevLens provides a lightweight React integration through:

```tsx
import { DevLens } from '@codenrs/devlens-react';
```

## Basic Setup

```tsx
import { DevLens } from '@codenrs/devlens-react';
import '@codenrs/devlens-ui/styles/devlens.css';

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

## Development Mode

DevLens is intended for development environments.

Typical usage:

```tsx
<DevLens />
```

Optional manual control:

```tsx
<DevLens enabled={true} />
```

## Position

You can control the debugbar position:

```tsx
<DevLens position="bottom-left" />
```

Available positions:

- bottom-left
- bottom-right

## Theme

Default theme:

```tsx
<DevLens defaultTheme="dark" />
```

Supported themes:

- dark
- light
- system

## Render Tracking

Render tracking is intentionally opt-in to keep DevLens lightweight.

Example:

```tsx
import { useDevLensRender } from '@codenrs/devlens-react';

function ProductCard() {
  useDevLensRender('ProductCard');

  return <div>Product Card</div>;
}
```

Tracked data includes:

- component name
- render count
- latest render duration
- last render timestamp

## Error Boundary Tracking

DevLens includes a lightweight React error boundary.

```tsx
import { DevLensErrorBoundary } from '@codenrs/devlens-react';

function App() {
  return (
    <DevLensErrorBoundary fallback={<p>Something went wrong.</p>}>
      <YourApplication />
    </DevLensErrorBoundary>
  );
}
```

Captured React errors appear inside the DevLens Errors panel.

## Included Monitoring

The React adapter currently includes:

- fetch request monitoring
- console monitoring
- FPS tracking
- long task monitoring
- route tracking
- render tracking
- React error tracking

## Performance Philosophy

DevLens is designed to avoid:

- expensive React runtime patching
- Fiber tree traversal
- deep object cloning
- unbounded memory growth
- excessive rerenders

The goal is to remain lightweight even in large React applications.

## Recommended Usage

Recommended environments:

- local development
- debugging sessions
- staging environments

Not recommended for permanent production usage.
