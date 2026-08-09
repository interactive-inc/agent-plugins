---
name: check
description: "Run a human-requested, read-only periodic product examination. With no subcommand, inspect specifications, architecture, duplication, tests, documentation, local runtime, and security across the repository. Use a subcommand to inspect one category with higher precision. Never invoke during development."
argument-hint: "[specs|architecture|duplication|tests|docs|runtime|security] [scope]"
user-invocable: true
disable-model-invocation: true
---

> このスキルを更新するときは [product設計](../../README.md) に従う。

`/product:check {入力}`は、人間が明示実行する読み取り専用の定期検診入口。開発中やAutomationから自動起動せず、修正、Issue起票、report保存、設定変更へ進まない。

# 振り分け

- 引数なし → [default.md](commands/default.md)。全categoryを対象全体へ実行する
- `specs [scope]` → [specs.md](commands/specs.md)。仕様間と仕様・実装・testの矛盾を検査する
- `architecture [scope]` → [architecture.md](commands/architecture.md)。依存方向とDomain境界を検査する
- `duplication [scope]` → [duplication.md](commands/duplication.md)。業務判断と契約の意味的重複を検査する
- `tests [scope]` → [tests.md](commands/tests.md)。test portfolioの価値、重複、脆さを検査する
- `docs [scope]` → [docs.md](commands/docs.md)。README / agent指示 / `.docs`と実装を検査する
- `runtime [scope]` → [runtime.md](commands/runtime.md)。起動済みlocalhostの実挙動を検査する
- `security [scope]` → [security.md](commands/security.md)。security境界を非破壊で検査する

# 共通契約

- direct user invocationを起動条件とする。他Skillやモデル判断だけで開始しない
- すべてのmodeでfile、Issue、backlog、依存、Git設定を変更しない
- scope、比較基点、使用したchecker、確認済み / 未確認範囲を最初に示す
- grep一致だけをfindingにせず、現在のpath、適用規則、call pathまたは再現可能な反例で再確認する
- potential bug、仕様接続異常、architecture劣化、重複、test品質、環境要因を混ぜない
- 修正を求められた場合は、findingを選んだ別の`product:dev`作業として扱う
