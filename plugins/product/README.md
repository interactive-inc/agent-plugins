# Product plugin

製品開発を人間と AI で継続運用するためのプラグイン。Claude や Codex が元から持つ開発能力を置き換えず、人間との合意、組織固有の制約、成果物の置き場所、完了条件を共有する。

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

productプラグインはprimary checkoutに紐づくブランチを切り替えない。別ブランチで行う作業はlinked worktreeへ隔離し、Issueの実装は必ずIssue用linked worktreeで行う。primary checkoutから`git worktree add -b`でIssueブランチを作ることは許可するが、`git switch`、`git checkout <branch>`、`gh pr checkout`でprimary checkout自体を別ブランチへ移さない。Issueにしない軽微な直接作業は、起動時の現在ブランチを変えない範囲で行ってよい。

リポジトリルートのMakefileは、linked worktreeを準備する冪等な`worktree` targetを持つ。Claude / CodexがIssue用worktreeを作成した場合は作成直後に`make worktree`を1回実行し、IDEなどが作成した既存worktreeから開始した場合は再実行しない。targetは初期化を終えて終了し、dev serverなどの長時間processを起動しない。詳細の正本は`product:env`のworktree referenceとする。

対象リポジトリの指示はプラグイン既定より優先する。特にtest runner、dev server、worktreeの配置・初期化、migration、screenshot、deploymentの規則をSkill側で上書きしない。ただしprimary checkoutのブランチを切り替えない境界は例外としない。対象リポジトリがIssue用linked worktreeを禁止している場合は、primary checkoutへ切り替えて続行せず、実装を止めて制約を報告する。

### 製品開発の入口は `dev`

製品の要望、顧客の声、backlog、Issue、設計、実装、検証、文書更新、PR までの共通入口は `product:dev` に一本化する。

`dev/references/request.md` が、自然文を signal / backlog / Issue に分類し、着手可能な依頼を実装へ進める正本。Claude の `fable` はこのフローを利用し、Codex も同じ `product:dev` Skill を利用する。

すべてを独立した Skill へ分割しない。モデルが通常判断できる工程を抽象的な Skill にすると入口が増え、どれを使うべきか曖昧になる。独立させるのは、具体的な手順、専門知識、再利用資産、または通常開発と異なる実行境界を持つ業務だけ。

### どれを使うか

| やりたいこと                   | 入口                         | 既定動作                         |
| ------------------------------ | ---------------------------- | -------------------------------- |
| 要望、bug、Issue、PRを進める   | `product:dev`                | 依頼されたdelivery地点まで進める |
| 変更差分に必要な検証を行う     | `product:test changed`       | 差分から必要なtestを選ぶ         |
| 日常的な製品点検を人間が始める | `product:check`              | bounded read-only check          |
| 全件監査を人間が始める         | `product:check full`         | full read-only audit             |
| 挙動不変の手入れを人間が始める | `product:maintain ...`       | 指定した一系統だけ変更           |
| 開発環境を人間が確認・適用する | `product:env [apply]`        | 引数なしは読み取り専用           |
| 技術選定・移行計画を確認する   | `product:stack [migration]`  | 読み取り専用で差分とriskを報告   |
| Agent の開発実行境界を適用する | `product:agent-runtime`      | 対応する役割referenceだけを読む  |
| ローカル UI を巡回する         | `product:patrol`             | 実在bugを最大1件だけ起票          |
| localhostをsecurity検査する    | `product:security`           | 非破壊の検査と報告                |
| HTML資料・文書サイトを作る    | `product:docs html`          | 正本から生成して全ページを検品   |
| HTMLをPDF化する                | `product:docs pdf`           | A4 PDFへ変換して全ページを検品   |
| READMEを作成・更新する         | `product:docs readme`        | 実在する構成とcommandから作成     |
| WordPress / PHPを更新する      | `product:wordpress ... plan` | 読み取り専用。変更は`apply`      |

開発依頼で迷ったら`product:dev`へ自然文で依頼する。`check`、`maintain`、`env`は人間が直接呼び出した場合だけ起動し、開発中やAutomationから自動実行しない。

### Agent と Skill を分ける

| 層               | 責務                                                  |
| ---------------- | ----------------------------------------------------- |
| Agent            | モデル、判断主体、実装主体、委譲先、権限、運用の重さ  |
| Skill            | Claude / Codex で共有する業務フロー、成果物、完了条件 |
| リポジトリの指示 | その製品固有のコマンド、技術制約、検証方法            |
| Automation       | 業務をいつ起動するか                                  |
| Task prompt      | 今回の目的、範囲、受け入れ条件                        |

`fable`、`sonnet`、`opus`、`worker`、`loop`、`hacker` は Claude の動きに特化した薄い Agent として残す。モデル・権限・役割の入口だけを Agent に置き、反復する実行契約は `agent-runtime`、`patrol`、`security` に置く。

Codex は Claude Agent を再現せず、同じ Skill に書かれた人間との契約を使う。

### 開発とテストは一つの業務

テストは開発後に別担当へ渡す後工程ではなく、実装と同時に進む検証活動。`dev` は変更内容に応じて型検査、lint、unit、ブラウザ動作、DB 適用など必要な検証を選び、結果が揃うまで完了にしない。

差分から検証を選ぶ`changed`と、unit、a11y、visual、diffの詳細な検証能力は`product:test`に分ける。外から見た開発は一つ、必要な専門知識だけを追加で読む。

製品仕様、Application、テストは安定した仕様IDで追跡する。業務判断はApplication / Domain、HTTP契約はエンドポイントE2E、利用者の完了条件はユーザージャーニーE2E、全ルートの接続はスモークを正本とし、同じ判断を複数層へ重複させない。詳細は`skills/test/references/testing.md`を正本とする。ただし仕様traceは開発完了条件へ自動追加せず、人間が`product:check`を実行した場合だけ行う。

### 横断点検は人間が起動する

仕様trace、docs drift、README、code health、環境baselineの点検は`product:check`に一本化する。既定は変更範囲または上限付き候補、`full`は全件、`trace`などの引数は部分実行を表す。すべて読み取り専用で、人間のdirect invocationを必須にする。

`product:dev`は変更に必要なformat / lint / typecheck / testだけを実行する。`product:test`はその具体的な検証能力を所有し、`product:check`へ戻らない。点検で見つけた挙動不変の手入れは別の`product:maintain`、bug・仕様変更は別の`product:dev`として人間が開始する。

### 点検と保守は別の業務

保守は挙動を変えない改善で、機能開発より広い範囲へ触れやすい。通常開発中に見つけても自動着手せず、人間が`product:maintain`を直接実行した場合だけ一系統を変更する。

`product:check`は検出と報告まで、`product:maintain`は確認済みfindingの修正までに分ける。コードや文書を書き換えるときは対象範囲を確保し、readme / docs / codeの一系統だけを実行する。

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
                               ├─ product:dev ──→ product:test
Codex ─────────────────────────┘

Claude Agent ──→ product:agent-runtime ──→ product:dev
loop ──────────→ product:patrol
hacker ────────→ product:security

人間起動の点検: product:check ──→ product:test / product:env
人間起動の保守: product:maintain ──→ product:check
開発環境: product:env ──→ product:stack
専門成果物・製品作業: product:docs / product:wordpress
Claude 固有の実装・巡回・検査: worker / loop / hacker
```

- `skills/dev/`: 製品開発の共通入口、設計規約、`.docs/`、Issue / PR運用
- `skills/test/`: 開発から必要時に呼ぶ具体的な検証能力
- `skills/check/`: 人間が起動する読み取り専用の横断点検
- `skills/maintain/`: 人間が起動する挙動不変の独立した手入れ
- `skills/env/`: 人間が確認・適用する開発環境
- `skills/stack/`: envが参照する技術stackと導入toolの選択
- `skills/agent-runtime/`: Claude Agent の役割別実行境界。一般的な開発手順はdevへ委ねる
- `skills/patrol/`: loop Agent のlocalhost UI巡回とbug起票
- `skills/security/`: hacker Agent のlocalhostセキュリティ検査
- `skills/docs/`: HTML / PDF / READMEなど、人間向け文書成果物の生成と検品。`.docs`自体の仕様管理はdevが担う
- `skills/wordpress/`: WordPress / PHP更新に閉じた専門業務
- `agents/`: Claude 固有の役割、モデル、委譲、権限

## 正本

- この `README.md`: 人間と AI が共有する設計思想
- `skills/dev/references/request.md`: 製品依頼の振り分けと開発フロー
- `skills/`: 具体的な業務フローと専門知識
- `agents/`: Claude 固有の役割分担とモデル設定

同じ規則を複数箇所へコピーしない。責務や境界を変えるときはこの README を更新し、実装を合わせる。
