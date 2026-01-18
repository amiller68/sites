# Task Template

Copy and customize this template for each well-scoped ticket. This is what you paste into your Claude Code conversation to start a task.

---

## How to Use

1. Copy the template below into your Claude Code conversation
2. Fill in the "Your Mission" section with your specific task
3. Start in planning mode - let Claude Code analyze and propose a strategy
4. Execute - once the plan is approved, work autonomously
5. Verify - ensure [success criteria](./SUCCESS_CRITERIA.md) are met before creating PR

---

# Template

```markdown
# Goal

Complete the following well-scoped ticket within your branch.

**During planning phase**: Collect all information needed to clarify ambiguous requirements.

**Once executing**: Complete tasks without further intervention. You have leeway to accomplish tasks as you see fit.

**Once satisfied**: Push changes and open a descriptive PR for review.

## References

- [Project Layout](./docs/agents/PROJECT_LAYOUT.md) - Monorepo structure
- [TypeScript Patterns](./docs/agents/TYPESCRIPT_PATTERNS.md) - Architecture patterns
- [Success Criteria](./docs/agents/SUCCESS_CRITERIA.md) - CI requirements
- [PR Workflow](./docs/agents/PR_WORKFLOW.md) - Git and PR conventions

## Constraints

- Run `make install` at the start to ensure dependencies are available
- Do not run dev servers (shared machine with other agents)
- Ensure `make check` passes before creating PR
- Follow existing patterns in the codebase

---

# Your Mission

[Describe your task here. Be specific about:
- What needs to be built or fixed
- Any relevant context or background
- Expected behavior or acceptance criteria
- Any constraints or requirements
- Files or areas of the codebase to focus on]
```

---

## Example Mission

```markdown
# Your Mission

## Ticket: Add Newsletter Subscribe Form

### Description
Add a newsletter subscription form to the blog page that integrates with Quotient CMS.

### Requirements
- Add a subscribe form component below blog posts
- Use Quotient's `people.upsert` API to subscribe users
- Show success/error states after submission
- Validate email format client-side

### Acceptance Criteria
- Users can enter their email and subscribe
- Success message shown after successful subscription
- Error message shown if subscription fails
- Form has proper loading state during submission
- `make check` passes

### Files to Consider
- Blog page: `ts/apps/dev/app/blog/page.tsx`
- Quotient client: `ts/apps/dev/src/lib/quotient/client.ts`
- UI components: `ts/packages/ui/src/components/`
```

---

## Tips for Success

1. **Start with planning** - Use planning mode to break down the task
2. **Read relevant code first** - Understand existing patterns before making changes
3. **Run `make install`** at the start - Ensure all dependencies are available
4. **Test incrementally** - Run tests as you go, not just at the end
5. **Follow existing patterns** - Match the style and structure of existing code
6. **Keep it focused** - Stick to the defined scope, avoid scope creep
7. **Verify CI success** - Ensure `make check` passes before creating PR
