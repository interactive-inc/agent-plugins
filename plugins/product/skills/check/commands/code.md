# code — code health check

`/product:check code [scope]`は、対象リポジトリの検証toolと現在のcall pathを使い、コード・テスト・構成を読み取り専用で点検する。

## 手順

1. scopeを変更差分、path、または明示された全体範囲へ解決する
2. 対象リポジトリが定めるformat / lint / typecheck / test / buildからscopeに必要なcommandを確認する。変更差分なら[product:test changed](../../test/commands/changed.md)を使う
3. 利用可能なら未使用検出、repository固有checker、手書き実装fileの行数集計を行う。未使用exportはre-export、framework entrypoint、dynamic reference、外部公開APIを確認してから候補にする
4. 変更範囲を中心に、重複した業務判断、緩すぎる型、空のcatch、deprecated API、未解決TODOを検索し、現在のcall pathと利用者影響で候補を反証する
5. 型とI/O境界、authorization scope、failure / retry、concurrency、expiry / legacyの反例をcall pathで確認する
6. testのskip、retry、sleep、日時依存、対象実装が消えたtestを確認する
7. 800行超は候補、1,500行超は優先候補とするが、行数だけをfindingにしない。責務、依存、変更理由が混在する証拠を求める

## 出力

tool failure、potential bug、dead code、test quality、structure candidate、未検査を分ける。修正や期待値変更は行わない。
