# Agent Documentation

This directory contains documentation designed for AI agents (and human developers) working on the krondor/sites project.

## Quick Start

1. Read [TASK_TEMPLATE.md](./TASK_TEMPLATE.md) to understand how to start a task
2. Run `make install` to ensure dependencies are available
3. Follow the patterns in [TYPESCRIPT_PATTERNS.md](./TYPESCRIPT_PATTERNS.md)
4. Ensure [SUCCESS_CRITERIA.md](./SUCCESS_CRITERIA.md) are met before creating a PR

---

## Document Index

| Document | Purpose | When to Read |
|----------|---------|--------------|
| [CONTRIBUTING.md](./CONTRIBUTING.md) | How to contribute (agents & humans) | First time contributing |
| [TASK_TEMPLATE.md](./TASK_TEMPLATE.md) | Task template for starting work | Beginning of every task |
| [PROJECT_LAYOUT.md](./PROJECT_LAYOUT.md) | Monorepo structure and packages | Understanding the codebase |
| [TYPESCRIPT_PATTERNS.md](./TYPESCRIPT_PATTERNS.md) | TypeScript architecture patterns | Writing TypeScript code |
| [SUCCESS_CRITERIA.md](./SUCCESS_CRITERIA.md) | CI requirements and checks | Before creating a PR |
| [PR_WORKFLOW.md](./PR_WORKFLOW.md) | Git, branching, and PR conventions | Creating PRs |

---

## Document Summaries

### [CONTRIBUTING.md](./CONTRIBUTING.md)
How to contribute to the project:
- **For AI agents**: Constraints, code quality expectations, submission checklist
- **For humans**: Dev setup, code review guidelines, architecture decisions
- Commit conventions and PR process

### [TASK_TEMPLATE.md](./TASK_TEMPLATE.md)
Template for starting a new task. Copy this into your Claude Code conversation and fill in the mission section. Includes references to other docs and constraints.

### [PROJECT_LAYOUT.md](./PROJECT_LAYOUT.md)
Describes the monorepo structure:
- **Apps**: `ts/apps/dev` (dev blog), `ts/apps/art` (art site)
- **Shared packages**: `ts/packages/ui` (component library)
- **Build tools**: pnpm, Turborepo, Make
- **External services**: Quotient CMS

### [TYPESCRIPT_PATTERNS.md](./TYPESCRIPT_PATTERNS.md)
Architecture patterns for TypeScript code:
- **Next.js 15 App Router**: Server/client components, layouts
- **Quotient CMS**: Server-side fetching, client-side hooks
- **Tailwind CSS**: Utility classes, design system
- **Radix UI**: Accessible component primitives

### [SUCCESS_CRITERIA.md](./SUCCESS_CRITERIA.md)
What "done" means:
- `make check` must pass (build, format, types, lint)
- Tests must pass
- No dev servers (shared machine)
- Common fixes for CI failures

### [PR_WORKFLOW.md](./PR_WORKFLOW.md)
Git and PR conventions:
- Branch naming conventions
- Commit message format
- PR creation with gh CLI
- CI/CD pipeline details

---

## Key Constraints

1. **Run `make install` first** - Always at the start of work
2. **No dev servers** - Shared machine with other agents
3. **`make check` must pass** - Before creating any PR
4. **Follow existing patterns** - Match codebase style

---

## External Resources

- [Local Development](../development/LOCAL.md) - Full development environment
- [Kamal Deployment](../deployment/KAMAL.md) - Deployment guide
- [Infrastructure Setup](../setup/WALKTHROUGH.md) - Infrastructure context
