# Inta plugin

製品開発を人間と AI で継続運用するためのプラグイン。Claude や Codex が元から持つ開発能力を置き換えず、人間との合意、成果物の置き場所、完了条件を共有する。

## 対応形式

`skills/` はAgent Skills準拠の共通正本であり、Agent Plugins v1、Claude Code、OpenAI / Codexから同じ内容を利用する。配布形式の差は3つの薄いmanifestへ閉じ込める。

| 形式 | Manifest | 固有要素 |
| --- | --- | --- |
| Agent Plugins v1 | `plugin.json` | 可搬な `skills/` |
| Claude Code | `.claude-plugin/plugin.json` | `agents/` の軽量Agent |
| OpenAI / Codex | `.codex-plugin/plugin.json` | 各Skillの `agents/openai.yaml` |

共通SkillへClaude固有のfrontmatterを混ぜず、クライアント固有要素を別クライアントの実行条件にしない。

## 設計思想

### 統一するのは人間との契約

Claude と Codex は、コードの探索、設計、実装、テスト、レビューを依頼とリポジトリに応じて組み立てられる。一般的な開発方法やモデル内部の思考手順を Skill で固定しない。

Skill にするのは、人間との協調に必要な規則。

- 何を入口にし、どの状態を完了とするか
- どの判断を AI に任せ、どの判断を人間へ返すか
- Issue、PR、`.docs/` などの成果物をどこへ残すか
- 誰が作業範囲を持ち、いつ他の作業と並行できるか
- 完了をどの検証結果で証明するか

### 安全な既定動作

Skillを呼んだだけで、書き込み、package追加、Issue起票、push、merge、画像uploadへ権限を広げない。新規workspace / package、独立した配布物・version、公開APIも構成拡張として扱い、ユーザーが今回の依頼でその構成を明示した場合だけ作る。「再利用可能」「ライブラリ化」だけから配布予定を推測しない。`check`、preview、scan、auditは読み取り専用を既定にし、変更は`apply` / `write`または自然文の明示依頼で許可する。

intaプラグインはprimary checkoutに紐づくブランチを切り替えない。別ブランチで行う作業はlinked worktreeへ隔離し、Issueの実装は必ずIssue用linked worktreeで行う。primary checkoutから`git worktree add -b`でIssueブランチを作ることは許可するが、`git switch`、`git checkout <branch>`、`gh pr checkout`でprimary checkout自体を別ブランチへ移さない。Issueにしない軽微な直接作業は、起動時の現在ブランチを変えない範囲で行ってよい。

リポジトリルートのMakefileは、linked worktreeを準備する冪等な`worktree` targetを持つ。Claude / CodexがIssue用worktreeを作成した場合は作成直後に`make worktree`を1回実行し、IDEなどが作成した既存worktreeから開始した場合は再実行しない。targetは初期化を終えて終了し、dev serverなどの長時間processを起動しない。詳細の正本は`inta:env`のworktree referenceとする。

対象リポジトリの指示はプラグイン既定より優先する。特にtest runner、dev server、worktreeの配置・初期化、migration、screenshot、deploymentの規則をSkill側で上書きしない。ただしprimary checkoutのブランチを切り替えない境界は例外としない。対象リポジトリがIssue用linked worktreeを禁止している場合は、primary checkoutへ切り替えて続行せず、実装を止めて制約を報告する。

### 製品開発の入口は `dev`

製品の要望、顧客の声、backlog、Issue、設計、実装、検証、文書更新、PR までの共通入口は `inta:dev` に一本化する。

`dev/references/request.md` が、自然文を signal / backlog / Issue に分類し、着手可能な依頼を実装へ進める正本。Claude の `fable` はこのフローを利用し、Codex も同じ `inta:dev` Skill を利用する。

すべてを独立した Skill へ分割しない。モデルが通常判断できる工程を抽象的な Skill にすると入口が増え、どれを使うべきか曖昧になる。独立させるのは、具体的な手順、専門知識、再利用資産、または通常開発と異なる実行境界を持つ業務だけ。

### どれを使うか

- 製品・repositoryを立ち上げる → `inta:bootstrap [new|adopt]`。既定動作は最小architectureと開発baselineを作る
- 要望、bug、Issue、PRを進める → `inta:dev`。既定動作は依頼されたdelivery地点まで進める
- 変更差分に必要な検証を行う → `inta:test changed`。既定動作は差分から必要なtestを選ぶ
- 日常的な製品点検を人間が始める → `inta:check`。既定動作はbounded read-only check
- 全件監査を人間が始める → `inta:check full`。既定動作はfull read-only audit
- 挙動不変の手入れを人間が始める → `inta:maintain ...`。既定動作は指定した一系統だけ変更
- 開発環境を人間が確認・適用する → `inta:env [apply]`。既定動作は引数なしは読み取り専用
- 技術選定・移行計画を確認する → `inta:stack [migration]`。既定動作は読み取り専用で差分とriskを報告
- HTML資料・文書サイトを作る → `inta:docs html`。既定動作は正本から生成して全ページを検品
- HTMLをPDF化する → `inta:docs pdf`。既定動作はA4 PDFへ変換して全ページを検品
- READMEを作成・更新する → `inta:docs readme`。既定動作は実在する構成とcommandから作成
- 視覚成果物のデザインを適用・点検する → `inta:design`。既定動作は共通DESIGN.mdへ揃える
- WordPress / PHPを更新する → `inta:wordpress ... plan`。既定動作は読み取り専用。変更は`apply`
- localhostをsecurity検査する → `inta:security`。既定動作は非破壊の検査と報告
- Orca管理worktreeへIssueを渡す → `inta:orca [fanout]`。既定動作は委託して終了し、監視しない

開発依頼で迷ったら`inta:dev`へ自然文で依頼する。`check`、`maintain`、`env`は人間が直接呼び出した場合だけ起動し、開発中やAutomationから自動実行しない。

### Agent と Skill を分ける

- Agent: モデル、判断主体、実装主体、委譲先、権限、運用の重さ
- Skill: Claude / Codex で共有する業務フロー、成果物、完了条件
- リポジトリの指示: その製品固有のコマンド、技術制約、検証方法
- Automation: 業務をいつ起動するか
- Task prompt: 今回の目的、範囲、受け入れ条件

`fable`、`sonnet`、`opus`、`worker`、`hacker` は Claude の動きに特化した Agent として残す。Agent 本文はモデル・権限・委譲先・失うと危険な境界だけを持つ60行以内の軽量な定義にし、役割ごとの実行契約は`inta:agent-runtime`、security検査の手順は`inta:security`に置く。これらを`inta:dev`など共通の業務Skillへ混ぜない。

Codex は Claude Agent を再現せず、同じ Skill に書かれた人間との契約を使う。

### 開発とテストは一つの業務

テストは開発後に別担当へ渡す後工程ではなく、実装と同時に進む検証活動。`dev` は変更内容に応じて型検査、lint、unit、ブラウザ動作、DB 適用など必要な検証を選び、結果が揃うまで完了にしない。

差分から検証を選ぶ`changed`と、unit、a11y、visual、diffの詳細な検証能力は`inta:test`に分ける。外から見た開発は一つ、必要な専門知識だけを追加で読む。

製品仕様、Application、テストは安定した仕様IDで追跡する。Applicationは一つの利用者目的につき一つの具象ユースケースクラスとし、作成・更新・削除や承認・却下を一クラスへ統合しない。業務判断はApplication / Domain、HTTP契約はエンドポイントE2E、利用者の完了条件はユーザージャーニーE2E、全ルートの接続はスモークを正本とし、同じ判断を複数層へ重複させない。詳細は`skills/test/references/testing.md`を正本とする。ただし仕様traceは開発完了条件へ自動追加せず、人間が`inta:check`を実行した場合だけ行う。

### 横断点検は人間が起動する

仕様trace、docs drift、README、code health、環境baselineの点検は`inta:check`に一本化する。既定は変更範囲または上限付き候補、`full`は全件、`trace`などの引数は部分実行を表す。すべて読み取り専用で、人間のdirect invocationを必須にする。

`inta:dev`は変更に必要なformat / lint / typecheck / testだけを実行する。`inta:test`はその具体的な検証能力を所有し、`inta:check`へ戻らない。点検で見つけた挙動不変の手入れは別の`inta:maintain`、bug・仕様変更は別の`inta:dev`として人間が開始する。

### 点検と保守は別の業務

保守は挙動を変えない改善で、機能開発より広い範囲へ触れやすい。通常開発中に見つけても自動着手せず、人間が`inta:maintain`を直接実行した場合だけ一系統を変更する。

`inta:check`は検出と報告まで、`inta:maintain`は確認済みfindingの修正までに分ける。コードや文書を書き換えるときは対象範囲を確保し、readme / docs / codeの一系統だけを実行する。

### 同時実行は範囲で制御する

worktree はファイルを隔離するが、複数セッションが同じ設計を別方向へ変更することまでは防げない。

- 読み取り専用の調査は並行してよい
- primary checkoutのブランチは切り替えず、Issueごとのブランチと変更はlinked worktreeへ隔離する
- 書き込み前に担当 Issue、ブランチ、対象パスを明確にする
- セッション開始時からlinked worktreeにいる場合は現在地を使い、追加worktreeを作らない
- 一つのメインプロセスはIssueを1件ずつdelivery地点まで進め、後続Issueのworktreeを先に作らない
- 同じ機能、共通基盤、横断的な設計に触る作業は並行しない
- 一つの案件内では、影響しないサブタスクだけを並列化する
- リポジトリ全体のリファクタリングは排他的に扱う
- 作業中に見つけた別件は、その場で直さず記録して後続作業へ回す

## 現在の構成

```text
Claude: fable / sonnet / opus ─┐
                               ├─ inta:dev ──→ inta:test
Codex ─────────────────────────┘

人間起動の点検: inta:check ──→ inta:test / inta:env
人間起動の保守: inta:maintain ──→ inta:check
開発環境: inta:env ──→ inta:stack
立ち上げ: inta:bootstrap ──→ inta:stack / inta:env / inta:docs / inta:test
共通デザイン: inta:docs ──→ inta:design ──→ DESIGN.md
専門成果物・製品作業: inta:docs / inta:wordpress / inta:orca
Claude 固有の役割差: inta:agent-runtime（fable / sonnet / opus / worker）
security検査: hacker ──→ inta:security
```

- `skills/bootstrap/`: 新規・既存リポジトリの初期設計と開発baseline
- `skills/dev/`: 製品開発の共通入口、設計規約、`.docs/`、Issue / PR運用
- `skills/test/`: 開発から必要時に呼ぶ具体的な検証能力
- `skills/check/`: 人間が起動する読み取り専用の横断点検
- `skills/maintain/`: 人間が起動する挙動不変の独立した手入れ
- `skills/env/`: 人間が確認・適用する開発環境
- `skills/stack/`: envが参照する技術stackと導入toolの選択
- `skills/docs/`: HTML / PDF / READMEなど、人間向け文書成果物の生成と検品。`.docs`自体の仕様管理はdevが担う
- `skills/design/`: HTML、PDF、スライド、図解、UIモックへ共通デザインを適用・点検する入口
- `skills/wordpress/`: WordPress / PHP更新に閉じた専門業務
- `skills/orca/`: Orca管理worktreeへのIssue実装のfull handoffと`fanout`一括展開
- `skills/security/`: 許可されたlocalhost開発環境のsecurity検査
- `skills/agent-runtime/`: Claude Code Agentごとの実行契約
- `agents/`: Claude 固有の役割、モデル、委譲、権限

同じ規則を複数箇所へコピーしない。責務や境界を変えるときはこの設計思想を更新し、実装を合わせる。

## 設計思想を更新するとき

Agent / Skill / リポジトリ指示 / Automation の責務、人間へ判断を返す境界、標準開発フロー、同時実行の原則を変える場合は、同じ変更の中でこのファイルの設計思想を更新する。

Claude と Codex で共通の業務フローを分けない。製品差・モデル差・実行環境差は、個別 Agent の設定か対象技術の reference に閉じ込める。

HTML、PDF、スライド、図解、UIモックなどの視覚成果物を作成・編集するときは、作業前に [DESIGN.md](skills/design/DESIGN.md) を全文読み、ユーザーまたは対象リポジトリが明示していない判断へ必ず適用する。

新しいルールを加える前に、次を確認する。

- 人間との協調、安全、成果物、完了条件のために必要か
- 対象リポジトリの情報から AI が自分で判断できないことか
- 既存の正本と重複していないか
- 全案件に共通しないなら、専門 Skill や reference に分けられないか
- モデルの探索順序、思考手順、ツール選択を不必要に固定していないか

一般的な開発方法を教え直すルールは追加しない。Claude / Codex が依頼とリポジトリに合わせて決められる部分は任せ、必須の受け渡し点と禁止境界だけを書く。

## Skillの名前空間と依存方向

公開入口は利用者の目的で命名し、実装工程や一度きりの状態を名前にしない。

- `dev`: feature / bug / Issue / PRの開発とdelivery。変更範囲に必要な検証だけを`test`へ依頼する
- `test`: unit / a11y / visual / diffなど、開発差分を検証するleaf能力。上位Skillへ戻らない
- `check`: 人間が直接起動する読み取り専用の横断点検。引数なしはbounded、`full`は全件、その他は部分点検
- `maintain`: 人間が直接起動する挙動不変の手入れ。必要なら同じscopeの`check`結果を使う
- `env`: 人間が直接起動する開発環境の確認・適用。技術選定は`stack`を参照する
- `stack`: project shape、tool選定、framework / package移行計画。既定は読み取り専用で、実行Skillを呼び戻さない
- `docs`: HTML / PDF / READMEなど人間向け文書成果物の生成と検品。`.docs`自体の仕様管理を重複して持たない
- `design`: HTML、PDF、スライド、図解、UIモックへ適用する共通視覚規則。`DESIGN.md`を正本にし、形式固有の生成手順を持たない
- `wordpress`: WordPress / PHP更新に閉じた専門業務
- `bootstrap`: 製品・repositoryの立ち上げ。必要な能力だけ`stack` / `env` / `docs` / `test`から使い、以後の開発は`dev`へ渡す
- `security`: 許可されたlocalhost開発環境だけを対象にした非破壊のsecurity検査
- `agent-runtime`: Claude Code Agentの役割差だけを持つ。一般的な開発手順は`dev`に委ねる
- `orca`: Orca管理worktreeへのIssue実装のfull handoffと`fanout`一括展開。対象は`dev`の運用で起票済みのIssueで、委託後は監視しない

依存方向は次に固定する。

```text
dev ──→ test

check ──→ test
  └────→ env ──→ stack

maintain ──→ check

docs ─────→ design

bootstrap ──→ stack / env / docs / test
agent-runtime ──→ dev
```

`dev` / `test`から`check` / `maintain` / `env`を起動しない。`check` / `maintain` / `env`は`agents/openai.yaml`に`allow_implicit_invocation: false`を持たせ、descriptionで自動起動しないことを明示する。共通Skillのfrontmatterには Agent Skills 仕様のフィールドだけを使う。`check`と`maintain`のtop-level実行、および`env apply` / `env skills`はdirect user invocationだけを起動条件にする。人間が起動した`check`は`env`の読み取り専用checklistを内部利用してよい。Automationからは暗黙起動しない。

検査手順を`dev`へ置かず`check`へ、挙動不変の修正手順を`maintain`へ、環境適用とSkill追加を`env`へ置く。別Skillの詳細手順を複製せず一方向に参照し、相互参照が必要になった場合は責務の置き場所が誤っているものとして再設計する。

## 現在のエージェント設計

メインセッションのエージェントは 3 種類あり、判断の所在・実装の担い方・運用の重さで分かれる。

- fable: 最も判断力の高いモデルを主役に置き、設計判断・計画・受け入れ判定を自分で下す。コードを書く作業は自分では持たず、スコープの小さい実装は codex に直接、広範囲のファイルを触る実装は worker に委託する。advisor に依存しない。GitHub / Issue / PR / worktree の運用を敷くチーム開発向け。
- sonnet: 安くて速いモデルで、基本的に自分の手で実装する。難しい実装（影響範囲が広い・全体把握が要る・コンテキストを大きく消費する）だけを worker に委託する。設計判断・計画・受け入れ判定は advisor に外出しする。GitHub / Sentry / Issue / PR / worktree の運用を敷かず、起動時の現在ブランチとコミットで完結する軽量運用。ドキュメントも管理台帳を持たない。
- opus: 判断力・実装力ともに高いモデル。設計判断・計画・受け入れ判定を自分で下し（fable 側）、基本は自分で実装する（sonnet 側）。codex が使える環境ではスコープの確定した小さな実装を codex に渡し、難しい実装だけを worker に委託する。advisor には依存しない。GitHub / Sentry / Issue / PR / worktree の運用を敷かず、起動時の現在ブランチとコミットで完結する軽量運用（sonnet と同じ運用の重さ）。止まる条件を明示して自走させ、破壊的操作の歯止めは permissionMode の auto に残す。

sonnet モデル自体の実装力は高くない。判断を advisor に外出ししても実装で詰まりやすいため、運用は極力軽くする。GitHub / worktree の管理コストまで背負わせない。それが必要な規模の開発は fable に任せる。

共通の原則は 2 つ。メインセッションのコンテキストには判断とレビューに必要な情報だけを入れること、自分でなくてもできる仕事は責務に合ったサブエージェントに流すこと。

## モデル選定の方針

frontmatter の値を変えるときはこの方針に沿っているかを確認する。

- sonnet は「賢さ」より「速さと安さ」で選ぶ。判断を advisor に外出ししている以上、強いモデルにする理由はない。実装力は必要なので、実装のできる中で軽いモデルを選ぶ。
- advisor は使える中で最も判断力の高いモデルにする（既定は Fable、使えないときは `/advisor opus` で Opus 系の最新版に切り替え）。判断力の欠如を補う唯一の場所なので、ここをケチらない。
- fable は判断の主役なので、使える中で最も判断力の高いモデルにする。
- opus は自分で実装して自分で受け入れる主役なので、実装力の最も高い Opus 系を使う。effort は 1 ターンが長くなっても実装と判断の質を取る側に振る。
- worker は実装力とコンテキストの大きさで選ぶ。大きな差分やコードベース全体の把握が要る作業を一括で受けるため、長コンテキスト（1M）で動くモデルを使う。
- frontmatter の model はエイリアス（`fable` / `opus` / `sonnet`）で書き、完全な ID や `[1m]` を付けない。エイリアスは Claude Code がプロバイダの推奨版へ更新するので、メインでもサブエージェントでも各系統の最新版が起動し、モデルが上がっても定義を書き換えずに済む。Anthropic API では Opus 4.7 以降と Sonnet 5 が常に 1M context で動くため `[1m]` は要らない。解決先は Claude Code の版で決まるので v2.1.280 以上を前提にする（未満では `opus` が旧版を指す）。
- Opus 系を使うエージェント定義には `effort` を必ず明示する。サブエージェントは effort を指定しないと親セッションの値を継承し、そのモデルが受け付けない値だと起動自体が API 400 で落ちる（2026-07-25 に worker で実際に発生。エラーに気づかず sonnet に迂回すると、opus に委託しているつもりで全部 sonnet が実装していることになる）。effort の既定値と、同じ段階名で考える量はモデルごとに違う。モデルを変えたとき、エイリアスの解決先が新しいモデルに移ったときは、前の値を持ち越さず明示して選び直す。

## 起動形態

fable / sonnet / opus は `claude --agent inta:{name}` で起動され、メインプロセスになる。サブエージェントではない。チーム開発なら fable、個人開発や軽量運用なら sonnet / opus を選ぶ。loop はループから直接起動される独立ワーカーで、メインセッションからは呼ばない。

Codex は Claude 向け Agent 定義を使わず、共通の開発フローを `inta:dev`、専門業務を対応する Skill から利用する。Agent の差を Skill 側へ持ち込まない。

## 開発フロー

intaプラグインはprimary checkoutに紐づくブランチを切り替えない。別ブランチが必要な作業はlinked worktreeへ隔離する。この境界はdev serverの都合では緩めず、対象リポジトリがlinked worktreeを禁止している場合は停止して制約を報告する。

fable の開発は Worktree・Issue・プルリクを使う。primary checkoutからIssueに取り組むときは`.worktrees/`配下にIssue用linked worktreeを作り、自分で作った直後だけその中で`make worktree`を実行する。セッション開始時からlinked worktreeにいる場合は現在地を使い、追加worktreeの作成と`make worktree`の再実行を禁止する。worktree の add / remove はメインプロセスだけが行う。Issue 起票・push・PR 作成など gh と git の外向き操作もメインプロセスが行う。依頼の振り分け・Issue / PR の書式・実装フェーズの手順は dev スキル（references/request.md, references/tools/）が正本。

sonnet / opus は Issue / PR / worktree を使わず、起動時の現在ブランチを作成・切り替えずにコミットで完結する。案件の記録先は `.docs/notes/`。

worker は実装専任で、worktree / ブランチの作成・切り替え / Issue / PR / gh には一切関わらず、コミットで止まる。呼び出し元がどのエージェントでも変わらない。

## 変更時の禁止事項

- `fable` / `sonnet` / `opus` / `worker` / `hacker` は Claude の動きに特化した役割。メンテナーの明示指示なしに削除、改名、他の Agent への統合をしない。
- dev と同じ依頼振り分け、設計規約、開発フローを持つ上位ルーターを追加しない。具体的な専門業務だけを独立 Skill にする。
- check / maintain / envはdirect user invocation専用とし、Agent、dev、test、Automationから暗黙起動する記述を追加しない。
- sonnet に設計判断・計画・受け入れ判定を自分で下させる記述を足さない。判断は advisor という向きを崩さない（fable は判断を自分で下すのが正で、この制約は適用しない）。
- fable に実装を抱え込ませる記述を足さない。実装は codex（小さなスコープ）か worker（広いスコープ）という向きを崩さない（sonnet は自分で実装するのが正で、この制約は適用しない）。
- sonnet に advisor が使えないまま単独で判断を進める逃げ道を作らない。モデル切替を提案して止まるのが正。
- sonnet に GitHub / Sentry / Issue / PR / worktree の運用・判断を足さない。それが必要な規模なら fable を使うのが正。
- primary checkoutのブランチ切り替えを許可する例外を足さない。UI検証、dev server、既存PRの取得も例外にしない。
- メインセッションのコンテキストを重くする方向の変更（大出力の取り込み、全ファイル読みの要求）を足さない。
- サブエージェント → サブエージェントの委譲を導入しない。委譲はメインプロセス → サブエージェントの一方向のみ。
