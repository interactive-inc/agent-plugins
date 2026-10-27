---
name: docs
description: "Create and verify product HTML, PDF, or README documentation from project sources."
argument-hint: "[html|pdf|readme] [source or request]"
user-invocable: true
disable-model-invocation: false
---

# 製品文書の作成

製品の正本から人向けの文書を作り、出力まで検証する。対象リポジトリの書式と依頼者の指定を優先し、指定がなければ同梱のひな形を使う。

| 入力 | 成果物 |
| --- | --- |
| `html` と正本・依頼 | [HTML 資料・文書サイト](commands/html.md) |
| `pdf` と HTML | [PDF と全ページの検品](commands/pdf.md) |
| `readme` と対象 | [現在の実装に沿った README](commands/readme.md) |

自然文から成果物と正本が分かれば進め、不明な場合だけ確認する。機能・数値・権限・提供状況は根拠で確かめ、内部メモと利用者に必要な制約を区別する。人の説明や決定を保持して更新する。

HTML・PDF・生成 script の既定の出力先は `/tmp/product-docs/<topic>/`。指定された保存先があれば従う。依存や外部素材の追加は対象リポジトリの承認範囲に従う。

実表示・リンク・実行コマンド・PDF 全ページなど、成果物に必要な検証を行い、未確認を完成扱いしない。仕様や設計判断の正本は `dev` の `.docs` とし、生成物を別の正本へ育てない。
