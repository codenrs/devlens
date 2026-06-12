# Features

DevLens is designed to provide a modern lightweight debugging experience for React and Next.js applications.

The goal is to help developers inspect runtime behavior directly inside the browser without introducing heavy development tooling overhead.

---

# Floating Debugbar

DevLens includes a compact floating debugbar that stays visible during development.

The debugbar displays real-time runtime information such as:

- API request count
- slow requests
- runtime errors
- render activity
- FPS metrics

The bar can be expanded into the full DevLens inspector drawer.

---

# Keyboard Shortcut

DevLens can be toggled from anywhere during development.

```txt id="6wq2ne"
Ctrl + Shift + D
```

This allows developers to quickly open or hide the inspector without refreshing the page.

---

# Expandable Inspector Drawer

The main DevLens interface opens through an expandable drawer UI.

Current panels include:

- Overview
- Network
- Console
- Performance
- Routes
- Render
- Runtime Errors
- Settings

The drawer is designed to remain lightweight while still exposing useful runtime information.

---

# Overview Dashboard

The Overview panel provides a high-level snapshot of application activity.

Current metrics include:

- API requests
- slow requests
- API errors
- console activity
- FPS
- route activity
- render activity
- runtime errors

It also displays:

- latest network request
- latest console entry

---

# Network Monitoring

DevLens automatically captures network activity.

Supported monitoring includes:

- Fetch API monitoring
- Optional Axios monitoring
- Duplicate API request detection

Tracked request information includes:

- request method
- request URL
- response status
- request duration
- failed requests
- slow requests
- duplicate requests

Network features include:

- request details view
- request search
- request filtering
- copy URL support

---

# Duplicate Request Detection

DevLens can automatically detect repeated API requests.

Duplicate requests are highlighted using badges such as:

```txt id="8cn4vm"
Duplicate x2
```

This helps identify:

- accidental repeated requests
- unnecessary rerenders
- duplicated data fetching
- inefficient query behavior

Duplicate detection is intentionally lightweight and optimized for development usage.

---

# Console Monitoring

DevLens captures browser console activity.

Supported console methods:

- `console.log`
- `console.info`
- `console.warn`
- `console.error`
- `console.debug`

Captured information includes:

- console level
- message content
- timestamps

---

# Runtime Error Monitoring

DevLens captures runtime errors and unhandled promise rejections.

Tracked information includes:

- error message
- stack trace
- timestamps

Runtime errors appear inside the Runtime Errors panel.

API failures are intentionally separated from runtime exceptions to reduce debugging confusion.

---

# React Error Boundary Tracking

DevLens includes lightweight React error boundary support.

Captured React errors include:

- error name
- error message
- component stack
- timestamps

Example:

```tsx id="3ne9vk"
import { DevLensErrorBoundary } from '@nrshagor/devlens-react';
```

---

# Render Tracking

Render tracking is intentionally opt-in to keep DevLens lightweight.

Example:

```tsx id="0wr6lf"
useDevLensRender('ProductCard');
```

Tracked render information includes:

- component name
- render count
- latest render duration
- render timestamps

Render metrics appear inside:

- Render panel
- Overview dashboard
- Floating debugbar

---

# Route Tracking

DevLens tracks browser route navigation activity.

Supported navigation events:

- `pushState`
- `replaceState`
- `popstate`
- `hashchange`

The Routes panel displays:

- current route
- previous route
- route history
- navigation timing

Supports both React and Next.js applications.

---

# Performance Monitoring

The Performance panel includes:

- FPS tracking
- average FPS
- minimum FPS
- maximum FPS
- long task detection
- memory usage monitoring

Performance status is automatically categorized as:

- good
- warning
- poor

---

# FPS Timeline

DevLens visualizes FPS activity using a lightweight timeline graph.

The graph helps identify:

- frame drops
- rendering instability
- UI performance spikes

without introducing expensive charting systems.

---

# Long Task Detection

DevLens monitors browser long tasks using the Performance Observer API.

Long tasks help identify:

- blocked main thread activity
- heavy rendering work
- expensive synchronous operations

Long tasks are displayed with timing information and duration badges.

---

# Memory Usage Monitoring

DevLens includes lightweight browser memory usage tracking when supported.

Displayed metrics may include:

- used JS heap size
- total JS heap size
- heap usage percentage

Memory monitoring remains browser-dependent and gracefully degrades when unsupported.

---

# Theme System

Supported themes:

- dark
- light
- system

Theme preferences are persisted locally.

---

# React Support

DevLens supports modern React applications through:

```tsx id="4uz2rk"
@nrshagor/devlens-react
```

---

# Next.js Support

DevLens supports:

- Next.js App Router
- Next.js Pages Router

Hydration-safe rendering guards are included by default.

---

# Lightweight Runtime Philosophy

DevLens is intentionally designed to avoid:

- expensive React runtime patching
- deep Fiber traversal
- unbounded storage
- excessive serialization
- large retained snapshots
- heavy observers
- production-heavy instrumentation

The goal is to remain lightweight and developer-friendly even in large applications.

Most advanced monitoring systems remain optimized or opt-in.

---

# Current Project Status

Current status:

- Stable React support
- Stable Next.js support
- Runtime architecture operational
- Lightweight monitoring system operational
- npm packages published

---

# Future Expansion

Possible future features may include:

- XMLHttpRequest monitoring
- storage inspection
- exportable debug snapshots
- WebSocket monitoring
- ecosystem integrations
- plugin APIs
- custom monitoring hooks

The current priority remains:

- lightweight runtime
- stability
- developer experience
- React and Next.js support

---

# Created By

Created by **Noore Rabbi Shagor**.
