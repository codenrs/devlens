# Getting Started

DevLens is a lightweight debugging and inspection toolkit for React and Next.js applications.

It adds a floating developer debugbar and expandable inspector drawer directly inside your application during development.

## Installation

### React

Using pnpm:

```bash
pnpm add @nrshagor/devlens-react
```

Using npm:

```bash
npm install @nrshagor/devlens-react
```

Using yarn:

```bash
yarn add @nrshagor/devlens-react
```

### Next.js

Using pnpm:

```bash
pnpm add @nrshagor/devlens-next
```

Using npm:

```bash
npm install @nrshagor/devlens-next
```

Using yarn:

```bash
yarn add @nrshagor/devlens-next
```

## Basic React Setup

```tsx
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

## Development Philosophy

DevLens is designed primarily for development workflows.

Core principles:

- lightweight runtime impact
- minimal setup
- development-first tooling
- safe for real-world applications
- compact UI with expandable inspection tools

## Included Features

Current DevLens features include:

- API monitoring
- console monitoring
- performance tracking
- route tracking
- render tracking
- React error tracking
- React support
- Next.js support
- theme system
- responsive drawer UI

## Runtime Safety

DevLens is intended to be enabled during development environments.

The toolkit is designed to avoid:

- heavy runtime overhead
- deep object retention
- expensive observers
- unnecessary rerenders
- production performance impact

## Created By

Created by **Noore Rabbi Shagor** under **CodeNRS**.
