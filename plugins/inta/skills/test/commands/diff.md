# diff — 2 sourceのUI比較

`/inta:test diff`はreference Aとtarget Bを同条件で取得し、overlay / difference / side-by-sideを使って、設計者と実装者が行動できる差分を文章化する。

## Inputs

A / BはFigma node URL、page URL、local PNGのいずれでもよい。比較に必要なsource、page、viewportが入力済みなら質問しない。不足が結果を変える場合だけ一度にまとめて確認する。

代表例:

- design vs implementation
- production vs local / staging
- refactor before vs after
- baseline PNG vs current page

## Capture

1. A / Bで同じviewport、device scale、font load、auth state、scroll position、dynamic data条件を使う
2. page URLは対象リポジトリが指定するbrowser手段で取得する
3. Figmaはtokenが既に設定されている場合だけbundled `figma-export.ts`を使う。secretを出力しない
4. inputと生成物は`/tmp/product-test/ui-diff/<run>/`へ置く
5. 日時、animation、A/B test、cookie bannerなど意図した動的差分を除外として記録する

## Compose

bundled scriptの依存が利用可能な場合は次を使う。

```bash
bun <skill-dir>/scripts/diff/overlay-compose.ts <a.png> <b.png> <output-prefix>
bun <skill-dir>/scripts/diff/generate-report.ts <run-dir>
```

複数page / viewportは`batch-overlay.ts`を使う。sizeが違う場合は原因を先に確認し、headerや余白差を隠すためにoffset / cropを乱用しない。依存追加が必要なら実行前に許可を得る。

## Review

[diff-categories.md](../references/diff-categories.md)を使い、次を重要度順に整理する。

- missing / extra content
- layout and alignment
- spacing and sizing
- typography
- color / border / shadow
- responsive behavior
- state / interaction mismatch

pixel difference値だけで合否を決めない。意図した差分、撮影条件差、実装修正が必要な差分を分ける。

## Report and cleanup

比較条件、確定差分、除外、未検査、推奨修正を文章で報告する。対象リポジトリが画像保存・uploadを禁止していれば、確認後にrun directoryを削除する。外部uploadは明示許可がある場合だけ行う。
