# Changelog

All notable changes to DevLens will be documented in this file.

## 0.1.0

### Added

- Initial stable release of DevLens.
- React adapter package.
- Next.js adapter package.
- Core runtime package.
- Shared utilities package.
- UI component package.
- Floating developer debugbar.
- Expandable inspector drawer.
- Fetch API request monitoring.
- Optional Axios request monitoring without adding Axios as a dependency.
- Console log, warn, error, info, and debug capture.
- Runtime error monitoring.
- Unhandled promise rejection tracking.
- React error boundary tracking.
- Component render tracking with `useDevLensRender`.
- Route navigation tracking.
- FPS monitoring.
- Long task monitoring.
- Overview panel with API, console, render, route, FPS, and runtime error metrics.
- Network request details panel.
- Console inspection panel.
- Performance monitoring panel.
- Route tracking panel.
- Component render insights panel.
- Runtime errors panel.
- Settings panel with dark, light, and system theme support.
- React Vite example application.
- Next.js App Router example application.
- Next.js Pages Router example application.
- Screenshot assets for README and npm package pages.

### Improved

- HMR-safe runtime monitor lifecycle handling.
- Duplicate interceptor protection.
- Development-only runtime safety behavior.
- Mobile floating debugbar layout.
- Responsive drawer tabs.
- Empty state UI consistency.
- Network details readability.
- Workspace-safe publishing configuration.
- Package exports and style exports.
- npm scope migration to `@nrshagor/*`.

### Fixed

- Prevented duplicate monitor installation during remounts and hot reload.
- Fixed workspace dependency publishing flow.
- Fixed corrupted drawer button characters.
- Fixed Runtime Errors tab badge so API errors do not appear as runtime errors.
- Fixed Axios instance compatibility with callable Axios instances.
