# Features

DevLens is designed to provide a modern lightweight debugging experience for React and Next.js applications.

## Floating Debugbar

DevLens includes a compact floating debugbar that stays visible during development.

The debugbar displays quick runtime information such as:

- API request count
- slow requests
- errors
- FPS
- render activity

## Expandable Inspector Drawer

The main DevLens interface opens through an expandable drawer UI.

Current panels include:

- Overview
- Network
- Console
- Performance
- Routes
- Render
- Errors
- Settings

## Network Monitoring

DevLens automatically captures fetch requests.

Tracked information includes:

- request method
- request URL
- request duration
- response status
- failed requests
- slow requests

## Console Monitoring

DevLens captures browser console activity.

Supported console methods:

- console.log
- console.info
- console.warn
- console.error
- console.debug

## Performance Monitoring

The Performance panel includes:

- FPS tracking
- average FPS
- minimum FPS
- maximum FPS
- long task detection

Performance status is automatically categorized:

- good
- warning
- poor

## Route Tracking

DevLens tracks browser route navigation activity.

Supported navigation events:

- pushState
- replaceState
- popstate
- hashchange

The Routes panel displays:

- current route
- previous route
- route history
- navigation timing

## Render Tracking

Render tracking is intentionally opt-in.

Example:

```tsx id="zpw8ok"
useDevLensRender('ProductCard');
```

Tracked render information:

- component name
- render count
- latest render duration
- render timestamps

This approach helps keep DevLens lightweight for large applications.

## Error Tracking

DevLens includes React error boundary tracking.

Captured information includes:

- error name
- error message
- stack trace
- component stack
- timestamp

Errors are displayed inside the Errors panel.

## Theme System

Supported themes:

- dark
- light
- system

Theme preferences are persisted locally.

## React Support

DevLens supports modern React applications through:

```tsx id="ftq0rf"
@codenrs/devlens-react
```

## Next.js Support

DevLens supports:

- Next.js App Router
- Next.js Pages Router

Hydration-safe rendering guards are included by default.

## Lightweight Runtime Philosophy

DevLens is intentionally designed to avoid:

- expensive React runtime patching
- deep Fiber traversal
- unbounded storage
- excessive serialization
- large retained snapshots
- heavy observers

The goal is to remain lightweight and developer-friendly even in large projects.

## Current Project Status

Current status:

- Internal Alpha Ready
- React support stable
- Next.js support stable
- Runtime architecture stable
- Lightweight UI system operational

## Future Expansion

Possible future features may include:

- Axios monitoring
- XMLHttpRequest monitoring
- storage inspection
- exportable debug snapshots
- WebSocket monitoring
- ecosystem integrations

The current priority remains:

- lightweight runtime
- stability
- developer experience
- React and Next.js support
