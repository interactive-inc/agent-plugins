# inta — 社外にも公開する開発支援

社内外の製品開発者が使う、開発・設計・検証・保守の手順です。会社専用の認証や社内資料を前提にしません。

対話から目的・規模・期限・運用を理解し、全体を見て必要な部分を作り、試験で得た発見を全体へ戻します。関係する `.docs/`・`AGENTS.md` は追記だけでなく整理し、次の開発に必要な理解を短く保ちます。

標準の道具は `vp`、新規のWeb製品の基盤は `void`。依存の導入・追加は `vp install` を入口にし、配置と文書の書式は共通規約へそろえます。既存製品の移行は今回の目的と範囲を決めてから行います。

## コマンド一覧

現在は11個のスキルがあります。以下は Claude Code の呼び出し表記です。Codex では対応するスキルを指定し、同じ引数や自然文の依頼を渡します。

| コマンド | 用途 | 引数なしの動き |
| --- | --- | --- |
| [/inta:dev](skills/dev/SKILL.md) | 機能追加・不具合修正を、対話から実装・試験・記録まで進める | 現状を読み、次の候補を対話する |
| [/inta:refactor](skills/refactor/SKILL.md) | 好み・命名・配置・責務を全適用規約へそろえる | 製品の手書きコード全体を確認・修正・再検証 |
| [/inta:test](skills/test/SKILL.md) | 差分・API・アクセシビリティ・画面・性能を検証する | 差分から必要な検証を選ぶ |
| [/inta:check](skills/check/SKILL.md) | コード・文書・仕様接続・環境を読み取り専用で点検する | 現在の変更と直接影響する範囲を点検 |
| [/inta:maintain](skills/maintain/SKILL.md) | 文書やコードを、挙動を保って整理する | 自然文から対象が分かれば進め、不明なら確認 |
| [/inta:perf](skills/perf/SKILL.md) | 性能の問題を根拠で確かめ、振る舞いを保って改善する | 統計や共通経路から影響の大きい候補を選ぶ |
| [/inta:stack](skills/stack/SKILL.md) | vp・Void・標準配置、技術選定と移行方針を扱う | 目的と既存構成を確認する |
| [/inta:env](skills/env/SKILL.md) | 開発環境を点検・整備する | 読み取り専用で点検 |
| [/inta:docs](skills/docs/SKILL.md) | 正本から HTML・PDF・README を作る | 成果物と正本を依頼から特定し、不明なら確認 |
| [/inta:wordpress](skills/wordpress/SKILL.md) | WordPress・PHP の更新を調査・実施する | 読み取り専用の計画 |
| [/inta:orca](skills/orca/SKILL.md) | 明示された Issue の実装を Orca の作業場所へ引き渡す | 対象 Issue と依頼範囲を確認する |

`check`・`refactor`・`maintain`・`env` は人が明示して起動します。通常の開発に必要な試験・文書整理・規約への適合は `dev` に含まれ、毎回これらを別工程として呼ぶ必要はありません。

## サブコマンドと引数

`<対象>` にはパス・URL・Issue 番号など、そのコマンドに合う対象を渡します。引数はスキルへの指示であり、シェルで実行する CLI コマンドではありません。

| 入力例 | 動き |
| --- | --- |
| `dev <自然文・Issue・PR>` | 依頼・既存記録の続きを開発する |
| `dev next [対象]` | 次に取り組む候補を提案。`--all` で全体探索、`--write` で確定候補を既存の記録先へ追記 |
| `dev review [対象]` | PR・差分・パスを読み取り専用でレビュー |
| `dev ci [PR・run URL・ID]` | CI の失敗を読み取り専用で診断 |
| `dev pr-chain [inspect・merge] <PR...>` | 関連 PR の依存と順序を確認。既定は点検、`merge` を明示したときだけマージ |
| `refactor [パス・changed] [--check]` | 全体・指定パス・現在の差分を規約へ適合。`--check` は点検だけ |
| `test changed・unit・api・a11y・visual・diff・perf` | 差分／振る舞い／API 契約／アクセシビリティ／実表示／2ソース比較／画面性能のいずれかを検証 |
| `check changed・full・code・docs・readme・env [対象]` | 現在の変更／全体／指定領域を読み取り専用で点検 |
| `check trace [changed・仕様ID・パス・unbound・all]` | 仕様・実装・試験の接続を点検。`unbound --limit N` で未接続候補を限定 |
| `maintain docs・readme [対象]` | 既存文書を整理。`maintain code` は `refactor` と同じ規約を使う |
| `perf [パス・画面・API・diff]` | 指定範囲の性能を調査・改善 |
| `stack migration [package current target]` | 基盤・依存の移行を計画する |
| `env apply` / `env skills` | 指定した環境変更を適用／技術構成に必要なスキルを導入 |
| `docs html・pdf・readme <正本・依頼>` | 指定形式の文書を生成・更新し、検品 |
| `wordpress upgrade・php-upgrade [plan・apply]` | WordPress／PHP を更新。`plan` は調査、`apply` は明示範囲の変更 |
| `orca #番号` / `orca fanout #番号...` | 単一／複数 Issue を作業場所へ引き渡す |

表の「・」で並べた入力は選択肢です。例えば `test unit`、`docs readme` のように一つ選びます。外部への送信・push・PR・本番反映は、依頼された範囲で行います。

## 使い分けの例

```text
/inta:dev 顧客検索に絞り込みを追加して
/inta:check code pages/
/inta:refactor pages/ --check
/inta:refactor pages/
/inta:test changed
/inta:docs readme
```

問題を見つけるだけなら `check`、コードを好み・構造の規約へそろえるなら `refactor`、既存文書の整理なら `maintain`、文書の新規作成や成果物生成なら `docs` を使います。`perf` は原因を調べて改善する入口、`test perf` は同条件で画面性能を測る入口です。

## 好みと方法論

[preferences](skills/dev/references/preferences/index.md) は、表記や選択の違いによる不要な差分をなくすための統一です。[構造の方法論](skills/dev/references/code/structure.md) は、分割・責務・試験のしやすさを定めます。意図と正本を分け、開発でも refactor でも同じ規約を使います。

## 開発文書

[docs](skills/docs/SKILL.md) は製品の正本からHTML・PDF・READMEを作成します。対象製品の書式を優先し、会社共通の見た目には依存しません。仕様や設計判断の管理は `dev` が担当します。

提案資料、社内の説明資料、試作画面・動画、会社共通の見た目は収録しません。

## 補助担当

Claude Code 向けには `fable`・`opus`・`sonnet`・`worker`・`hacker`・`loop` を収録しています。各担当の定義は [agents](agents/) にあります。Codex は共通の手順を直接利用します。

## 適用範囲

社内外で同じ開発手順を使います。製品固有の手順は対象リポジトリの指示へ残し、会社専用の資料・業務システムを共通手順の依存条件にしません。

## 導入

公開配布元を登録して `inta` を導入します。

```text
/plugin marketplace add interactive-inc/agent-plugins
/plugin install inta@inta-agent-plugins
```

Codex では次を使います。

```sh
codex plugin marketplace add interactive-inc/agent-plugins
codex plugin add inta@inta-agent-plugins
```

別の配布元へ登録されている場合は、導入時の配布元名へ置き換えてください。共通の手順は同じです。

Claude Code・Codexと、Agent Plugins形式の定義を収録しています。呼び出し制御などのクライアント固有の設定は、対応するクライアントで適用します。
