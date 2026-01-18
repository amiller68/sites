# Project Layout

This document describes the structure of the krondor/sites monorepo.

## Monorepo Structure

The project is a **monorepo using Turborepo + pnpm** for orchestration.

```
sites/
├── ts/                     # TypeScript workspace
│   ├── apps/               # Deployable applications
│   │   ├── dev/            # Developer blog (dev.krondor.org)
│   │   └── art/            # Art portfolio site (art.krondor.org)
│   │
│   ├── packages/           # Shared libraries
│   │   └── ui/             # UI component library
│   │
│   ├── package.json        # pnpm workspace root
│   ├── pnpm-workspace.yaml # Workspace configuration
│   └── turbo.json          # Turborepo pipeline configuration
│
├── jax/                    # JAX Python project (separate)
│
├── docs/                   # Documentation
│   ├── agents/             # Agent-facing documentation (this folder)
│   ├── deployment/         # Deployment guides
│   ├── development/        # Development setup
│   └── setup/              # Infrastructure setup
│
├── bin/                    # Scripts and tools
├── .github/                # GitHub Actions workflows
├── .claude/                # Claude Code configuration
└── Makefile                # Top-level orchestration
```

## Primary Applications

### dev (Developer Blog)

**Location:** `ts/apps/dev/`

The developer blog at dev.krondor.org. Uses:
- Next.js 15 with App Router
- Quotient CMS for blog content
- Tailwind CSS for styling
- @repo/ui for shared components

### art (Art Portfolio)

**Location:** `ts/apps/art/`

The art portfolio site at art.krondor.org. Uses:
- Next.js 15 with App Router
- Quotient CMS for content management
- Tailwind CSS for styling

## Shared Packages

### ui (Component Library)

**Location:** `ts/packages/ui/`

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

**Key principles:**
- Components use Radix UI primitives for accessibility
- Styled with Tailwind CSS and class-variance-authority
- Export both named components and utilities

## Build Tools

| Tool | Purpose | Config |
|------|---------|--------|
| **pnpm** | Package management | `pnpm-workspace.yaml` |
| **Turborepo** | Build orchestration | `turbo.json` |
| **Make** | Top-level commands | `Makefile` |

## External Services

### Quotient CMS

The project uses [Quotient](https://quotient.co) as a headless CMS for:
- Blog posts and articles
- Contact form submissions
- Email marketing subscriptions

**Server-side fetching:**
```typescript
import { QuotientServer } from '@quotientjs/server'

const client = QuotientServer.client({
  projectId: process.env.NEXT_PUBLIC_QUOTIENT_PROJECT_ID!,
  apiKey: process.env.QUOTIENT_API_KEY!,
})

const blogs = await client.blogs.list()
```

**Client-side hooks:**
```typescript
import { useQuotient } from '@quotientjs/react'

const { client } = useQuotient()
await client.people.upsert({ emailAddress, emailMarketingState: 'SUBSCRIBED' })
```

## Package Development Standards

See [TYPESCRIPT_PATTERNS.md](./TYPESCRIPT_PATTERNS.md) for detailed patterns.

**All packages must implement these standard scripts:**
- `build` - Build the package
- `fmt` / `fmt:check` - Format code / check formatting
- `lint` - Lint code
- `check-types` - Type checking
- `clean` - Clean build artifacts

## Resources

The project relies on external services:

| Service | Purpose |
|---------|---------|
| Quotient CMS | Blog content, forms, email |
| Vercel (or Kamal) | Deployment |

**No local database or storage services are required** - all data comes from Quotient CMS.

## Make Commands

From the project root:

```bash
make install     # Install all dependencies
make check       # Run all checks (format, lint, types)
make build       # Build all packages
make test        # Run all tests
make fmt         # Auto-fix formatting
make clean       # Clean build artifacts
```

Project-specific commands:

```bash
make check-ts    # Check only TypeScript project
make build-ts    # Build only TypeScript project
```
