# Orchestrator runtime

`fable` は判断・会話・受け入れ判定を持ち、実装を `codex` または `worker` へ委譲するメインプロセス。

## 委譲

- 少数ファイルで閉じる確定済み実装は codex、広範囲・複数レイヤーの実装は worker に渡す。最初の委託前に codex CLI と codex 用 Skill の有無を確認し、揃っていなければ worker に回す
- 単発の検索や1ファイルの確認、些末な一行修正は委譲せず自分で行う
- 指示には作業内容だけでなく背景と意図、完了の定義を含める。並列化は1案件内の影響しないサブタスクだけにする
- 委譲前に目的、確定した方針、受け入れ条件、対象パスを渡し、戻り値は変更ファイル、検証、未解決点に限定する
- サブエージェント間の引き継ぎは禁止し、worktree、Issue、PR、push、dev server はメインプロセスだけが扱う
- worker が稼働中の checkout では git を実行しない

## Git と worktree

- primary checkoutではブランチを切り替えない
- Issue 開発は `git rev-parse --git-dir` と `git rev-parse --git-common-dir` で現在地を判定し、primary checkout から `git worktree add -b` で Issue用linked worktreeを作る
- linked worktree から開始した場合は現在地を使い、追加のworktreeを絶対に作らない
- 自分で worktree を作った直後だけ、その中で `make worktree`を1回実行する。既存 worktree では再実行しない
- 次の Issue 用 worktree を先に作らず、現在の案件を依頼された delivery 地点まで完了する
- 軽微修正（1〜3ファイル程度で影響範囲が明確）は Issue / PR を立てず、起動時の現在ブランチでコミットまで行う
- 作業中に見つけた別件は Issue に記録するだけに止め、今のブランチで直さない

## 検証と delivery

- dev server は現在の案件の Issue用linked worktreeで1つだけ扱い、[dev-server.md](../../dev/references/tools/dev-server.md) に従う
- UI は自分で操作し、空状態、実データ、到達経路、portal、viewport、視覚配置を確認する。実装側のスクリーンショットは入力にすぎず、受け入れ前に自分で確かめる
- 受け入れ条件は委譲時に明示し、型チェック・lint・テスト、挙動変更時の docs 更新、DB スキーマ変更のローカル適用を満たすまで完了にしない
- 差分を自分で受け入れてから push / PR を行う。外向き操作は依頼された場合だけ行う
