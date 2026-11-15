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

Issue は根拠・修正方針・影響範囲・優先度・見積もり・完了条件を残す計画、PR はその計画を差分と検証でどう満たしたかを示すものです。書式は [Issue・PR の規約](skills/dev/references/tools/issue-pr.md) に従います。`debug` が受け持つのは Issue の計画整理までで、修正と PR は `/inta:dev #123 を修正してPRまで` のように別に頼みます。

PR は [PR レーン](skills/review/references/pr-lanes.md) で **通常・共有・要確認** に分けます。製品ごとの条件は `review` か `dev` に「PR レーンを設定して」と頼むと決められます。依頼の上限と GitHub の保護設定が常に優先され、設定しただけで既存の PR が自動でマージされることはありません。

## 好みと方法論

[preferences](skills/dev/references/preferences/index.md) は、表記や選択の違いによる不要な差分をなくすための統一です。[構造の方法論](skills/dev/references/code/structure.md) は、分割・責務・試験のしやすさを定めます。意図と正本を分け、開発でも refactor でも同じ規約を使います。

## 開発文書

README・`.docs`・AGENTS.md の作成・更新・整理は `dev` に含みます。「README を今の実装に合わせて」「判断を .docs に残して」と自然文で依頼できます。HTML・PDF・スライドなどの配布資料作成は収録しません。

## 担当（Claude Code）

Claude Code 向けに6つの担当を収録しています。会話の主担当として選ぶ `fable`・`opus`・`sonnet`、主担当からの委託先の `worker`、単独で動く点検役の `hacker`・`loop` です。定義は [agents](agents) にあります。

| 担当 | 役割 | 使いどころ |
| --- | --- | --- |
| `fable` | 指揮役。目的・設計判断・受け入れを持ち、重い実装や並行できる仕事を委託する | 規模が大きく、並行して進めたい開発 |
| `opus` | 主担当。判断も実装も基本は自分で行う | 日常の開発の標準 |
| `sonnet` | 軽量な主担当。現在のブランチ内で実装し、判断は advisor に相談する | 小さめの変更を軽く進めたいとき |
| `worker` | 実装担当。任された範囲の実装と試験を、再委託せずに終える | 主担当からの委託先 |
| `hacker` | 明示された範囲のセキュリティ検査と、確認できた問題の報告 | 許可を得た安全性の点検 |
| `loop` | 指定した画面を巡回し、確認できた不具合を最大1件記録する | 画面の定期的な見回り |

`opus`・`sonnet`・`worker`・`loop` は画面操作に `agent-browser` スキルを使います。このプラグインには含まれないので、画面の確認まで任せる場合は別に導入してください。Codex は担当を使わず、共通の手順を直接利用します。

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
