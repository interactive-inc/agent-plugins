---
name: env
description: "Inspect or explicitly apply a human-requested development environment setup."
argument-hint: "[apply|skills]"
user-invocable: true
disable-model-invocation: true
---

# 開発環境

人間が依頼した環境点検・整備を扱う。引数なしは読み取り専用、`apply` は指定範囲の適用、`skills` は [必要なスキルの導入](commands/skills.md)。開発中に独立した環境整備を自動起動しない。

## 確認するもの

- 対象製品の指示・既存構成と [stack](../stack/SKILL.md) の標準。
- 起動、依存導入、format / lint / typecheck / test の実行定義と CI。採用済み Git hook は通常の commit 経路でも動くか。
- [worktree 初期化](references/worktree.md)、unit と E2E の探索境界、秘密値・生成物の ignore。

変更には既存の独自設定を保持し、必要な差分だけ適用する。全体整形や基盤移行を今回の環境修正へ混ぜない。依存やサービスの追加は、対象リポジトリの承認範囲に従う。

## 必要時の参照

- [lint / format の移行](references/migrate-linters.md)、[Vite 設定](references/vite-config.md)
- [Playwright](references/playwright.md)、[portless](references/portless.md)

適用後は変更した経路を実行し、試験が0件の偽成功にならないことと、不要な生成物が残らないことを確認する。結果・差分・不足する依存・未確認を短く返す。
