# Inta plugin

製品開発を人間と AI で継続運用するためのプラグイン。Claude や Codex が元から持つ開発能力を置き換えず、人間との合意、組織固有の制約、成果物の置き場所、完了条件を共有する。

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

### 人間が選ぶのは `bootstrap`、`dev`、`check`

製品・リポジトリの初期設計は`inta:bootstrap`、会話しながら行うすべての変更は`inta:dev`、開発から立ち止まって行う定期検診は`inta:check`を入口にする。

通常の機能、bug、仕様変更、明示されたリファクタリング、文書同期、Issue / PRはすべて`dev`が自然文から判断する。`dev/references/request.md` が依頼を signal / backlog / Issue / 直接変更へ分類する正本。Claude の `fable` と Codex は同じ`inta:dev`を利用する。

すべてを独立した Skill へ分割しない。モデルが通常判断できる工程を抽象的な Skill にすると入口が増え、どれを使うべきか曖昧になる。独立させるのは、具体的な手順、専門知識、再利用資産、または通常開発と異なる実行境界を持つ業務だけ。

### どれを使うか

| やりたいこと                         | 入口                            | 既定動作                           |
| ------------------------------------ | ------------------------------- | ---------------------------------- |
| 製品・repositoryを立ち上げる         | `inta:bootstrap [new|adopt]` | 最小architectureとbaselineを作る   |
| 要望、bug、仕様、refactor、PRを進める | `inta:dev`                   | 会話から依頼された地点まで進める   |
| 製品全体を定期検診する               | `inta:check`                 | 全categoryを読み取り専用で検査する |
| 一領域だけ精密に検査する             | `inta:check <category>`      | 指定categoryだけ検査する           |
| 変更差分に必要な検証を行う           | `inta:test changed`          | 差分から必要なtestを選ぶ           |
| 開発環境を確認・適用する             | `inta:env [apply]`           | 引数なしは読み取り専用             |
| 技術選定・移行計画を確認する         | `inta:stack [migration]`     | 読み取り専用で差分とriskを報告     |
| localhostをsecurity検査する          | `inta:security`              | 非破壊の検査と報告                  |
| 文書成果物を作る                     | `inta:docs ...`              | 正本から生成して検品                |
| WordPress / PHPを更新する            | `inta:wordpress ... plan`    | 読み取り専用。変更は`apply`        |

通常は`inta:dev`へ自然文で依頼する。`test`、`docs`、`stack`、`env`、`security`は`bootstrap` / `dev` / `check`が必要時に使う専門能力であり、人間も精度を高めたいときに明示実行できる。`check`は人間が直接呼び出した場合だけ起動し、開発中やAutomationから自動実行しない。

### Agent と Skill を分ける

| 層               | 責務                                                  |
| ---------------- | ----------------------------------------------------- |
| Agent            | モデル、判断主体、実装主体、委譲先、権限、運用の重さ  |
| Skill            | Claude / Codex で共有する業務フロー、成果物、完了条件 |
| リポジトリの指示 | その製品固有のコマンド、技術制約、検証方法            |
| Automation       | 業務をいつ起動するか                                  |
| Task prompt      | 今回の目的、範囲、受け入れ条件                        |

`fable`、`sonnet`、`opus`、`worker`、`hacker` は Claude の動きに特化した薄い Agent として残す。モデル・権限・役割と失うと危険な境界は Agent に置き、反復する実行契約は`agent-runtime`と`security`に置く。

Codex は Claude Agent を再現せず、同じ Skill に書かれた人間との契約を使う。

### 開発とテストは一つの業務

テストは開発後に別担当へ渡す後工程ではなく、実装と同時に進む検証活動。`dev` は変更内容に応じて型検査、lint、unit、ブラウザ動作、DB 適用など必要な検証を選び、結果が揃うまで完了にしない。

差分から検証を選ぶ`changed`と、unit、a11y、visual、diffの詳細な検証能力は`inta:test`に分ける。外から見た開発は一つ、必要な専門知識だけを追加で読む。

製品仕様、Application、テストは安定した仕様IDで追跡する。Applicationは一つの利用者目的につき一つの具象ユースケースクラスとし、作成・更新・削除や承認・却下を一クラスへ統合しない。業務判断はApplication / Domain、HTTP契約はエンドポイントE2E、利用者の完了条件はユーザージャーニーE2E、全ルートの接続はスモークを正本とし、同じ判断を複数層へ重複させない。詳細は`skills/test/references/testing.md`を正本とする。ただし仕様traceは開発完了条件へ自動追加せず、人間が`inta:check`を実行した場合だけ行う。

### 横断点検は人間が起動する

仕様矛盾、architecture、意味的重複、test portfolio、docs drift、runtime、securityの定期検診は`inta:check`に一本化する。引数なしは全categoryを対象全体へ実行し、引数は一categoryだけの精密検査を表す。すべて読み取り専用で、人間のdirect invocationを必須にする。

`inta:dev`は変更に必要なformat / lint / typecheck / testだけを実行する。開発中に全体の重複、依存劣化、不要testを探索しない。`inta:check`のfindingを直す場合は、人間が対象を選び、別の`inta:dev`作業として開始する。

### 変更と定期検診を混ぜない

明示されたリファクタリングや挙動不変の整理は`inta:dev`が変更作業として扱う。ただし通常開発中に全体の改善候補を探したり、見つけた別件へ自動着手したりしない。

`inta:check`は検出と報告まで、`inta:dev`は選択された変更の完了までを担当する。この境界により、検診中の大量修正と開発中の無関係な全体監査を防ぐ。

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
立ち上げ: inta:bootstrap ──→ stack / env / docs / test

Claude: fable / sonnet / opus ─┐
                               ├─ inta:dev ──→ test / docs
Codex ─────────────────────────┘

Claude Agent ──→ inta:agent-runtime ──→ inta:dev
hacker ────────→ inta:security

人間起動の定期検診: inta:check ──→ specs / architecture / duplication / tests / docs / runtime / security
開発環境: inta:env ──→ inta:stack
専門成果物・製品作業: inta:docs / inta:wordpress
Claude 固有の実装・検査: worker / hacker
```

- `skills/bootstrap/`: 新規・既存repositoryの初期architectureと開発baseline
- `skills/dev/`: 製品開発の共通入口、設計規約、`.docs/`、Issue / PR運用
- `skills/test/`: 開発から必要時に呼ぶ具体的な検証能力
- `skills/check/`: 人間が起動する読み取り専用の横断点検
- `skills/env/`: 人間が確認・適用する開発環境
- `skills/stack/`: envが参照する技術stackと導入toolの選択
- `skills/agent-runtime/`: Claude Agent の役割別実行境界。一般的な開発手順はdevへ委ねる
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
