---
name: check
description: "Run human-requested, read-only product health checks. Use directly for bounded daily checks, `full` audits, or scoped specification, documentation, code, README, and environment inspection. Never invoke automatically during development."
---

`/inta:check {入力}`は、人間が明示実行する読み取り専用の製品点検入口。開発中や定期Automationから自動起動せず、修正、Issue起票、report保存、設定変更へ進まない。

# 振り分け

- 引数なし → [daily.md](commands/daily.md)。変更範囲または上限付き候補を点検する
- `full` → [full.md](commands/full.md)。人間が明示した場合だけ全体監査する
- `trace [scope]` → [trace.md](commands/trace.md)。仕様接続と潜在仕様バグを点検する
- `docs [scope]` → [docs.md](commands/docs.md)。README / `.docs`と実装、文書リンクを点検する
- `code [scope]` → [code.md](commands/code.md)。検証結果、境界、不要code、巨大fileを点検する
- `readme [scope]` → [readme.md](commands/readme.md)。人間向け・agent向け入口文書を点検する
- `env` → [inta:env](../env/SKILL.md)の読み取り専用点検を行う

# 共通契約

- direct user invocationを起動条件とする。他Skillやモデル判断だけで開始しない
- すべてのmodeでfile、Issue、backlog、依存、Git設定を変更しない
- scope、比較基点、使用したchecker、確認済み / 未確認範囲を最初に示す
- grep一致だけをfindingにせず、現在のpath、適用規則、call pathまたは再現可能な反例で再確認する
- potential bug、仕様接続異常、coverage不足、保守候補、環境要因を混ぜない
- 修正を求められた場合、挙動不変の保守は`inta:maintain`、機能・bug修正は`inta:dev`へ別タスクとして渡す
