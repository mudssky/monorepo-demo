# Bootstrap Task: Fill Project Development Guidelines

**You (the AI) are running this task. The developer does not read this file.**

The developer just ran `trellis init` on this project for the first time.
`.trellis/` now exists with empty spec scaffolding, and this bootstrap task
exists under `.trellis/tasks/`. When they want to work on it, they should start
this task from a session that provides Trellis session identity.

**Your job**: help them populate `.trellis/spec/` with the team's real
coding conventions. Every future AI session — this project's
`trellis-implement` and `trellis-check` sub-agents — auto-loads spec files
listed in per-task jsonl manifests. Empty spec = sub-agents write generic
code. Real spec = sub-agents match the team's actual patterns.

Don't dump instructions. Open with a short greeting, figure out if the repo
has any existing convention docs (CLAUDE.md, .cursorrules, etc.), and drive
the rest conversationally.

---

## Status (update the checkboxes as you complete each item)

- [ ] Fill guidelines for ai-cli
- [ ] Fill guidelines for jsbookmark
- [ ] Fill guidelines for lowcode-editor
- [ ] Fill guidelines for react-playground
- [ ] Fill guidelines for server
- [ ] Fill guidelines for web-admin
- [ ] Fill guidelines for @mudssky/eslint-config-custom
- [ ] Fill guidelines for @monorepo-demo/logger
- [ ] Fill guidelines for @monorepo-demo/redis
- [ ] Fill guidelines for @mudssky/prettier-config-custom
- [ ] Fill guidelines for @mudssky/react-components
- [ ] Fill guidelines for @mudssky/stylelint-config-custom
- [ ] Fill guidelines for @mudssky/tsconfig
- [ ] Fill guidelines for ui
- [ ] Add code examples

---

## Spec files to populate

### Package: ai-cli (`spec/ai-cli/`)

- Frontend guidelines: `.trellis/spec/ai-cli/frontend/`

### Package: jsbookmark (`spec/jsbookmark/`)

- Frontend guidelines: `.trellis/spec/jsbookmark/frontend/`

### Package: lowcode-editor (`spec/lowcode-editor/`)

- Backend guidelines: `.trellis/spec/lowcode-editor/backend/`

- Frontend guidelines: `.trellis/spec/lowcode-editor/frontend/`

### Package: react-playground (`spec/react-playground/`)

- Frontend guidelines: `.trellis/spec/react-playground/frontend/`

### Package: server (`spec/server/`)

- Backend guidelines: `.trellis/spec/server/backend/`

- Frontend guidelines: `.trellis/spec/server/frontend/`

### Package: web-admin (`spec/web-admin/`)

- Frontend guidelines: `.trellis/spec/web-admin/frontend/`

### Package: @mudssky/eslint-config-custom (`spec/eslint-config-custom/`)

- Frontend guidelines: `.trellis/spec/eslint-config-custom/frontend/`

### Package: @monorepo-demo/logger (`spec/logger/`)

- Backend guidelines: `.trellis/spec/logger/backend/`

- Frontend guidelines: `.trellis/spec/logger/frontend/`

### Package: @monorepo-demo/redis (`spec/redis/`)

- Backend guidelines: `.trellis/spec/redis/backend/`

- Frontend guidelines: `.trellis/spec/redis/frontend/`

### Package: @mudssky/prettier-config-custom (`spec/prettier-config-custom/`)

- Frontend guidelines: `.trellis/spec/prettier-config-custom/frontend/`

### Package: @mudssky/react-components (`spec/react-components/`)

- Backend guidelines: `.trellis/spec/react-components/backend/`

- Frontend guidelines: `.trellis/spec/react-components/frontend/`

### Package: @mudssky/stylelint-config-custom (`spec/stylelint-config-custom/`)

- Frontend guidelines: `.trellis/spec/stylelint-config-custom/frontend/`

### Package: @mudssky/tsconfig (`spec/tsconfig/`)

- Frontend guidelines: `.trellis/spec/tsconfig/frontend/`

### Package: ui (`spec/ui/`)

- Frontend guidelines: `.trellis/spec/ui/frontend/`


### Thinking guides (already populated)

`.trellis/spec/guides/` contains general thinking guides pre-filled with
best practices. Customize only if something clearly doesn't fit this project.

---

## How to fill the spec

### Step 1: Import from existing convention files first (preferred)

Search the repo for existing convention docs. If any exist, read them and
extract the relevant rules into the matching `.trellis/spec/` files —
usually much faster than documenting from scratch.

| File / Directory | Tool |
|------|------|
| `CLAUDE.md` / `CLAUDE.local.md` | Claude Code |
| `AGENTS.md` | Codex / Claude Code / agent-compatible tools |
| `.cursorrules` | Cursor |
| `.cursor/rules/*.mdc` | Cursor (rules directory) |
| `.windsurfrules` | Windsurf |
| `.clinerules` | Cline |
| `.roomodes` | Roo Code |
| `.github/copilot-instructions.md` | GitHub Copilot |
| `.vscode/settings.json` → `github.copilot.chat.codeGeneration.instructions` | VS Code Copilot |
| `CONVENTIONS.md` / `.aider.conf.yml` | aider |
| `CONTRIBUTING.md` | General project conventions |
| `.editorconfig` | Editor formatting rules |

### Step 2: Analyze the codebase for anything not covered by existing docs

Scan real code to discover patterns. Before writing each spec file:
- Find 2-3 real examples of each pattern in the codebase.
- Reference real file paths (not hypothetical ones).
- Document anti-patterns the team clearly avoids.

### Step 3: Document reality, not ideals

**Critical**: write what the code *actually does*, not what it should do.
Sub-agents match the spec, so aspirational patterns that don't exist in the
codebase will cause sub-agents to write code that looks out of place.

If the team has known tech debt, document the current state — improvement
is a separate conversation, not a bootstrap concern.

---

## Quick explainer of the runtime (share when they ask "why do we need spec at all")

- Every AI coding task spawns two sub-agents: `trellis-implement` (writes
  code) and `trellis-check` (verifies quality).
- Each task has `implement.jsonl` / `check.jsonl` manifests listing which
  spec files to load.
- The platform hook auto-injects those spec files + the task's `prd.md`
  into every sub-agent prompt, so the sub-agent codes/reviews per team
  conventions without anyone pasting them manually.
- Source of truth: `.trellis/spec/`. That's why filling it well now pays
  off forever.

---

## Completion

When the developer confirms the checklist items above are done with real
examples (not placeholders), guide them to run:

```bash
python ./.trellis/scripts/task.py finish
python ./.trellis/scripts/task.py archive 00-bootstrap-guidelines
```

After archive, every new developer who joins this project will get a
`00-join-<slug>` onboarding task instead of this bootstrap task.

---

## Suggested opening line

"Welcome to Trellis! Your init just set me up to help you fill the project
spec — a one-time setup so every future AI session follows the team's
conventions instead of writing generic code. Before we start, do you have
any existing convention docs (CLAUDE.md, .cursorrules, CONTRIBUTING.md,
etc.) I can pull from, or should I scan the codebase from scratch?"
