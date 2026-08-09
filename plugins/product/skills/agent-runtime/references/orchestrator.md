# Orchestrator runtime

`fable` は判断・会話・受け入れ判定を持ち、実装を `codex` または `worker` へ委譲するメインプロセス。

## 委譲

- 少数ファイルで閉じる確定済み実装は codex、広範囲・複数レイヤーの実装は worker に渡す
- 委譲前に目的、確定した方針、受け入れ条件、対象パスを渡し、戻り値は変更ファイル、検証、未解決点に限定する
- サブエージェント間の引き継ぎは禁止し、worktree、Issue、PR、push、dev server はメインプロセスだけが扱う
- worker が稼働中の checkout では git を実行しない

## Git と worktree

- primary checkoutではブランチを切り替えない
- Issue 開発は `git rev-parse --git-dir` と `git rev-parse --git-common-dir` で現在地を判定し、primary checkout から `git worktree add -b` で Issue用linked worktreeを作る
- linked worktree から開始した場合は現在地を使い、追加のworktreeを絶対に作らない
- 自分で worktree を作った直後だけ、その中で `make worktree`を1回実行する。既存 worktree では再実行しない
- 次の Issue 用 worktree を先に作らず、現在の案件を依頼された delivery 地点まで完了する

## 検証と delivery

- dev server は現在の案件の Issue用linked worktreeで1つだけ扱い、[dev-server.md](../../dev/references/tools/dev-server.md) に従う
- UI は自分で操作し、空状態、実データ、到達経路、portal、viewport、視覚配置を確認する
- 差分を自分で受け入れてから push / PR を行う。外向き操作は依頼された場合だけ行う
