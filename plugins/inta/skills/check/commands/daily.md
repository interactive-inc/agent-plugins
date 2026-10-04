# daily — bounded product check

人間が`/inta:check`を明示実行したときだけ、進行中の開発を邪魔しない範囲で製品の異常候補を調べる。変更や自動起票は行わない。

## 手順

1. 対象リポジトリの指示、`git status`、現在branch、worktree、進行中のIssue / PRを確認する
2. [inta:env](../../env/SKILL.md)のchecklistを読み取り専用で確認する
3. default branchとの差分があれば、[inta:test changed](../../test/commands/changed.md)を検証だけで実行する。差分がなければ全testを暗黙実行しない
4. [readme.md](readme.md)、[docs.md](docs.md)、[code.md](code.md)を変更範囲中心に確認する。差分がなければ各領域の安定した順序の先頭だけに制限する
5. [trace.md](trace.md)を、差分があれば`changed`、なければ`unbound --limit 10`で実行する
6. findingごとに対象範囲、根拠、既存Issue / PRとの重複、推奨する独立した次作業を記録する

## 出力

環境、変更検証、README、docs、code、traceを別categoryで短く報告する。候補が無いcategoryも明記し、未検査を合格へ数えない。
