# fanout

複数のIssueを一気に並行worktreeへ展開するfull handoff。1 Issue = 1 worktree = 1 agent。

# 手順

1. 対象Issueを確定する。引数の番号列が正。「全部」のような依頼は直近の会話文脈か `gh issue list --assignee @me --state open --json number,title,issueType` から候補を集め、実装計画を持つTaskだけを選んで展開前に一覧を示す。勝手に対象を広げない
2. 重なりを分析する。各Issue本文から触るファイル群を読み、同領域を触るIssueの組を特定する。各ブリーフの「並行中の関連Issue」にその番号を列挙する
3. Issueごとに展開する。SKILL.mdの命名ルールとエージェント起動でworktree作成 → 日本語display-name設定 → agent起動 → ブリーフ送信。作成は直列でよい
4. 報告して終了する。worktree一覧（フォルダ名と日本語名）と、ファイルの重なりが少ない順の推奨マージ順を報告する。以後の監視はしない

# 並走の注意

ブリーフに次を含める。同一マシンで多数のagentとテストが並走する前提の防御。

- フルテストはCPUを食い合い、タイムアウト系のテストが偽陽性で落ちることがある。落ちたテストは単独で再実行してから判定する
- pre-commitのbackup stash（lint-staged等）はリポジトリ全体で共有される。並行コミットで失敗したらそのまま再実行し、他セッションのstashはdropしない
- 他のworktreeには一切触らない
