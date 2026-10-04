---
name: orca
description: "Create Orca-managed worktrees and hand off GitHub Issues to per-worktree TUI agents. Use for a single-Issue handoff by number, and `fanout` to expand multiple Issues into parallel worktrees at once."
---

Orca管理のworktreeを作り、Issueの実装をworktree内のagentへfull handoffする入口。委託後は作成したworktreeと推奨マージ順を報告して終了し、監視・ポーリングはしない。進捗追跡・DAG・ask/replyが必要な依頼はこのスキルの対象外（orchestration系の運用を使う）。

# 前提

- 最初のOrcaコマンドの前に `orca status --json` で稼働を確認し、`orca skills get orca-cli` でversion-matched guideを読む。サブコマンドやフラグを記憶から推測しない
- 対象は起票済みのGitHub Issue。未起票の依頼は先に`dev`のrequestフローでIssueにしてから戻る
- worktreeの作成・命名・削除はこのスキルを実行するセッションだけが行い、委託先agentにはやらせない

# 命名ルール

- `worktree create --name` はフォルダ名とブランチ名を兼ねるため英語にする。`dev`のブランチ命名 `{issue番号}-{自然な英文}` に合わせる（例: `3131-unify-month-freeze-guard`）
- 作成直後に `worktree set --display-name "#{issue番号} {端的な日本語}"` を実行する。日本語タイトルはIssueタイトルの要約で、20字程度に収める

# エージェント起動

既定はClaude Codeの`inta:fable`。Orca組み込みの`--agent claude`は素のclaudeを立てるため、customコマンドの二段で起動する。

```text
ORCA worktree create --repo id:<repoId> --name <issue番号-英文> --no-parent --json
ORCA terminal create --worktree id:<repoId>::<path> --title <名前> --command 'claude --agent inta:fable' --json
ORCA terminal wait --terminal <handle> --for tui-idle --timeout-ms 60000 --json
ORCA terminal send --terminal <handle> --text "<ブリーフ>" --enter --json
```

- worktreeのidは`<repoId>::<path>`の完全な値を`create --json`の応答からコピーする
- bare createはfallback shellを開くことがある。ブリーフの送信先はagentのhandleだけにし、shellを閉じるのは`terminal show`でunused shellと確認できた場合だけ
- 依頼で別のagent（codex等）が名指しされた場合はそちらを使う。Orca組み込みのlauncherで足りるなら `worktree create --agent codex --prompt "<ブリーフ>"` の一段でよい

# ブリーフの型

送るプロンプトは自己完結させる。含めるもの。

- 担当Issue番号と「`gh issue view {N}` で本文と計画を精読してから着手」
- 対象リポジトリのCLAUDE.md / rulesに従うこと
- 変更範囲の検証（test / typecheck / lint）を完了条件にすること
- commit規約に従い、pushして `closes #{N}` を含むPRを作成すること。マージはしない
- 1 worktree 1 PR。Issue側にPR分割の言及があっても、このworktreeでは1本にまとめてよい
- 並行Issueとファイルが重なる場合はその番号を列挙し、PR作成前にorigin/mainを取り込む指示

# 振り分け

- Issue番号1件 → 上記の単発handoff
- `fanout` または複数Issue → [fanout.md](commands/fanout.md)
