# Contributing to DevLens

Thank you for your interest in contributing to DevLens.

DevLens is an open-source debugging and performance inspection toolkit for React and Next.js applications, created and maintained by **Noore Rabbi Shagor**.

The goal of this project is to provide a lightweight, developer-friendly debugging experience without unnecessary runtime overhead.

---

# Project Philosophy

DevLens should remain:

- lightweight
- modular
- developer friendly
- easy to install
- safe for real-world applications
- performant in large applications

Contributions should align with these principles.

---

# Before Contributing

Please:

- read the README documentation
- review existing issues and discussions
- avoid duplicate feature requests
- keep pull requests focused and minimal
- discuss major architectural changes before implementation

Small focused pull requests are preferred over large unrelated changes.

---

# Development Setup

Clone the repository:

```bash
git clone https://github.com/nrshagor/devlens.git
```

Enter the project:

```bash
cd devlens
```

Install dependencies:

```bash
pnpm install
```

Run builds:

```bash
pnpm build
```

Run type checking:

```bash
pnpm typecheck
```

---

# Monorepo Structure

```txt
packages/
  core/
  ui/
  react/
  next/
  shared/

examples/
  react-vite/
  next-app-router/
  next-pages-router/

docs/
```

---

# Package Responsibilities

## `packages/core`

Contains:

- runtime monitors
- stores
- interceptors
- event systems
- performance tracking

This package should remain framework-agnostic.

---

## `packages/ui`

Contains:

- DevLens UI
- panels
- drawer system
- styling
- reusable UI components

---

## `packages/react`

Contains:

- React integration
- React runtime setup
- hooks
- React error boundary support

---

## `packages/next`

Contains:

- Next.js integration
- hydration-safe rendering
- App Router support
- Pages Router support

---

## `packages/shared`

Contains:

- shared utilities
- browser helpers
- IDs
- shared runtime helpers

---

# Contribution Guidelines

## Keep DevLens Lightweight

Avoid:

- expensive observers
- unnecessary rerenders
- deep cloning large objects
- unbounded storage
- large retained references
- heavy runtime patching

Prefer:

- capped arrays
- memoization
- lightweight snapshots
- modular utilities
- lazy evaluation
- development-only instrumentation

---

# Code Style

Please follow the existing project style:

- TypeScript-first
- explicit typing where useful
- small focused utilities
- readable naming
- minimal abstraction
- maintainable architecture

Avoid introducing unnecessary dependencies.

---

# Pull Requests

Please ensure:

- builds pass
- type checking passes
- examples still work
- no unnecessary files are included
- changes remain focused and maintainable

Before submitting:

```bash
pnpm build
pnpm typecheck
```

If your change affects UI or behavior, screenshots or recordings are appreciated.

---

# Bug Reports

When reporting bugs, include:

- React or Next.js version
- reproduction steps
- screenshots if relevant
- expected behavior
- actual behavior
- browser information when applicable

Minimal reproductions are highly appreciated.

---

# Feature Requests

Feature requests should align with the DevLens philosophy:

- lightweight runtime
- strong developer experience
- React and Next.js focus
- minimal setup
- performance-aware architecture

Not all feature requests will be accepted if they significantly increase runtime overhead or complexity.

---

# Security Issues

Please do not publicly disclose security vulnerabilities.

Report security-related concerns privately through GitHub Security Advisories or direct contact.

---

# Community Standards

Please follow the Code of Conduct.

Be respectful and constructive in discussions, pull requests, and reviews.

---

# Sponsorship & Support

If your company uses DevLens in production or development workflows, sponsorship helps support:

- maintenance
- documentation
- new features
- ecosystem integrations
- long-term stability

Future sponsor information may appear in the README and project website.

---

# Maintainer

Created and maintained by:

**Noore Rabbi Shagor**
