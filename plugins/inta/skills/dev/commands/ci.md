# ci — CI失敗を診断する

`/inta:dev ci [PR|run URL|run ID]`は、失敗したCIを読み取り専用で診断し、最初の失敗、原因分類、再現方法、最小の修正候補を報告する。修正まで依頼された場合だけ通常の`inta:dev`フローへ続ける。

## 手順

1. 対象リポジトリ、workflow、run、commit SHA、比較対象の成功runを解決する。入力が無ければcurrent branchまたは直近の失敗候補を列挙する
2. GitHub Actionsなら`gh pr checks`、`gh run view --log-failed`などで失敗job / stepだけを先に取得する。巨大logを無条件に取り込まない
3. cascadeした後続errorではなく時系列上の最初の失敗を特定し、該当するsource、test、config、lockfileを読む
4. `code / test expectation / dependency / environment / permission / flaky / external service`に分類する
5. 同一commitの複数run、再現command、対象リポジトリの既知baselineで仮説を反証する。runが1件だけならflakyと断定しない
6. 修正依頼がある場合は、対象範囲と受け入れ条件を固定して標準フローのImplementへ進む

## 報告

- workflow、run、commit、失敗job / step
- 最初の失敗と直接のlog evidence
- 確認済み原因、可能性、未確認を分けた分類
- local reproductionまたは再実行方法
- 修正候補と、修正に必要な追加権限

secret値やtokenをlogから再掲しない。権限不足や外部障害をコード不具合として処理しない。
