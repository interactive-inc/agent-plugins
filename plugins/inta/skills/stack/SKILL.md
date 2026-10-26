---
name: stack
description: "Apply vp, Void, and standard project structure, or plan an explicit migration."
argument-hint: "[migration] [package current target]"
user-invocable: true
disable-model-invocation: false
---

# 開発基盤と配置

社内外共通の標準は `vp` と `void`。新規のWeb製品は Void を使う。既存製品では現在の構成を確認し、今回の変更と基盤移行を混同しない。移行が必要なら、目的・範囲・影響を対話して決める。

## 道具の正本

- 依存の導入・追加は `vp install` を入口にする。実行時は導入済みの `vp --help` と `vp install --help` で構文を確認し、既存の管理方式とロックファイルを維持する。
- 開発・整形・検査・試験は `vp` と製品の実在する実行定義を使う。未導入の道具を確認なく追加しない。
- Void の使い方と標準配置は [Void](references/void.md)。API・命令・配置を古い例から写さず、導入版に同梱された公式資料で確かめる。
- DBや外部サービスを持つ場合の責務は `dev` の [設計規約](../dev/references/design/architecture.md) にそろえる。

## 必要な場合の参照

- 既存のHono製品：[配置と実装](references/hono.md)
- 既存のTanStack製品：[接続と実装](references/tanstack.md)。新規製品へ自動で採用しない
- 横断する道具：[tools](references/tools.md)
- `migration [package current target]`：[移行](commands/migration.md)

選定時は目的・期限・規模・運用負担を先に把握する。標準から外す理由や、既存製品を移行する判断を利用者へ説明し、必要な差分だけを適用する。
