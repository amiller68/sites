# Claude Code Instructions

This is the **krondor/sites** project - a Next.js monorepo for Krondor's web properties.

## Before Starting Any Task

1. **Read `docs/agents/`** - This contains critical project documentation:
   - [README.md](../docs/agents/README.md) - Quick start and document index
   - [PROJECT_LAYOUT.md](../docs/agents/PROJECT_LAYOUT.md) - Monorepo structure
   - [TYPESCRIPT_PATTERNS.md](../docs/agents/TYPESCRIPT_PATTERNS.md) - Code patterns
   - [SUCCESS_CRITERIA.md](../docs/agents/SUCCESS_CRITERIA.md) - CI requirements
   - [PR_WORKFLOW.md](../docs/agents/PR_WORKFLOW.md) - Git and PR conventions

2. **Run `make install`** - Ensure all dependencies are available

3. **Enter planning mode** for non-trivial tasks - Analyze requirements before coding

## Key Constraints

- **`make check` must pass** before creating any PR
- **No dev servers** - Shared machine with other agents; trust tests and builds
- **Follow existing patterns** - Match the style and structure of existing code
- **All Linear work restricted to "sites" project** - Only work on issues in the "sites" project

## Commands

Use `/draft` to push and create a draft PR.
Use `/check` to run success criteria checks.
Use `/linear <issue-id>` to load a Linear issue and start planning.

## Linear Integration

This project uses `mcp__linear-kro__*` functions for Linear integration.

**IMPORTANT**: Only work on issues that belong to the **"sites"** project in Linear. Before starting work on any Linear issue, verify it belongs to the correct project.
