# inta — 社外にも公開する開発支援

社内外の製品開発者が使う、開発・設計・検証・保守の手順です。会社専用の認証や社内資料を前提にしません。

対話から目的・規模・期限・運用を理解し、全体を見て必要な部分を作り、試験で得た発見を全体へ戻します。関係する `.docs/`・`AGENTS.md` は追記だけでなく整理し、次の開発に必要な理解を短く保ちます。

標準の道具は `vp`、新規のWeb製品の基盤は `void`。依存の導入・追加は `vp install` を入口にし、配置と文書の書式は共通規約へそろえます。既存製品の移行は今回の目的と範囲を決めてから行います。

## 人が使う6つの入口

| コマンド | 頼みたいこと | 変更するか |
| --- | --- | --- |
| [/inta:dev](skills/dev/SKILL.md) | 作りたい・直したい・相談したい | 合意した範囲を実装し、試験と記録まで進める |
| [/inta:debug](skills/debug/SKILL.md) | バグ探索・再現確認・Issue 整理を継続して回したい | 既定はコード・テスト・画面操作の full。`code` は静的調査のみ。修正計画と見積もりを Issue に残す |
| [/inta:review](skills/review/SKILL.md) | 既存のレビュアーに変更を見てほしい | 既存レビュー・レーン判定・マージ方針設定。通常のレビューは読み取り専用 |
| [/inta:check](skills/check/SKILL.md) | 問題や抜けがないか見てほしい | 読み取り専用。問題と根拠を報告 |
| [/inta:refactor](skills/refactor/SKILL.md) | 動作を変えず、書き方と構造をそろえてほしい | 全適用規約を確認・修正・再検証 |
| [/inta:test](skills/test/SKILL.md) | ちゃんと動くか確かめてほしい | 検証だけの依頼では製品コードを変更しない |

`dev` が日常の入口です。通常の開発にも規約への適合・試験・文書整理が含まれ、6つを毎回順番に呼ぶ必要はありません。`debug` は探索・再現確認・Issue の計画整理を継続する入口です。`review` は Claude Code の組み込み `code-review`、Codex の標準 `review` を呼びます。`check` と `refactor` は人が明示して起動する独立した点検・整理です。

## そのまま頼む例

```text
/inta:dev 顧客検索に絞り込みを追加したい
/inta:dev この API が遅いので調べて改善して
/inta:dev WordPress と PHP の更新計画を立てて
/inta:dev README を今の実装に合わせて
/inta:debug 認証まわりをGoalで並行探索し、Issueを整理して
/inta:debug code 認証まわりのコードを読んでバグを探して
/inta:debug この領域のIssueを結合・分解し、修正方針と見積もりを整えて
/inta:dev #123 を修正してPRまで
/inta:review
/inta:review このPRのレーンを判定して
/inta:review PRレーンを設定したい
/inta:dev PR レーンを設定して、通常はレビューなしでマージしたい
/inta:check この変更で問題が起きないか見て
/inta:refactor pages/
/inta:test 変更した検索画面を確認して
```

専門分野のコマンド名を覚える必要はありません。AI は [専門ガイド](skills/dev/references/guides/index.md) から、基盤・環境・性能・WordPress・作業の引き渡しなど必要な手順を選びます。ガイドを読むだけで、インストール・外部送信・本番反映の許可が増えることはありません。

## 覚えておくと便利な指定

| 入力 | 動き |
| --- | --- |
| `dev next` | 次に取り組む候補を提案。`--all` で全体探索、`--write` で既存の記録先へ追記 |
| `debug [対象]`・`debug full [対象]` | コード調査・関連テストの実行・画面操作でバグを探し、Issue を計画・整理 |
| `debug code [対象]` | 静的なコード調査と Issue 整理。テスト・ビルド・ブラウザ・開発サーバーは起動しない |
| `review <PR・パス>`・`dev review <対象>` | 既存レビューとレーン判定。読み取り専用 |
| `dev ci <PR・run>` | CI の失敗を診断 |
| `dev pr-chain <PR...>` | 関連 PR の依存とマージ順を確認。マージは明示依頼時だけ |
| `check full` | 製品全体を読み取り専用で点検 |
| `check code・docs・readme・env <対象>` | コード・文書・入口・環境のいずれかを点検 |
| `check trace <仕様ID・パス>` | 仕様・実装・試験の接続を点検 |
| `refactor [パス・changed] [--check]` | 指定なしは製品全体、`changed` は差分。`--check` は規約の点検だけ |
| `test changed・unit・api・a11y・visual・diff・perf` | 差分・単体・API・アクセシビリティ・実表示・見た目比較・性能のいずれかを検証 |

表の「・」は選択肢です。例えば `/inta:test unit` のように一つ選びます。これらはシェルの CLI ではなく、スキルへ渡す依頼の指定です。

## PR を届ける

Issue は問題の根拠・修正方針・影響範囲・重要度と優先度・工数の見積もり・完了条件を残す計画です。PR は実際の差分と検証でその計画をどう満たしたかを示します。Issue の結合・分解では固有の条件と履歴を残し、親子・依存・集約先を辿れるようにします。書式と属性は [Issue・PR の規約](skills/dev/references/tools/issue-pr.md) に従います。

`debug` で並列作業を頼むと、利用可能な枠で探索・再現確認・計画整理を分担し、同じ Issue の更新を調整します。Goal による継続を頼んだ場合は、対応する環境で現在のセッションの Goal を利用します。Goal や並列機能がない環境でも、同じ範囲を逐次処理できます。到達点は Issue の計画整理まで。修正と PR 作成は `/inta:dev #123 を修正してPRまで` のように別に依頼します。セッション外の常駐・無期限実行は設定しません。

[PR レーン](skills/review/references/pr-lanes.md) は **通常・共有・要確認** の3つ。製品に合意済みの方針があれば、通常は検査成功後に人のレビューを待たずマージします。共有レーンはメンバーへ伝えたい論点を PR に残し、承認を待ちません。DB 変更、事業上危険な操作、専門的な判断が必要な変更は要確認へ回し、その判断だけを人に求めます。Issue・PR の種別・領域ラベルも引き続き必須です。

`review` または `dev` に「PR レーンを設定して」と伝えると、製品固有の条件と許可を設定します。設定は `.docs/pull-requests.md` など既存の正本へ残し、`AGENTS.md` から参照します。導入しただけで既存 PR を自動マージする機能ではありません。「PR まで」等の依頼の上限と既存の GitHub 保護を優先します。

標準は dev が必要な検査の完了後にマージする方式です。GitHub に待機を任せる継続自動化は、更新ごとにレーンと人の判断を検証する必須チェックを導入できる場合に設定します。ラベルだけで自動マージを有効にしません。

## 旧コマンドからの移行

`stack`・`env`・`perf`・`wordpress`・`orca`・`maintain` は専門ガイドへ統合しました。今後は `dev` にやりたいことを伝えてください。コード全体の規約整理は `refactor`、点検だけなら `check` を使います。

`docs` の README 更新は `dev` へ統合しました。配布資料の生成機能は公開プラグインから外しています。旧コマンドの自動転送はありません。

## 好みと方法論

[preferences](skills/dev/references/preferences/index.md) は、表記や選択の違いによる不要な差分をなくすための統一です。[構造の方法論](skills/dev/references/code/structure.md) は、分割・責務・試験のしやすさを定めます。意図と正本を分け、開発でも refactor でも同じ規約を使います。

## 開発文書

README・`.docs`・AGENTS.md の作成・更新・整理は `dev` に含みます。「README を今の実装に合わせて」「判断を .docs に残して」と自然文で依頼できます。HTML・PDF・スライドなどの配布資料作成は収録しません。

## 補助担当

Claude Code 向けには `fable`・`opus`・`sonnet`・`worker`・`hacker`・`loop` を収録しています。各担当の定義は [agents](agents) にあります。Codex は共通の手順を直接利用します。

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
