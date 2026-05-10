# Claude Code Instructions

This is the **krondor/sites** project - a Next.js monorepo for Krondor's web properties.

## Structure

- `apps/dev` - Developer blog at krondor.org (Next.js, Quotient CMS)
- `apps/alexplain` - Music site at alexplain.me (Next.js, JAX storage)
- `packages/ui` - Shared UI component library
- `packages/jax` - JAX client library
- `confit.toml` - Secrets & config via confit + 1Password

## Commands

```bash
pnpm install          # Install deps
pnpm build            # Build all apps
pnpm dev              # Dev servers (needs confit for secrets)
pnpm fmt:check        # Check formatting
pnpm types            # Type check
```

## Key Constraints

- **`pnpm fmt:check && pnpm types`** must pass before any PR
- **No dev servers** - Shared machine with other agents; trust builds
- **Follow existing patterns** - Match the style and structure of existing code

## Slash Commands

Use `/draft` to push and create a draft PR.
Use `/check` to run success criteria checks.
