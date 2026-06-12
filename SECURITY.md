# Security Policy

## Supported Versions

Security fixes and updates are provided for the latest maintained version of DevLens.

Users are encouraged to keep dependencies and DevLens packages updated to the latest stable release.

---

# Reporting a Vulnerability

Please do not publicly disclose security vulnerabilities.

If you discover a security issue, report it privately through:

```txt id="8q2hfs"
opensource@nrshagor.com
```

Please include:

- vulnerability description
- reproduction steps
- affected environment
- possible impact
- screenshots or logs if relevant

Providing clear reproduction details helps speed up investigation and resolution.

---

# Response Policy

Security reports will be reviewed as quickly as possible.

The goal is to:

- confirm the issue
- investigate the impact
- prepare a fix
- release a patch when necessary
- responsibly disclose the resolution if appropriate

Response times may vary depending on issue severity and maintainer availability.

---

# Scope

Current DevLens scope includes:

- React runtime integrations
- Next.js integrations
- browser monitoring systems
- developer debugging utilities
- network monitoring systems
- performance monitoring systems

---

# Runtime Safety Philosophy

DevLens is designed with lightweight runtime safety in mind.

Key goals include:

- avoiding unnecessary production overhead
- minimizing retained references
- preventing memory leaks
- limiting stored runtime data
- keeping monitoring modular and isolated
- avoiding deep runtime patching

DevLens intentionally prioritizes developer tooling safety and predictable runtime behavior.

---

# Responsible Disclosure

Please avoid:

- public zero-day disclosure
- publishing exploit details before fixes are available
- sharing private user data
- intentionally testing vulnerabilities against third-party systems

Responsible disclosure helps protect the developer community using DevLens.

---

# Third-Party Dependencies

DevLens relies on third-party open-source packages and browser APIs.

Security vulnerabilities originating from external dependencies may require updates from upstream maintainers before fixes can be released.

Users should regularly update dependencies in development environments.

---

# Security Best Practices

Recommended best practices when using DevLens:

- use the latest package versions
- avoid exposing debugging tools publicly in production
- review third-party integrations carefully
- keep React and Next.js dependencies updated
- use trusted package registries

---

# Maintainer

Created and maintained by:

**Noore Rabbi Shagor**
