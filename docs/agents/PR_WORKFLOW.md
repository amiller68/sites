# PR Workflow Guide

This document describes the pull request workflow for the krondor/sites project.

## Overview

We support parallel development, allowing multiple well-scoped tasks to be worked on simultaneously. This approach is effective when working with Claude Code agents on discrete, non-overlapping work items.

---

## Branch Naming Conventions

Follow these conventions for branch names:

- **Features**: `feature/short-description` (e.g., `feature/contact-form`)
- **Bug fixes**: `fix/issue-description` (e.g., `fix/blog-pagination`)
- **Chores**: `chore/task-description` (e.g., `chore/update-deps`)
- **Refactoring**: `refactor/component-name` (e.g., `refactor/theme-provider`)

---

## Development Process

### Initial Setup

```bash
# Navigate to your workspace
cd /path/to/sites

# Install dependencies - ALWAYS do this first!
make install

# Verify environment
make check
```

### Working with Claude Code

1. **Plan Mode** - Start by understanding the task and proposing a strategy
2. **Iterate on Strategy** - Refine the approach before execution
3. **Execute** - Work autonomously within defined parameters
4. **Verify** - Ensure success criteria are met

### Success Criteria

**You are not allowed to finish in a state where CI is failing.**

Before considering work complete, ensure these commands pass:

```bash
make check          # Runs all checks (build, format, types, lint)
```

---

## Creating a Pull Request

### Pre-PR Checklist

- [ ] All success criteria commands pass (`make check`)
- [ ] Tests are written and passing
- [ ] Changes are committed with descriptive messages
- [ ] Branch is pushed to remote

### Create PR with gh CLI

```bash
# Ensure changes are committed
git add .
git commit -m "feat: add contact form functionality

- Implement Quotient integration for form submission
- Add client-side validation
- Add success/error feedback states

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to remote
git push -u origin feature/contact-form

# Create PR
gh pr create --title "Add contact form functionality" --body "$(cat <<'EOF'
## Summary
- Implemented contact form with Quotient CMS integration
- Added client-side validation
- Added success/error feedback states

## Test Plan
- [x] Form submits successfully to Quotient
- [x] Validation shows appropriate errors
- [x] Success message appears after submission
- [x] All existing tests still pass
- [x] `make check` passes

## Changes
- `ts/apps/dev/app/contact/page.tsx` - Contact page
- `ts/apps/dev/app/contact/contact-form.tsx` - Form component
- `ts/apps/dev/src/lib/quotient/client.ts` - Quotient hooks

Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

### PR Title Conventions

Use conventional commit prefixes:

- `feat:` - New features
- `fix:` - Bug fixes
- `refactor:` - Code refactoring without functionality changes
- `chore:` - Maintenance tasks, dependency updates
- `docs:` - Documentation changes
- `test:` - Test additions or modifications
- `perf:` - Performance improvements

---

## CI/CD Pipeline

### GitHub Actions Workflow

Our CI pipeline runs automatically on every push and PR:

**Checks that run:**
1. **Format checking** - Prettier/Biome
2. **Linting** - ESLint/Biome
3. **Type checking** - tsc
4. **Build verification** - Ensures production build succeeds

**All checks must pass before merging.**

### Continuous Deployment

The CD pipeline automatically deploys to production when:
- Changes are merged to `main`
- CI checks pass

---

## Code Review Guidelines

### What Reviewers Should Check

1. **Functionality** - Does the code solve the stated problem?
2. **Tests** - Are there appropriate tests? Do they pass?
3. **Code Quality** - Is the code readable and maintainable?
4. **Architecture** - Does it fit the existing patterns?
5. **Security** - Any potential vulnerabilities?

### What Reviewers Should NOT Worry About

- **Formatting** - CI enforces this automatically
- **Linting** - CI catches this
- **Type safety** - Type checker verifies this
- **Build success** - CI verifies this

### Review Process

1. **Automated checks** - Wait for CI to pass (or investigate failures)
2. **Code review** - Review the changes in GitHub
3. **Request changes** or **Approve**
4. **Merge** - Squash merge to `main` (preserves clean history)

---

## Troubleshooting

### CI Failing After PR Creation

**Format issues:**
```bash
make fmt          # Auto-fix formatting
git add .
git commit -m "chore: fix formatting"
git push
```

**Type errors:**
```bash
make types        # See type errors
# Fix errors, then:
git add .
git commit -m "fix: resolve type errors"
git push
```

**Test failures:**
```bash
make test         # See failing tests
# Fix tests, then commit and push
```

### Dev Server Issues

**Do not run dev servers in agent workspaces** - you're on a shared machine with other agents.

For testing:
- Run tests: `make test`
- Check builds: `make build`
- Trust that manual testing will happen after merge

---

## Quick Reference

**Success criteria:**
```bash
make check  # Must pass before PR
```

**Create PR:**
```bash
gh pr create --title "feat: description" --body "..."
```

**View PR status:**
```bash
gh pr status
gh pr checks
```

**Merge after approval:**
```bash
gh pr merge --squash
```
