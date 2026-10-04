---
name: design
description: "Apply or review Inta's shared visual design system for HTML documents, PDFs, presentation decks, diagrams, and UI mockups. Use when creating or materially restyling a visual artifact, or when checking one for design consistency."
---

`inta:design`は視覚成果物へ共通デザインを適用し、既存成果物との一貫性を点検する入口。本文や製品仕様の正本にはならず、出力形式固有の生成・変換・検品手順も持たない。

作業を始める前に、必ず [共通デザインガイドライン](DESIGN.md) を全文読む。ユーザーの明示指示または対象リポジトリのデザインシステムがある場合はその差分を優先し、指定のない判断へ共通ガイドラインを適用する。

# 契約

- 新規作成・再設計では、色、文字階層、余白、罫線、図解、不要なメタ情報をガイドラインへ揃える
- 既存成果物の軽微な修正では、依頼範囲を越えて全面的に作り直さない
- 点検だけを依頼された場合は変更せず、違反箇所と具体的な修正案を示す
- 文書生成は`inta:docs`の形式固有契約を使い、デザイン規則はこのスキルとDESIGN.mdへ一元化する
- ブラウザ利用、サーバー起動、PDF生成、外部画像取得は、ユーザーと対象リポジトリの許可範囲を越えて行わない
