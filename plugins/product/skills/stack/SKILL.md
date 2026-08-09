---
name: stack
description: "Choose or migrate a product stack and its cross-cutting development tools. Use for Hono, TanStack, Next.js, test tooling, local browser tooling, Sentry, MCP-to-CLI decisions, or a package/framework migration guide. Inspect and recommend by default; install only with explicit approval."
argument-hint: "[migration] [package current target]"
user-invocable: true
disable-model-invocation: false
---

# Stack selection

`migration [package] [current] [target]`は[commands/migration.md](commands/migration.md)へ振り分ける。それ以外は下記のproject shapeから必要なreferenceを選び、現在の選定と候補を読み取り専用で報告する。

Inspect the repository before recommending a stack. Preserve an established stack unless the user is asking for a migration or the current choice cannot meet the product requirement.

Route by project shape:

- Hono backend → [hono.md](references/hono.md)
- React SPA or TanStack Start → [tanstack.md](references/tanstack.md)
- React SSR / RSC where Next.js is already selected → use the installed Next.js guidance
- Cross-cutting tools and MCP migrations → [tools.md](references/tools.md)

# Decision contract

1. Inspect manifests, lockfiles, framework config, test config, deployment config, and repository instructions
2. State the detected project shape and constraints
3. Separate required choices from optional improvements
4. Prefer an existing local CLI or installed Skill over adding an MCP with the same capability
5. Show packages, generated files, removed configuration, and migration risk before installation
6. Install, remove, or rewrite configuration only when the user explicitly authorizes it

Do not copy a reference architecture mechanically into an existing product. Use it as a decision aid and keep conventions already enforced by the repository.
