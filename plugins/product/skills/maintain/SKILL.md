---
name: maintain
description: "Perform one human-requested, behavior-preserving product maintenance change. Use directly for scoped README, documentation, code, test, or structure cleanup after a check; never invoke automatically during feature or bug development."
argument-hint: "[readme|docs|code] [scope]"
user-invocable: true
disable-model-invocation: true
---

> このスキルを更新するときは [product設計](../../README.md) に従う。

`/product:maintain {入力}`は、人間が明示した一系統の挙動不変な手入れを行う。検査だけなら`product:check`を使い、開発中に自動起動しない。

# 振り分け

- `readme [scope]` → [readme.md](commands/readme.md)。README / agent向け指示の一系統だけを整理する
- `docs [scope]` → [docs.md](commands/docs.md)。`.docs`の一系統だけを実装へ同期する
- `code [scope]` → [code.md](commands/code.md)。確認済みfindingからコード、テスト、構成の一系統だけを整理する
- 引数なし → 対象が決まらないため変更せず、上記3入口を案内する

# 共通契約

- direct user invocationを起動条件とし、別Skillやモデル判断だけで開始しない
- 作業前にgit状態、進行中のIssue / PR、対象pathを確認し、1系統 = 1変更として範囲を確保する
- 必要なら同じscopeの`product:check`手順を読み取り専用で先に実行し、findingを確定する
- 内部リファクタリングは既存リポジトリ内の内部配置を既定とする。新規workspace / package、独立した配布物・version、公開APIは構成拡張であり、今回の依頼でユーザーがその構成を明示した場合だけ作る。「再利用可能」「ライブラリ化」「別製品でも使える」だけから配布予定を推測しない
- バグ修正、仕様変更、権限変更を混ぜず、根拠と再現条件を別の`product:dev`作業へ渡す
- コードと文書が矛盾し、どちらが正か一意でなければ変更しない
- リポジトリ全体の書き込みは排他的に扱う
