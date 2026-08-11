# リクエストの振り分け

何かしたい時に投げる単一の入口。入力を読み、行き先を決めて記録し、必要なら実装まで進める。Issue / PR の書式は [gh-templates.md](tools/gh-templates.md)、signals / backlogs の書式は本スキルの Documentation 規約（references/docs/）が正本。Issue / PR の本文を組み立てる前に、必ず [gh-templates.md](tools/gh-templates.md) を Read する。

## 入力の解釈

数字や `#N` を含むときは既存 Issue / PR の続き作業として扱う。

GitHub の Issue / PR URL は同上。

`signals/{slug}` のパスは既存記録の更新・昇格として扱う。

それ以外の自然文は中身を読んで振り分ける。

入力なしのときは backlog 候補の提案に振る（signals から候補を提案する）。

## 振り分けの判定

入力の粒度、当事者性、許可された外向き操作で行き先を決める。

### signal に振る

主語が「お客さんが」「〇〇さんが言ってた」のような観察報告。誰がやるか・何をやるかは未定。

例「求人検索の絞り込みが効かないって細川さんが言ってた」「経営者向けの画面が分かりにくいと福岡の顧客から複数声が来てる」

書式と保存場所は signals 規約（[signals.md](docs/signals.md)）に従う。

### backlog に振る

主語が「〜したい」「〜できたらいい」のような自分・チームの発想。粒度は大きく、まだ実装に落ちない。

例「求人一覧にお気に入り機能つけたい」「経営者向けダッシュボードを作りたい」

書式と保存場所は backlogs 規約（[backlogs.md](docs/backlogs.md)）に従う。

### issue に振る

「Issueにして」「PRまで」などGitHubへの記録・deliveryが明示された着手可能な作業。やる人とやることが明確。

例「一覧の1ページ目だけお気に入りボタンが効かないバグ修正」「Issue #1234 を実装する」

Bug / Feature / Task の選び方、Title 規則、Assignment、`.github/*_TEMPLATE.md` の優先順位は [gh-templates.md](tools/gh-templates.md) に従う。

### 直接作業に振る

着手可能な修正・実装依頼だが、Issue / push / PRなどの外向き操作は依頼されていない。対象リポジトリ内の変更と検証を進め、GitHub操作は行わない。

### 既存 Issue / PR の続き作業に振る

数字、`#N`、GitHub URL を含む入力。下記「Workflow: 既存 Issue の続き」を参照。

## 曖昧な時の振る舞い

分類だけが曖昧でも成果物と次の行動が変わらない場合は、最も自然な分類を仮定して理由を1行で示し、作業を続ける。記録先、外向き操作、製品仕様など結果が大きく変わる場合だけ確認する。

## GitHub 操作の原則

Issue / PR の作成・編集・close / reopen・ラベル・テキストコメントは、必ず gh コマンドで行う。ブラウザで PR / Issue の作成画面・編集画面を開かない。

外向き操作（git push・PR 作成・Issue 起票）は、指示に明示されている場合のみ行う。実装だけを頼まれた作業で勝手に push や PR 作成をしない。既定はコミットで止まる。

個人情報・機密情報はリポジトリの規約に従い、Issue / PR 本文にもスクリーンショットにも出さない。

起票前に既存 Open Issue との重複を `gh issue list` で確認する。重複ではなく関連なら本文からリンクする。起票・更新後は `gh issue view` / `gh pr view` で本文が意図通り反映されたことを確認する。

PR 作成の前提として uncommitted changes が無いことを `git status` で確認する。あれば止めて呼び出し元に返す（コミット漏れの可能性）。リモートにブランチが無ければ `git push -u origin` で push、既にあれば `git push` で更新する。base は指定が無ければリポジトリの既定に従う。

UI変更は実ブラウザで確認し、URL、account / role、viewport、操作、結果をPRへ文章で残す。画像は対象リポジトリが許可し、ユーザーまたはPR規約が要求する場合だけ[screenshot-upload.md](tools/screenshot-upload.md)に従う。

既存のOpen Issue / PRと重複する、baseが複数候補で結果が変わる、外部reviewerやmilestoneの選択が依頼範囲を超える場合は、作成・更新せず根拠つきで返す。repository defaultで一意に解決できるbaseや未指定のoptional metadataを理由に停止しない。

## Workflow: 新規の依頼

### Classify

入力を読んでsignal / backlog / issue / 直接作業のどれかに分類する。結果が変わらない曖昧さは仮定を示して進み、結果が変わる場合だけ確認する。

### Discuss（issue / backlog のとき）

Vision alignmentと主要tradeoffを確認する。ユーザーが実装方針とdelivery地点まで明示している場合は、同じ内容の承認を取り直さない。製品価値やscopeを変える未決定事項がある場合だけ、選択肢と推奨案を提示して判断を求める。

### Record

signal なら signals 規約に従って記録する。`.docs/index.md` を先に読んでビジョンと整合チェックする。類似テーマがあれば該当 slug.md の AI ゾーンに追記、無ければ新規 slug.md を作成する。ビジョン外なら `## 課題` セクションにその旨を明記する。`index.md` は触らない（再生成手順は [signals.md](docs/signals.md) に記載）。

backlog なら backlogs 規約に従って記録する。`.docs/index.md` と `.docs/backlogs/index.md` を先に読む。入力が signals/ slug ならその内容を背景としてリンクする。既存 backlogs/ slug を指定された場合は `---` ゾーン分離を解析し、AI ゾーン（`---` より上）のみ書き換える。新規作成時は `---` を置かない（人間ゾーンは人間が必要時に末尾へ足す）。`index.md` は触らない。

issueなら[gh-templates.md](tools/gh-templates.md)を読み、Bug / Feature / Task判定とTemplateに従って`gh issue create`する。重複は`gh issue list`で先に確認する。実装も依頼済みなら「Workflow: 既存Issueの続き」にそのまま合流する。

直接作業ならGitHubへ記録せず、Inspect → Design → Code → Verificationへ進む。完了地点はユーザーの依頼と対象リポジトリの規則に従う。

### Promote

signal や backlog として記録したものを後で issue に昇格させたい場合は、該当 slug を指定して再分類で issue を選ぶ。元の signal / backlog は残し、issue 本文の Source 行に元 slug を `[[signals/{slug}]]` または `[[backlogs/{slug}]]` で記録する。

## Workflow: 既存 Issue の続き（Issue 取得から PR まで）

入力が数字や URL の場合、または新規の依頼から issue 起票後に実装へ進む場合。

同じメインプロセスが書き込みを伴って進めるIssueは1件だけにする。次のIssue用worktreeを先に作らず、現在のIssueを依頼されたdelivery地点まで完了してから次へ進む。

### Inspect

`gh issue view {N}` で本文を取得し、`## Plan` セクションが埋まっているか判定する。

`gh pr list --search "{N} in:body" --state all --json number,title,state,headRefName,isDraft` で紐づく PR を検索する。

既存PRが同じIssueとscopeを扱う場合は、そのPRへ続ける。別scope、closed / abandoned、または複数候補がある場合だけ確認する。既存Planが現在のcodeと依頼に一致すれば使い、古ければ差分更新し、無ければPlanへ進む。

### Plan

技術計画を作成し Issue body に書き込む。[gh-templates.md](tools/gh-templates.md) の Task Template の書式に従う。計画はコードベースを読んで影響範囲を把握してから作成する。下記「Plan の skip 基準」に該当する場合は計画できない旨を返してユーザーに判断を委ねる。

「作り直す」ならフル再生成して上書き。「更新する」なら差分のみ反映。「使う」ならスキップ。

### Report

計画とPR状況を短く共有する。ユーザーが実装を依頼済みならBranchへ続ける。調査・計画だけの依頼、または新しい製品判断が必要な場合はここで止める。

### Branch

`git rev-parse --git-dir`と`git rev-parse --git-common-dir`の実体パスを比較し、現在地がprimary checkoutかlinked worktreeかを先に判定する。ディレクトリ名だけで判定しない。

primary checkoutにいる場合、そのcheckoutに紐づくブランチは切り替えない。`git switch`、`git checkout <branch>`、`gh pr checkout`は使わない。`{issue番号}-{自然な英文}`のブランチ（例 `42-fix-pagination-offset`）を`git worktree add -b`でIssue用linked worktreeへ割り当て、実装・コミット・検証・PRはそこで行う。既存PRへ続ける場合も、PRのhead branchをprimary checkoutへチェックアウトせずlinked worktreeへ割り当てる。

linked worktreeにいる場合は、IDEなどがそのセッション用に作成したworktreeとして現在地を使い、別worktreeを作らない。現在のブランチが対象Issue / PRと一致しない場合も、ブランチを切り替えたり別worktreeを作ったりせず、制約を報告して止める。

このIssueフローが`git worktree add`でlinked worktreeを作成した場合に限り、作成直後、そのworktree内でMakefileの`worktree` targetを確認して`make worktree`を1回実行する。targetが無い、または失敗した場合は実装を始めず報告する。セッション開始時からlinked worktreeにいる場合は、IDEなどの作成者が初期化済みである前提とし、`make worktree`を再実行しない。開発中に`product:env`を暗黙起動してtargetを追加しない。

worktreeの配置・初期化とdev serverの起動方法は対象リポジトリの指示に従い、指定が無ければ`.worktrees/`配下を使う。ただしdev serverの要否を理由にprimary checkoutのブランチへ切り替えない。対象リポジトリがIssue用linked worktreeを禁止している、またはworktreeから受け入れ条件を検証できない場合は、primary checkoutへ逃げず制約を報告して止める。serverの起動方法とlifecycleは[dev-server.md](tools/dev-server.md)に従う。

worktree の add / remove はメインプロセス（指揮者）だけが行う。

### Code

Issue のタスクリストに沿って実装する。タスクを完了したらチェックを入れる。適宜コミットする。

### Verification

変更内容のチェックリストを作成し、実動作を確認する。ブラウザで動く機能は `agent-browser` や実ブラウザ操作で動作確認する。それ以外は実コマンド実行で確認する。

UI差分は実ブラウザで確認する。screenshotは対象リポジトリが許可し、必要な場合だけ[screenshot-upload.md](tools/screenshot-upload.md)を参照する。

全項目パスしてから次に進む。

### Pull Request

push して `gh pr create` で PR を作成する。本文は [gh-templates.md](tools/gh-templates.md) の PR Template（と `.github/PULL_REQUEST_TEMPLATE.md`）に従い、操作は「GitHub 操作の原則」に従う。

## Workflow: 入力なし（提案）

入力なしで呼ばれた場合は backlog 候補の提案に入る。

### 手順

`.docs/index.md` を読み、製品のビジョン、価値軸、戦略的方向性を把握する。

`.docs/backlogs/index.md` を読み、既存バックログを確認する。

`.docs/signals/` 配下のうち、まだ backlogs に登録されていないファイルを全て読む。

各 signal を次の基準で評価する。

ビジョン整合（製品の掲げる目的に資するか）。

価値軸との一致（製品が掲げる価値のどれに資するか）。

戦略方向との適合（現在の優先度、リニューアルテーマ等に合うか）。

構造的問題との関連（既知の構造的課題に対応するか）。

声の数（声が多いほど信号が強い）。

`.docs/index.md` の「やらないこと」に該当する signal は除外する。

候補を推奨度でグループ化して提示する。

Develop（ビジョン整合と戦略適合が高い）。

Investigate（ビジョン整合はあるが要調査）。

Skip（ビジョン外、スコープ外）。

各候補にテーマ名、ビジョン軸、1行の根拠を添える。

ユーザーがどれを進めるか確認する。承認された候補に対して「Workflow: 新規の依頼」の Discuss → Record（backlog）をバッチで実行する。

## Plan の skip 基準

「Workflow: 既存 Issue の続き」の Plan フェーズで、次の場合は計画できない旨を返してユーザーに判断を委ねる。

要件が曖昧で複数の解釈がある。

外部サービスや環境の情報が不足している。

別の Issue に依存している。

技術的な不明点が多くリスクが高い。

`Plan` フェーズの計画作成自体はコードベースを読み [gh-templates.md](tools/gh-templates.md) の Task Template に従ってテキストを組み立てる。GitHub への書き込みは Plan フェーズの最後に1回だけ行う。

## やらないこと

書式の定義は本文に書かない。Issue / PR の Template、必須セクション、Title 規則、Assignment、ブランチ命名、`.github/*_TEMPLATE.md` の優先順位は [gh-templates.md](tools/gh-templates.md) を参照する。signals / backlogs の書式と保存場所は references/docs/ を参照する。

成果物、外向き操作、製品仕様を変える分類を勝手に選ばない。結果が変わらない分類は仮定と理由を示して進める。
