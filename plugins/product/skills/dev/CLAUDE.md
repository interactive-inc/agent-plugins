# dev スキルの編集ルール

このスキル（SKILL.md / references / commands）を作成・更新するときの方針。

## スキルの責務

product は開発のベストプラクティス全体を扱う。常時展開される前提のスキルであり、同時に `/product:dev ログイン機能を追加して` のようにユーザーが直接呼び出す入口でもある。

対象は開発対象の製品リポジトリ。`.docs/` はそのリポジトリの直下に置くものであり、このプラグインリポジトリのことではない。

## ディレクトリ構成と寿命

トピックでディレクトリを切り、寿命（変更の理由と頻度）はここに明文化する。

- references/design/ — 設計手法。コア。差し替えるのは開発の思想を変えたときだけ。気軽に触らない
- references/docs/ — .docs/ の構造とフォーマット。中程度。成果物の形式を変えるときに更新
- references/request.md — 依頼の振り分けと実装フロー。中程度。運用の型を変えるときに更新
- references/tools/ — GitHub / Sentry / CI などツールの手順。短命。ツール都合で気軽に足し、使わなくなったら気軽に消す
- commands/ — 製品開発入口に属する限定command。横断点検はcheck、挙動不変の手入れはmaintainへ置く

短命なものがコアを浸食しないよう、追加時はまずどのディレクトリに属するか（＝何が理由で変わるものか）を決める。迷ったら寿命の短い側に置く。

## SKILL.md の書き方

- SKILL.mdは実行契約、振り分け、標準flow、reference索引だけに保つ。個別pattern、成果物format、tool手順はreferences / commandsへ置く
- devに横断inspection commandを追加しない。人間起動のcheckへ置き、開発中に自動実行しない
- Claude / Codex共通Skillに特定のagent tool名、agent type、固定agent数、token budgetを必須手順として書かない
- 「将来候補」「TODO」などスキル自体の育て方に関するメタ情報は SKILL.md に書かない。実行時のコンテキストに載せる価値がないものは全てこの CLAUDE.md に書く
- references を跨いで内容を重複させない。設計手法は design、成果物の書式は docs、フローは process、ツール手順は tools

## Adopted design methods

外側（利用者）から内側（実装）への同心円。採用した設計手法だけを記す。

- Product Design ⇒ Garrett's UX 5 planes (Strategy, Scope)
- UI Design ⇒ OOUI + Garrett's UX 5 planes (Structure, Skeleton, Surface)
- Domain Design ⇒ Evans's DDD (Strategic only, conceptual)
- Code Design ⇒ Beck's Simple Design + Layered Architecture

Tactical DDD（Aggregate / Entity / VO 実装）は Code Design に置く。

## Policy

- 採用したものだけ書く（線路を敷く）。代替・比較・実行順序は書かない
- 同じ観点に競合する手法を並べない
- 採用は厳守。設計検査にも使う
- より良い手法が見つかれば差し替える

## Out of Scope

- コーディング規約、文章作法（製品リポジトリの CLAUDE.md や rules の領分）
- エージェントの役割分担・委譲ルール（プラグインの agents/ の領分）
- 環境構築・デプロイ手順

## command境界

- 製品候補の提案はdevの`next`
- 仕様、docs、README、code、環境の点検は人間起動のcheck
- 点検結果からの挙動不変な修正は人間起動のmaintain
- 開発環境の適用とSkill追加は人間起動のenv
