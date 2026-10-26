---
name: docs
description: "Create and verify product HTML, PDF, or README documentation from project sources."
argument-hint: "[html|pdf|readme] [source or request]"
user-invocable: true
disable-model-invocation: false
---

`inta:docs`は、製品の正本から人間向けの文書成果物を作成し、実表示または実行結果まで検証する入口。`.docs`自体の仕様管理は`inta:dev`、文書の乖離検査は`inta:check docs`、意味が一意な同期修正は`inta:maintain docs`が担当する。

HTML・PDF・READMEの書式は、対象リポジトリの既存の文書と依頼者の指定を優先する。指定がなければ同梱のひな形を使い、特定企業の見た目や標章を追加しない。

# 振り分け

- `html [source or request]` → [html.md](commands/html.md)。単一の配布資料、または`.docs`から顧客向け複数ページHTMLを生成する
- `pdf [html path]` → [pdf.md](commands/pdf.md)。生成済みHTMLをA4 PDFへ変換して全ページを検品する
- `readme [scope]` → [readme.md](commands/readme.md)。実際の構成とコマンドからREADMEを新規作成または更新する
- 引数なし → 変更せず、成果物と正本を確認して上記3入口を案内する

# 共通契約

- 対象リポジトリの指示と既存の文書構成を先に読み、本文の正本を決める
- コード、設定、公式情報で裏付けられない機能、数値、互換性、運用状態を断定しない
- 既存文書は丸ごと再生成せず、人間が書いた説明と意思決定を保持して必要箇所だけ直す
- HTML、PDF、生成scriptは既定で`/tmp/product-docs/<topic>/`へ置く。リポジトリ内へ保存するのは、対象リポジトリまたはユーザーが出力先を明示した場合だけ
- package、browser runtime、外部画像を追加せず、必要なら目的・影響・代替手段を示して承認を得る
- 実表示、リンク、コマンド、PDF全ページなど、成果物に応じた検証を完了条件にする。未検査を完成扱いしない

# 成果物の境界

- 製品仕様や設計判断を変える必要がある場合は`inta:dev`へ分ける
- 古い文書の検出だけなら`inta:check docs|readme`、既存文書の挙動不変な整理だけなら`inta:maintain docs|readme`を使う
- CHANGELOGやリリース告知は、PR一覧から機械的に生成せず、`inta:dev`のCHANGELOG判断と対象製品の公開手順に従う
