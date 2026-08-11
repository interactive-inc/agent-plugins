---
name: docs
description: "Create and verify product documentation artifacts. Use `html` for a customer-facing HTML document or multi-page documentation site, `pdf` to render an existing HTML artifact to A4 PDF, and `readme` to create or update a repository README from verified project facts."
---

> このスキルを更新するときは [product設計](../../README.md) に従う。

`product:docs`は、製品の正本から人間向けの文書成果物を作成し、実表示または実行結果まで検証する専門能力。`.docs`自体の仕様管理と文書同期は`product:dev`、文書の乖離検査は`product:check docs`が担当する。

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

- 製品仕様や設計判断を変える必要がある場合は`product:dev`へ分ける
- 古い文書の検出だけなら`product:check docs`、既存文書の修正なら`product:dev`を使う
- CHANGELOGやリリース告知は、PR一覧から機械的に生成せず、`product:dev`のCHANGELOG判断と対象製品の公開手順に従う
