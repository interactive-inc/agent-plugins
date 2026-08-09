---
name: test
description: "Select and run focused product verification. Use `changed` for the current diff, `unit` for behavior, `api` for contract compatibility, `a11y` for WCAG, `visual` or `diff` for rendered UI, and `perf` for measured web performance regressions."
argument-hint: "[changed|unit|api|a11y|visual|diff|perf]"
user-invocable: true
disable-model-invocation: false
---

> このスキルを更新するときは [product設計](../../README.md) に従う。

開発時の専門検証入口。通常の機能開発では`product:dev`の一部として使い、別の受け渡し工程を作らない。対象リポジトリの指示と標準コマンドを最優先する。

仕様ID、Application / Domain、endpoint E2E、Journey E2E、smokeの責任分担は[testing.md](references/testing.md)を正本とし、必要な場合だけ読む。

# 振り分け

- 引数なし / `changed` → [changed.md](commands/changed.md)。差分から必要な検証を選び、実行結果を一つにまとめる
- `unit` → [unit.md](commands/unit.md)。関数、Application / Domain、React componentなどの振る舞いを検証する
- `api` → [api.md](commands/api.md)。API contractの追加・削除・型変更とconsumer影響を比較する
- `a11y` → [a11y.md](commands/a11y.md)。コードは静的レビュー、URLは実ブラウザとaxeで検証する
- `visual` → [visual.md](commands/visual.md)。変更したUIを実際に操作し、描画と状態を確認する
- `diff` → [diff.md](commands/diff.md)。デザイン、本番、ローカル、画像など2ソースを同条件で比較する
- `perf` → [perf.md](commands/perf.md)。同条件の複数計測からperformance regressionを判定する

# 共通契約

- 「検証して」という依頼では製品コードや期待値を変更しない。修正やテスト追加まで依頼された場合だけ書き込む
- パッケージやブラウザruntimeが不足している場合、勝手に追加せず、必要性と影響を説明して許可を得る
- スクリーンショット、GIF、HTMLレポートは既定で`/tmp/product-test/`へ置く。対象リポジトリが保存・アップロードを禁止していれば、確認後に削除し、文章だけを報告する
- 実行不能や未検査を合格に数えない。成功、失敗、未検査、環境要因を分ける
- ブラウザ検証はURL、アカウント種別、viewport、操作、結果を文章で残す
