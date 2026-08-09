# pr-chain — 関連PRの依存とdelivery順を管理する

`/product:dev pr-chain [inspect|merge] <PR...>`は、関連PRの明示的・意味的依存、競合、CI、review状態を調べ、安全な順序を決める。引数なしと`inspect`は読み取り専用。`merge`または自然文でmergeまで明示された場合だけ外向き操作を行う。

## Inspect

1. 各PRのnumber、title、state、base/head、files、mergeability、checks、review decisionを取得する
2. 次の根拠で依存graphを作る
   - あるPRのbaseが別PRのheadである明示的なstack
   - schema → consumer、interface → implementation、dependency → usageの意味的依存
   - 同じfileまたは共有APIを変更する競合risk
3. graphをtopological orderへ並べ、独立PRを依存関係に見せかけない
4. draft、CI failure、required review、merge conflict、base更新の必要性をPRごとに分ける
5. 順序、blocker、各PRをmergeした直後に再確認する項目を報告する

## Merge

1. ユーザーが対象PR群とmergeを明示していること、対象リポジトリのmerge方式と権限を確認する
2. 順序ごとに最新state、required checks、review、mergeabilityを再取得する
3. 1件ずつmergeし、結果を確認してから次へ進む。先行merge後に後続PRが変化したら再検査する
4. branch更新、rebase、conflict解消、admin bypassを暗黙に行わない。必要ならその地点で止めて具体的なblockerを報告する
5. 一部成功後に失敗した場合は、merge済みと未処理を明確に分け、既にmergeしたPRを戻さない

primary checkoutのbranchを切り替えない。dry-runのために作業中差分をstash、revert、checkoutしない。
