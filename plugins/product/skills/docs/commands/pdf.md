# pdf — HTML を A4 PDF に変換して検品する

`/product:docs pdf`は、生成済みのsingle-file HTMLを利用可能なbrowser / PDF手段でA4 PDFへ変換し、renderした全ページを検品する。

# 手順

1. 対象環境で利用できるbrowser automationを選ぶ。agent-browserがある場合は次の手順でHTMLを開き、CDN読み込み完了後にPDF化する

```bash
agent-browser open "file:///tmp/product-docs/{topic}/guide.html"
agent-browser wait --load networkidle
agent-browser pdf "/tmp/product-docs/{topic}/{資料名}.pdf"
agent-browser close
```

2. PDF toolでpage数を確認し、全pageを画像へrenderする
3. 全pageを目視し、生成して終わりにしない。利用できないtoolや未確認pageがあれば未検査として報告する

# 検品の観点

- 段落・図・定義リストがページ境界で泣き別れていないか。テンプレートの `@media print` に `break-inside: avoid` を入れてあるが、長い要素は割れることがある
- 図の箱の中で文字が折り返していないか（flex の幅配分は文字量で崩れる）
- 見出しがページ末尾に孤立していないか（`break-after: avoid` で防いでいるが確認する）
- 長いドメイン名・URL が列からはみ出して隣の文字に重なっていないか。定義リストの左列（14rem）に収まらない語は右列の本文側へ移す

# 配布

- 配布ファイル名は内容が分かる名前にする（例: `製品名システム構成ガイド.pdf`）
- PDF・HTML・build.ts は既定でリポジトリにコミットしない。資料の正本は `.docs/` の Markdown（[SKILL.md](../SKILL.md) の「共通契約」）
- 修正依頼が来たら、正本の Markdown を直してから build.ts に反映して再生成する
