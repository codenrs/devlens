# Contributing to DevLens

Thank you for your interest in contributing to DevLens.

DevLens is an open-source debugging and performance inspection toolkit for React and Next.js applications, created and maintained by **Noore Rabbi Shagor** .

The goal of this project is to provide a lightweight, developer-friendly debugging experience without unnecessary runtime overhead.

## Project Philosophy

DevLens should remain:

- lightweight
- modular
- developer friendly
- easy to install
- safe for real-world applications

Contributions should align with these principles.

## Before Contributing

Please:

- read the README
- review existing issues and discussions
- avoid duplicate feature requests
- keep pull requests focused and minimal

## Development Setup

Clone the repository:

```bash
git clone https://github.com/nrshagor/devlens.git
```

Install dependencies:

```bash
pnpm install
```

Run development builds:

```bash
pnpm build
```

Type checking:

```bash
pnpm typecheck
```

## Monorepo Structure

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
```

## Contribution Guidelines

### Keep DevLens Lightweight

Avoid:

- expensive observers
- unnecessary rerenders
- deep cloning large objects
- unbounded storage
- large retained references

Prefer:

- capped arrays
- memoization
- lightweight snapshots
- modular utilities

## Pull Requests

Please ensure:

- builds pass
- type checking passes
- no unnecessary files are included
- changes remain focused and maintainable

Before submitting:

```bash
pnpm build
pnpm typecheck
```

## Bug Reports

When reporting bugs, include:

- React or Next.js version
- reproduction steps
- screenshots if relevant
- expected behavior
- actual behavior

## Feature Requests

Feature requests should align with the DevLens philosophy:

- lightweight runtime
- strong developer experience
- React and Next.js focus
- minimal setup

## Community Standards

Please follow the Code of Conduct.

## Security Issues

Do not publicly disclose security vulnerabilities.

Please report security-related concerns privately.

## Maintainer

Created and maintained by:

**Noore Rabbi Shagor**
