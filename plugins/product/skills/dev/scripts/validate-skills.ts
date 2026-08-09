#!/usr/bin/env bun

import { existsSync, readFileSync, readdirSync } from "node:fs"
import { basename, dirname, join, relative, resolve } from "node:path"

const pluginDir = resolve(import.meta.dir, "../../..")
const skillsDir = join(pluginDir, "skills")
const agentsDir = join(pluginDir, "agents")
const errors: string[] = []
const ignoredMarkdownDirectories = new Set(["node_modules"])
const humanInvokedSkillNames = new Set(["check", "maintain", "env"])

const allowedFrontmatterKeys = new Set([
  "name",
  "description",
  "argument-hint",
  "user-invocable",
  "disable-model-invocation",
])

function fail(path: string, message: string): void {
  errors.push(`${relative(pluginDir, path)}: ${message}`)
}

function read(path: string): string {
  return readFileSync(path, "utf8")
}

function parseFrontmatter(path: string, source: string): Map<string, string> {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/)
  if (match === null) {
    fail(path, "missing YAML frontmatter")
    return new Map()
  }

  const result = new Map<string, string>()
  for (const line of match[1].split("\n")) {
    const keyMatch = line.match(/^([a-z][a-z0-9-]*):\s*(.*)$/)
    if (keyMatch === null) continue
    result.set(keyMatch[1], keyMatch[2].replace(/^['"]|['"]$/g, ""))
  }
  return result
}

function markdownFilesUnder(path: string): string[] {
  const result: string[] = []
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const entryPath = join(path, entry.name)
    if (entry.isDirectory()) {
      if (ignoredMarkdownDirectories.has(entry.name)) continue
      result.push(...markdownFilesUnder(entryPath))
    } else if (entry.name.endsWith(".md")) {
      result.push(entryPath)
    }
  }
  return result
}

function validateLinks(path: string, source: string): void {
  const pattern = /\[[^\]]+\]\(([^)]+)\)/g
  const prose = source.replace(/```[\s\S]*?```/g, "")
  for (const match of prose.matchAll(pattern)) {
    const rawTarget = match[1].trim().replace(/^<|>$/g, "")
    const target = rawTarget.split("#", 1)[0]
    if (target.length === 0) continue
    if (/^(https?:|mailto:|data:)/.test(target)) continue
    if (target.includes("{") || target.includes("<")) continue
    if (/\s/.test(target) || target === "path") continue
    const resolved = resolve(dirname(path), target)
    if (!existsSync(resolved)) fail(path, `broken relative link: ${rawTarget}`)
  }
}

function linkedSkillNames(
  path: string,
  source: string,
  knownSkillNames: ReadonlySet<string>,
): Set<string> {
  const result = new Set<string>()
  const pattern = /\[[^\]]+\]\(([^)]+)\)/g
  const prose = source.replace(/```[\s\S]*?```/g, "")
  for (const match of prose.matchAll(pattern)) {
    const rawTarget = match[1].trim().replace(/^<|>$/g, "")
    const target = rawTarget.split("#", 1)[0]
    if (target.length === 0 || /^(https?:|mailto:|data:)/.test(target)) continue
    const resolved = resolve(dirname(path), target)
    const relativeTarget = relative(skillsDir, resolved)
    if (relativeTarget.startsWith("..")) continue
    const targetSkillName = relativeTarget.split(/[\\/]/, 1)[0]
    if (knownSkillNames.has(targetSkillName)) result.add(targetSkillName)
  }
  return result
}

const skillDirs = readdirSync(skillsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => join(skillsDir, entry.name))
  .filter((path) => existsSync(join(path, "SKILL.md")))
  .sort()

for (const skillDir of skillDirs) {
  const skillPath = join(skillDir, "SKILL.md")
  const source = read(skillPath)
  const frontmatter = parseFrontmatter(skillPath, source)
  const skillName = basename(skillDir)

  if (frontmatter.get("name") !== skillName) {
    fail(skillPath, `frontmatter name must equal directory name "${skillName}"`)
  }
  if (!frontmatter.has("description")) fail(skillPath, "description is required")

  for (const key of frontmatter.keys()) {
    if (!allowedFrontmatterKeys.has(key)) fail(skillPath, `unsupported frontmatter key: ${key}`)
  }

  const lineCount = source.split("\n").length
  if (lineCount > 180)
    fail(skillPath, `SKILL.md must remain an index (found ${lineCount} lines, max 180)`)

  if (frontmatter.get("user-invocable") === "true") {
    const openaiPath = join(skillDir, "agents", "openai.yaml")
    if (!existsSync(openaiPath)) {
      fail(skillPath, "user-invocable skill requires agents/openai.yaml")
    } else if (!read(openaiPath).includes(`$${skillName}`)) {
      fail(openaiPath, `default_prompt must mention $${skillName}`)
    }
  }

  if (humanInvokedSkillNames.has(skillName)) {
    if (frontmatter.get("user-invocable") !== "true") {
      fail(skillPath, "human-invoked skill must be user-invocable")
    }
    if (frontmatter.get("disable-model-invocation") !== "true") {
      fail(skillPath, "human-invoked skill must disable model invocation")
    }
    const openaiPath = join(skillDir, "agents", "openai.yaml")
    if (
      existsSync(openaiPath) &&
      !/policy:\s*\n\s*allow_implicit_invocation:\s*false/.test(read(openaiPath))
    ) {
      fail(openaiPath, "human-invoked skill must disable implicit invocation")
    }
  }

  validateLinks(skillPath, source)

  const commandsDir = join(skillDir, "commands")
  if (existsSync(commandsDir)) {
    for (const commandPath of markdownFilesUnder(commandsDir)) {
      validateLinks(commandPath, read(commandPath))
    }
  }
}

const allMarkdown = markdownFilesUnder(skillsDir)

const agentSkillContracts = new Map<string, string[]>([
  ["fable", ["dev", "agent-runtime"]],
  ["sonnet", ["dev", "agent-runtime", "agent-browser"]],
  ["opus", ["dev", "agent-runtime", "agent-browser"]],
  ["worker", ["dev", "agent-runtime", "agent-browser"]],
  ["loop", ["patrol", "agent-browser"]],
  ["hacker", ["security", "agent-browser"]],
])

for (const [agentName, requiredSkills] of agentSkillContracts) {
  const agentPath = join(agentsDir, `${agentName}.md`)
  if (!existsSync(agentPath)) {
    fail(agentPath, "missing agent definition")
    continue
  }
  const source = read(agentPath)
  const lineCount = source.split("\n").length
  if (lineCount > 30) fail(agentPath, `agent must remain lightweight (found ${lineCount} lines, max 30)`)
  if (/description:\s*["']\?["']/.test(source)) fail(agentPath, "description must explain the agent role")
  for (const skillName of requiredSkills) {
    if (!source.includes(`  - ${skillName}\n`)) fail(agentPath, `must load ${skillName}`)
  }
  validateLinks(agentPath, source)
}

const knownSkillNames = new Set(skillDirs.map((path) => basename(path)))
const skillDependencies = new Map<string, Set<string>>()
for (const skillName of knownSkillNames) skillDependencies.set(skillName, new Set())

for (const path of allMarkdown) {
  const sourceSkillName = relative(skillsDir, path).split(/[\\/]/, 1)[0]
  const dependencies = skillDependencies.get(sourceSkillName)
  if (dependencies === undefined) continue
  for (const targetSkillName of linkedSkillNames(path, read(path), knownSkillNames)) {
    if (targetSkillName !== sourceSkillName) dependencies.add(targetSkillName)
  }
}

for (const sourceSkillName of ["dev", "test"]) {
  for (const targetSkillName of skillDependencies.get(sourceSkillName) ?? []) {
    if (humanInvokedSkillNames.has(targetSkillName)) {
      fail(
        join(skillsDir, sourceSkillName, "SKILL.md"),
        `${sourceSkillName} must not invoke human-only ${targetSkillName}`,
      )
    }
  }
}

const dependencyState = new Map<string, "visiting" | "visited">()
const dependencyPath: string[] = []

function visitSkillDependency(skillName: string): void {
  dependencyState.set(skillName, "visiting")
  dependencyPath.push(skillName)

  for (const dependency of skillDependencies.get(skillName) ?? []) {
    if (dependencyState.get(dependency) === "visiting") {
      const cycleStart = dependencyPath.indexOf(dependency)
      const cycle = [...dependencyPath.slice(cycleStart), dependency].join(" -> ")
      fail(join(skillsDir, skillName, "SKILL.md"), `circular skill dependency: ${cycle}`)
    } else if (dependencyState.get(dependency) !== "visited") {
      visitSkillDependency(dependency)
    }
  }

  dependencyPath.pop()
  dependencyState.set(skillName, "visited")
}

for (const skillName of knownSkillNames) {
  if (!dependencyState.has(skillName)) visitSkillDependency(skillName)
}

const forbiddenPatterns: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /\/product:[a-z-]+:[a-z-]+/, reason: "duplicated product command namespace" },
  { pattern: /\bproduct:(?:init|refactor)\b/, reason: "retired product skill namespace" },
  {
    pattern: /\bproduct:dev\s+(?:trace|drift|links|features-sync|skills)\b/,
    reason: "inspection and environment commands must not live under product:dev",
  },
  { pattern: /\/wordpress(?:\s|$)/m, reason: "legacy /wordpress command; use /product:wordpress" },
  { pattern: /\bAskUserQuestion\b/, reason: "platform-specific question tool in shared skill" },
  { pattern: /mcp__claude-in-chrome__/, reason: "Claude-only browser tool in shared skill" },
  { pattern: /subagent_type\s*=/, reason: "Claude-only subagent type in shared skill" },
  { pattern: /\bbudget\.total\b/, reason: "runtime-specific token budget in shared skill" },
  { pattern: /\bmeta\.name\b/, reason: "runtime-specific workflow metadata in shared skill" },
  {
    pattern: /(?:1 class = 1 use case|1クラス\s*=\s*1ユースケース|1 Service = 1 ユースケース)/,
    reason: "a use case maps to an Application operation, not a class",
  },
  {
    pattern: /Serviceクラスで実装|メソッド名は `execute` で統一/,
    reason: "Application operations must not require a class or generic execute method",
  },
  {
    pattern: /main checkoutでブランチを切って|main checkoutのbranchと常駐serverを使う/,
    reason: "primary checkout branch switching must not be used as an Issue or dev-server fallback",
  },
  {
    pattern: /dev server は main checkout の 1 本のみ/,
    reason: "dev server policy must preserve Issue worktree isolation",
  },
]

for (const path of allMarkdown) {
  const source = read(path)
  validateLinks(path, source)
  for (const item of forbiddenPatterns) {
    if (item.pattern.test(source)) fail(path, item.reason)
  }
  if (path.includes(`${join("skills", "wordpress")}/`) && /GitHub MCP/.test(source)) {
    fail(path, "WordPress workflow must use the shared product:dev GitHub flow")
  }
}

const contractChecks: Array<{ path: string; required: string[] }> = [
  {
    path: join(pluginDir, "README.md"),
    required: [
      "primary checkoutに紐づくブランチを切り替えない",
      "Issue用linked worktree",
      "make worktree",
      "既存worktreeから開始した場合は再実行しない",
    ],
  },
  {
    path: join(skillsDir, "agent-runtime", "references", "orchestrator.md"),
    required: [
      "git rev-parse --git-common-dir",
      "git worktree add -b",
      "primary checkoutではブランチを切り替えない",
      "追加のworktreeを絶対に作らない",
      "make worktree`を1回実行",
      "既存 worktree では再実行しない",
    ],
  },
  {
    path: join(skillsDir, "agent-runtime", "references", "solo.md"),
    required: ["ブランチを作成・切り替えず", "primary checkoutにいてもこの境界は変えない"],
  },
  {
    path: join(skillsDir, "agent-runtime", "references", "worker.md"),
    required: ["ブランチを作成・切り替えない", "worktree、Issue、PR、push、gh、dev server を扱わない"],
  },
  {
    path: join(skillsDir, "dev", "references", "request.md"),
    required: [
      "git rev-parse --git-common-dir",
      "git worktree add -b",
      "dev serverの要否を理由にprimary checkoutのブランチへ切り替えない",
      "次のIssue用worktreeを先に作らず",
      "make worktree`を1回実行",
      "`make worktree`を再実行しない",
      "`product:env`を暗黙起動してtargetを追加しない",
    ],
  },
  {
    path: join(skillsDir, "dev", "references", "tools", "dev-server.md"),
    required: ["Issue用linked worktreeのserver", "primary checkoutのブランチへ切り替えない"],
  },
  {
    path: join(skillsDir, "dev", "SKILL.md"),
    required: ["product:test", "開発中に自動実行しない"],
  },
  {
    path: join(skillsDir, "env", "SKILL.md"),
    required: ["worktree.md", "Makefile", "冪等な`worktree` target", "`.PHONY`"],
  },
  {
    path: join(skillsDir, "env", "references", "worktree.md"),
    required: [
      ".PHONY: worktree",
      "make worktree",
      "長時間processを起動しない",
      "自分でlinked worktreeを作成した場合",
      "既存linked worktreeからセッションを開始した場合",
      "`make worktree`を再実行しない",
    ],
  },
  { path: join(skillsDir, "test", "SKILL.md"), required: ["changed.md", "/tmp/product-test/"] },
  {
    path: join(skillsDir, "check", "SKILL.md"),
    required: ["`full`", "読み取り専用", "direct user invocation"],
  },
  {
    path: join(skillsDir, "maintain", "SKILL.md"),
    required: [
      "挙動不変",
      "direct user invocation",
      "product:check",
      "構成拡張",
      "再利用可能",
      "ユーザーがその構成を明示",
    ],
  },
  {
    path: join(skillsDir, "maintain", "commands", "code.md"),
    required: [
      "「ライブラリにして」",
      "「別製品でも使えるように」",
      "「private workspace packageにして」",
      "「npmで公開して」",
      "package.json",
      "lockfile",
      "全数照合",
      "CI / deploy",
    ],
  },
  {
    path: join(skillsDir, "env", "SKILL.md"),
    required: ["引数なし", "読み取り専用", "開発中に自動起動しない"],
  },
  { path: join(skillsDir, "wordpress", "SKILL.md"), required: ["plan", "apply", "product:dev"] },
]

for (const check of contractChecks) {
  const source = read(check.path)
  for (const required of check.required) {
    if (!source.includes(required)) fail(check.path, `missing contract text: ${required}`)
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(error)
  console.error(`product skill validation failed with ${errors.length} error(s)`)
  process.exit(1)
}

console.log(`validated ${skillDirs.length} product skills`)
