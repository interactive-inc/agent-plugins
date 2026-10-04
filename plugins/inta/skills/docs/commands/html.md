# html — 製品文書をHTML成果物へ変換する

`/inta:docs html`は、確認済みのMarkdown正本から、単一の配布資料または顧客向け複数ページHTMLを生成して実表示を検品する。

生成前に [共通デザインガイドライン](../../design/DESIGN.md) を全文読み、既存の明示的なブランド規則がない判断へ適用する。

## モード判定

- 1テーマを順に読む配布資料、PDF化が主目的 → `handout`
- `.docs`のvision、利用者、機能、業務フロー、roadmap、glossaryを横断する読み物 → `site`
- 既存成果物がある場合 → 現在の構成を保持し、依頼範囲だけ更新する
- 判断できない場合だけ、単一資料か複数ページかを確認する

## 共通手順

1. 対象リポジトリの規則、本文の正本、読者、用途、出力先を確認する
2. 実装済み機能の断定、数値、URL、権限をコード・設定・公式情報と突合する
3. 出力先を解決する。既定は`/tmp/product-docs/<topic>/`。リポジトリ規則が生成物の管理先を定めている場合はその指定を使う
4. 既存HTMLがあれば構造と表現を保持し、正本と矛盾する箇所だけ更新する
5. 利用可能なbrowser手段で全ページと代表的なviewportを表示し、リンク、折返し、overflow、console error、CDN読込を確認する
6. PDFが必要なら[inta:docs pdf](pdf.md)を続けて実行する

## `handout`

1. [template/build.ts](../template/build.ts)を出力先へコピーする
2. 正本Markdownから本文を反映し、`bun build.ts`でsingle-file HTMLを生成する
3. 共通デザインガイドラインの白黒、文字4段、余白`4 / 8 / 16 / 32 / 64px`、横罫線を使わない節区切り、項目ごとに切れた縦罫線、h1 → h2 → h3、templateの図コンポーネントという既定を守る。対象製品に明示的な配布資料デザインがあればそちらを優先する
4. 長いURL、図の箱、定義リスト、ページ境界を実表示で確認する

## `site`

1. `.docs`の入口、capabilities / features、stories、milestones / roadmap、glossaryから、存在する情報だけを収集する
2. [docs-pages.md](../references/docs-pages.md)で必要ページを選ぶ。情報が無いページを水増ししない
3. [docs-content.md](../references/docs-content.md)に従い、内部メモや実装ジャーゴンを読者向けに翻訳する。ただし利用判断に必要な制限、未提供機能、対象外範囲は隠さない
4. [docs-page.html](../template/docs-page.html)を基礎に共通header、navigation、brand tokenを揃え、全ページの相互リンクを生成する。`{{BRAND_*}}`は対象製品の既存tokenで置換し、無ければneutral grayを使ってplaceholderを残さない
5. すべてのsource documentが少なくとも1ページに反映されたか、反映しなかったsourceと理由を記録する

## 報告

- mode、正本、出力先、生成・更新したページ
- 実装と突合した主張、意図的に掲載しなかった内部情報
- browserで確認したviewportとページ、未検査範囲
- PDF化した場合はPDF pathと全ページ検品結果
