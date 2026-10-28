# Orca への引き渡し

明示された GitHub Issue の実装を、Orca 管理の worktree と agent へ引き渡す。作成した作業場所と推奨マージ順を報告して終了する。継続監視やタスク全体の指揮はこの入口に含めない。

## 入口と作業場所

`orca status --json` で稼働を確認し、`orca skills get orca-cli` で導入版の操作ガイドを読む。対象 Issue とリポジトリの規約を確認し、未起票なら起票も依頼範囲に含まれるかを先に判断する。

作業場所の作成・命名・削除は引き渡し元で管理する。ブランチ名は製品の規約を優先し、なければ `{issue番号}-{英文}`。表示名は `#{番号} {短い要約}` にする。

## agent とブリーフ

指定があればその agent を使い、既定は Claude Code の `inta:fable`。素の Claude launcher と取り違えず、必要なら terminal の custom command に `claude --agent inta:fable` を指定する。worktree ID と terminal handle は実際の応答から取得し、ブリーフを shell へ送らない。不要な shell は未使用と確認できた場合だけ閉じる。

ブリーフには対象 Issue、目的と許可範囲、製品の指示、検証、完了時の報告を含める。Issue・PR の分類とラベルは [共通規約](../../tools/issue-pr.md) に従い、成果物の分割も Issue の合意を尊重する。push・PR 作成は依頼範囲に含まれる場合に行い、マージは含めない。

並行する変更との重なりを伝え、既定ブランチの最新変更を取り込んだ差分を検証する。実装先から作業場所を増やしたり、他人の作業場所へ変更を加えたりしない。

複数 Issue または `fanout` は [fanout](fanout.md)。対象を勝手に拡大しない。
