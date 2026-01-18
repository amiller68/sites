# Contributing Guide

This guide covers how to contribute to the krondor/sites project, whether you're an AI agent or a human developer.

## For AI Agents

### Getting Started

1. **Run `make install`** - Always first, to ensure dependencies are available
2. **Read the relevant docs** - Start with [PROJECT_LAYOUT.md](./PROJECT_LAYOUT.md) and [TYPESCRIPT_PATTERNS.md](./TYPESCRIPT_PATTERNS.md)
3. **Understand the task** - Use planning mode to analyze requirements before coding
4. **Follow existing patterns** - Match the style and structure of existing code

### Key Constraints

- **No dev servers** - Shared machine; trust tests and builds instead
- **`make check` must pass** - Before creating any PR
- **Linear integration** - Only work on issues in the "sites" project

### Code Quality Expectations

- Follow [TYPESCRIPT_PATTERNS.md](./TYPESCRIPT_PATTERNS.md) for TypeScript code
- Use proper typing - avoid `any` where possible
- Keep components simple and composable
- Write tests for new functionality

### File Naming Conventions

**TypeScript/React:**
- Use `kebab-case` for all file names, including React components
- Example: `chat-header.tsx`, `message-list.tsx`, `use-theme.ts`
- Export components with `PascalCase` names: `export { ChatHeader } from './chat-header'`

### Naming Philosophy

**Prefer pedantic, descriptive names over short ones.** Clarity is more important than brevity.

- Function/file names should fully describe what they do
- Don't abbreviate unless the abbreviation is universally understood
- If a name feels too long, that's usually fine - it helps future readers understand the code

**Examples:**
```typescript
// Good - pedantic and descriptive
useContactSubmit
QuotientServerClient
fetchBlogPostBySlug

// Bad - too short or ambiguous
useSubmit
Client
getBlog
```

### Refactoring Principles

**No backward compatibility shims.** When refactoring:

- Update all imports in a single pass - don't create re-export shims
- Delete the old code completely after migrating
- If consolidating code to a shared package, update all consumers directly

### Before Submitting

1. Run `make check` - All checks must pass
2. Run `make test` - All tests must pass
3. Update docs if needed - See [SUCCESS_CRITERIA.md](./SUCCESS_CRITERIA.md#documentation-requirements)
4. Write descriptive commit messages
5. Create PR with clear summary

---

## For Human Developers

### Development Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:krondor-corp/sites.git
   cd sites
   ```

2. **Install dependencies**
   ```bash
   make install
   ```

3. **Set up environment**
   ```bash
   # Copy example env files
   cp ts/apps/dev/.env.example ts/apps/dev/.env.local
   # Fill in Quotient credentials
   ```

4. **Run the dev server**
   ```bash
   cd ts && pnpm dev
   ```

### Code Review Guidelines

When reviewing PRs (from agents or humans):

**Do check:**
- Does the code solve the stated problem?
- Are there appropriate tests?
- Does it follow existing patterns?
- Is the code readable and maintainable?
- Are there security concerns?

**Don't worry about:**
- Formatting - CI enforces this
- Linting - CI catches this
- Type safety - Type checker verifies this

### Architecture Decisions

Before making significant changes:

1. **Discuss first** - Open an issue or discuss in PR
2. **Document the decision** - Update relevant docs
3. **Follow established patterns** - Or document why you're deviating

Key architectural principles:
- Server components by default, client components when needed
- Quotient CMS for all content management
- Tailwind CSS for styling
- Radix UI for accessible component primitives

---

## Commit Conventions

Use conventional commit prefixes:

| Prefix | Use For |
|--------|---------|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `refactor:` | Code refactoring (no behavior change) |
| `chore:` | Maintenance tasks, dependency updates |
| `docs:` | Documentation changes |
| `test:` | Test additions or modifications |
| `perf:` | Performance improvements |

Example:
```
feat: add contact form submission

- Implement Quotient people.upsert integration
- Add form validation with React Hook Form
- Add success/error states

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## TODO Comments

Use structured TODO comments to track work that needs to be done:

| Format | Meaning |
|--------|---------|
| `TODO (name):` | Future work - do this eventually |
| `TODO (draft):` | Must be resolved before merging |
| `TODO (name, tag):` | Create an issue for this with the specified tag |

**Guidelines:**
- `TODO (draft):` comments **must** be resolved before the PR is merged
- `TODO (name):` comments are acceptable to merge - they track future work

---

## Pull Request Process

1. **Create a branch** - Use descriptive names (e.g., `feature/contact-form`)
2. **Make changes** - Follow patterns, write tests
3. **Run checks** - `make check`
4. **Push and create PR** - Use the PR template
5. **Wait for CI** - All checks must pass
6. **Address feedback** - Respond to review comments
7. **Merge** - Squash merge to main

See [PR_WORKFLOW.md](./PR_WORKFLOW.md) for detailed instructions.

---

## Getting Help

- **Documentation issues** - Update the relevant doc and submit a PR
- **Bug reports** - Open a GitHub issue with reproduction steps
- **Feature requests** - Open a GitHub issue with use case description
