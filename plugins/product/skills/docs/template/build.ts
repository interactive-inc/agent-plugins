// 配布資料の自己完結 HTML（Tailwind CSS Play CDN v4）を生成する雛形。
// 使い方: /tmp/product-docs/{topic}/ へコピーし、TITLE / DATE / LEAD / BODY を
// 正本の Markdown（開発対象リポジトリの .docs/）から流し込んで `bun build.ts`。
// guide.html は生成物なので直接編集しない。文言修正は正本 → このファイル → 再生成の順。
//
// デザイン規約（スタイル定義に組み込み済み。逸脱しない）:
// - 色は白と黒のみ
// - 文字サイズは Tailwind トークン 4 段のみ: text-base 本文 / text-lg h3 / text-2xl h2 / text-3xl h1
// - 余白は Tailwind スケール 4 段のみ: 2 / 4 / 8 / 16
// - コンポーネント: h1 / h2 / h3 / 本文(p,dd) / ラベル(dt) / code / 図(diagram) / 定義リスト(dl)
// - 見出しは h1 → h2 → h3 の順。h2 直下の説明は本文で書く（中間サイズの定義文スタイルを作らない）

const TITLE = "{{資料タイトル}}"
const DATE = "{{YYYY.MM.DD}}"
const LEAD = "{{リード文。この資料が何を説明するかを 1〜2 文で。}}"

const BODY = /* html */ `
<section>
  <h2>{{節タイトル}}</h2>
  <p>{{h2 直下の説明は本文で書く。}}</p>

  <h3>{{小見出し}}</h3>
  <p>{{本文。}}</p>

  <dl>
    <dt>{{ラベル}}</dt>
    <dd>{{説明。長いドメイン名や URL はラベル側でなくこちらに <code class="domain">example.com</code> の形で置く。}}</dd>
  </dl>
</section>

<!-- 図の例: 横並び（diagram）+ 枠（dgroup）+ 縦積み内の横並び（drow）
<section>
  <h2>{{図のある節}}</h2>
  <p>{{説明。}}</p>
  <div class="diagram">
    <div class="dbox">{{箱}}<span class="sub">{{補足}}</span></div>
    <div class="darrow">&#8594;</div>
    <div class="dgroup">
      <div class="dlabel">{{枠のラベル}}</div>
      <div class="dbox">{{箱}}</div>
      <div class="dvarrow">&#8595;</div>
      <div class="drow">
        <div class="dbox">{{箱}}</div>
        <div class="dbox">{{箱}}</div>
      </div>
    </div>
  </div>
</section>
-->
`

const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${TITLE}</title>
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<style type="text/tailwindcss">
@theme {
  --font-sans: "Hiragino Sans", "Noto Sans JP", sans-serif;
}
@layer base {
  body { @apply font-sans text-base font-normal leading-relaxed text-black bg-white; }
  header { @apply mb-16; }
  h1 { @apply text-3xl font-semibold leading-tight; }
  section { @apply mt-16; }
  h2 { @apply text-2xl font-semibold leading-tight; }
  h3 { @apply text-lg font-medium leading-tight mt-8; }
  p { @apply mt-4; }
  h2 + p { @apply mt-8; }
  h3 + p { @apply mt-2; }
  dl { @apply mt-4 grid grid-cols-[14rem_1fr] gap-x-8 gap-y-4; }
  dt { @apply font-medium; }
  code { @apply font-mono text-base; }
}
@layer components {
  .wrap { @apply max-w-3xl mx-auto px-8 py-16; }
  .date { @apply mt-4; }
  .lead { @apply mt-8; }
  .domain { @apply block; }
  .diagram { @apply mt-8 flex items-center gap-2; }
  .dbox { @apply border border-black px-4 py-2 text-center flex-1; }
  .sub { @apply block whitespace-nowrap; }
  .darrow { @apply flex-none; }
  .dgroup { @apply border border-black p-4 flex flex-col gap-2 flex-2; }
  .dlabel { @apply text-center font-medium; }
  .dvarrow { @apply text-center; }
  .dstack { @apply flex flex-col gap-2 flex-1; }
  .wide { @apply flex-2; }
  .drow { @apply flex items-center gap-2; }
  .drow .dbox { @apply px-2; }
}
</style>
<style>
  @page { size: A4; margin: 18mm; }
  @media print {
    h1, h2, h3 { break-after: avoid; }
    p, dl, .diagram { break-inside: avoid; }
    header { break-after: avoid; }
  }
</style>
</head>
<body>
<div class="wrap">

<header>
  <h1>${TITLE}</h1>
  <div class="date">${DATE}</div>
  <p class="lead">${LEAD}</p>
</header>
${BODY}
</div>
</body>
</html>
`

await Bun.write(new URL("guide.html", import.meta.url), html)
console.log(`generated guide.html (${html.length} bytes)`)
