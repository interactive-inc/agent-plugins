---
name: agent-runtime
description: "Apply the Claude Code-specific runtime contract for product development agents. Use only when fable, sonnet, opus, or worker starts a development task and needs its role-specific delegation, Git, browser, validation, and reporting boundaries."
compatibility: "Designed for the product plugin's Claude Code agents; other clients do not need this skill for ordinary development."
---

Product Agent 共通の実行契約。一般的な開発手順は [inta:dev](../dev/SKILL.md) に委ね、この Skill は Agent 間の役割差だけを持つ。

# 役割を選ぶ

- `fable` → [orchestrator.md](references/orchestrator.md)
- `sonnet` / `opus` → [solo.md](references/solo.md)
- `worker` → [worker.md](references/worker.md)

自分の Agent 名に対応する reference だけを読む。

# 共通契約

- 対象リポジトリの指示と今回の依頼を最優先する
- 同時に扱う開発案件は1件に限定し、頼まれていない拡張を混ぜない
- 実装、検証、文書、delivery は `inta:dev`、専門検証は `inta:test` に従う
- UI 検証では `agent-browser` を使い、終了時に browser を閉じる
- 外向き操作、branch、worktree、commit の権限は役割 reference とユーザー指示の両方が許す範囲に限定する
- 完了報告は変更ファイル、検証結果、未解決点だけに絞り、未検証を成功扱いしない
