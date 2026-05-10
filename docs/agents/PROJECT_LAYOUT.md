# Project Layout

This document describes the structure of the krondor/sites monorepo.

## Monorepo Structure

The project is a **monorepo using Turborepo + pnpm** for orchestration.

```
sites/
├── apps/                   # Deployable applications
│   ├── dev/                # Developer blog (krondor.org)
│   ├── alexplain/          # Music site (alexplain.me)
│   └── art/                # Art portfolio site
│
├── packages/               # Shared libraries
│   ├── ui/                 # UI component library
│   ├── jax/                # JAX client library
│   └── typescript-config/  # Shared tsconfig
│
├── confit.toml             # Config & secrets (via confit + 1Password)
├── package.json            # pnpm workspace root
├── pnpm-workspace.yaml     # Workspace configuration
├── turbo.json              # Turborepo pipeline configuration
├── docs/                   # Documentation
│   └── agents/             # Agent-facing documentation (this folder)
├── .github/                # GitHub Actions workflows
├── .claude/                # Claude Code configuration
└── Makefile                # Top-level orchestration
```

## Primary Applications

### dev (Developer Blog)

**Location:** `apps/dev/`

The developer blog at krondor.org. Uses:
- Next.js 15 with App Router
- Quotient CMS for blog content
- Tailwind CSS for styling
- @repo/ui for shared components

### alexplain (Music Site)

**Location:** `apps/alexplain/`

Personal music site at alexplain.me. Uses:
- Next.js with App Router
- JAX object storage for media files
- Chord chart rendering

## Shared Packages

### ui (Component Library)

**Location:** `packages/ui/`

Shared UI component library providing:
- Design system components (Button, Card, etc.)
- Theme provider for dark/light mode
- Tailwind CSS utilities (`cn` function)
- Radix UI primitives

**Usage:**
```typescript
import { Button, Card, cn } from '@repo/ui'
import { ThemeProvider, useTheme } from '@repo/ui'
```

### jax (JAX Client)

**Location:** `packages/jax/`

TypeScript client for JAX object storage.

## Build Tools

| Tool | Purpose | Config |
|------|---------|--------|
| **pnpm** | Package management | `pnpm-workspace.yaml` |
| **Turborepo** | Build orchestration | `turbo.json` |
| **Make** | Top-level commands | `Makefile` |
| **confit** | Secrets & config | `confit.toml` |

## Configuration

Secrets and environment variables are managed via [confit](https://github.com/krondor-corp/confit) with a 1Password provider. The `confit.toml` at the repo root defines all config sections.

**Running with secrets:**
```bash
confit run app --upper -- <command>
```

**Override stage:**
```bash
confit run app --upper --set stage=production -- <command>
```

## External Services

| Service | Purpose |
|---------|---------|
| Quotient CMS | Blog content, forms, email |
| JAX | Object storage for media |
| 1Password | Secrets management (via confit) |

## Make Commands

From the project root:

```bash
make install     # Install all dependencies
make check       # Run all checks (format, types)
make build       # Build all apps
make build-dev   # Build with dev secrets via confit
make dev         # Run dev servers with secrets
make test        # Run all tests
make fmt         # Auto-fix formatting
make clean       # Clean build artifacts
```
