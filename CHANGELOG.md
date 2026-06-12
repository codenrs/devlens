# Changelog

All notable changes to DevLens will be documented in this file.

---

# 0.1.0

Initial stable public release of DevLens.

---

## Added

### Core Architecture

- React adapter package.
- Next.js adapter package.
- Core runtime package.
- Shared utilities package.
- UI component package.

---

### Developer UI

- Floating developer debugbar.
- Expandable inspector drawer.
- Responsive drawer tabs.
- Overview dashboard.
- Settings panel with theme controls.

---

### Network Monitoring

- Fetch API request monitoring.
- Optional Axios request monitoring without bundling Axios as a dependency.
- Duplicate API request detection.
- Network request details panel.
- Network request search and filtering.
- Slow request detection.
- Failed request tracking.
- Copy request URL support.

---

### Console Monitoring

- `console.log` capture.
- `console.info` capture.
- `console.warn` capture.
- `console.error` capture.
- `console.debug` capture.
- Console inspection panel.

---

### Runtime Error Monitoring

- Runtime error monitoring.
- Unhandled promise rejection tracking.
- Runtime errors panel.
- React error boundary tracking.

---

### Render Monitoring

- Component render tracking with `useDevLensRender`.
- Component render insights panel.
- Render count metrics inside the debugbar and overview dashboard.

---

### Route Monitoring

- Route navigation tracking.
- Route tracking panel.
- Support for:
  - `pushState`
  - `replaceState`
  - `popstate`
  - `hashchange`

---

### Performance Monitoring

- FPS monitoring.
- FPS timeline visualization.
- Long task monitoring.
- Memory usage monitoring.
- Performance monitoring panel.
- Performance status classification:
  - good
  - warning
  - poor

---

### Next.js Support

- Next.js App Router support.
- Next.js Pages Router support.
- Hydration-safe mounted rendering guards.

---

### Developer Experience

- Keyboard shortcut toggle:
  - `Ctrl + Shift + D`

- Dark theme support.
- Light theme support.
- System theme support.
- Theme persistence.
- Development-first runtime behavior.
- Safe development-only runtime design.

---

### Examples & Documentation

- React Vite example application.
- Next.js App Router example application.
- Next.js Pages Router example application.
- Screenshot assets for README and npm package pages.
- Updated root README documentation.
- React package README documentation.
- Next.js package README documentation.
- Expanded docs for:
  - getting started
  - features
  - React usage
  - Next.js usage

---

## Improved

- HMR-safe runtime monitor lifecycle handling.
- Duplicate interceptor protection.
- Development-only runtime safety behavior.
- Mobile floating debugbar layout.
- Empty state UI consistency.
- Network details readability.
- Workspace-safe publishing configuration.
- Package exports and style exports.
- npm scope migration to `@nrshagor/*`.
- Lightweight runtime architecture for large applications.
- Better developer onboarding documentation.
- Reduced setup confusion for React and Next.js users.

---

## Fixed

- Prevented duplicate monitor installation during remounts and hot reload.
- Fixed workspace dependency publishing flow.
- Fixed corrupted drawer button characters.
- Fixed Runtime Errors tab badge so API failures do not appear as runtime exceptions.
- Fixed Axios instance compatibility with callable Axios instances.
- Fixed render tracking export visibility for TypeScript auto-import suggestions.
