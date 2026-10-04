---
name: dev
description: "Route product requests from customer signals, ideas, backlogs, Issues, PR review, CI failures, and related PR chains through design, implementation, change-scoped verification, documentation, and delivery. Do not start broad inspection or maintenance automatically."
---

`inta:dev`は製品開発の共通入口。依頼の整理、設計、実装、変更に必要な検証、記録、ユーザーが依頼したGitHub deliveryまでを一つの仕事として扱う。専門検証は`inta:test`を使う。横断的な点検と挙動不変の保守は人間起動の独立Skillであり、開発中に自動実行しない。

# 実行契約

- 最初に対象リポジトリの指示を読み、プラグイン既定より優先する
- ユーザーが実装、push、PR、mergeまで明示した場合は、既に承認された工程ごとに再確認しない
- 結果を変える選択が未決定、権限が不足、または対象外への拡張が必要な場合だけ確認する
- 調査・レビュー・`check`・プレビューは読み取り専用。書き込みや外向き操作は依頼された範囲だけ行う
- 完了はコード変更ではなく、必要な検証と成果物が揃った状態で判定する

# 振り分け

`/inta:dev {入力}` を次の順で解釈する。

1. `next` / `review` / `ci` / `pr-chain` → [サブコマンド](#サブコマンド)
2. 数字、`#N`、GitHub URL → [request.md](references/request.md) の既存Issue / PRフロー
3. `signals/{slug}` → 既存signalの更新または昇格
4. その他の自然文 → [request.md](references/request.md) でsignal / backlog / issue / 直接作業に分類
5. 引数なし → signalとbacklogから次の候補を読み取り専用で提案

Issue / PRの書式は [gh-templates.md](references/tools/gh-templates.md)、GitHub運用は [gh.md](references/tools/gh.md)、コミットメッセージは [git.md](references/tools/git.md)、レビューは [review.md](references/tools/review.md)、CHANGELOG判断は [changelog.md](references/tools/changelog.md) を必要時だけ読む。

# 標準フロー

1. **Intent**: 目的、利用者、完了条件、許可された外向き操作を一文で固定する
2. **Inspect**: リポジトリ指示、状態、既存Issue / PR、関連仕様と実装を確認する。並行作業の変更を上書きしない
3. **Design**: 外側の価値から内側の実装へ進む。下記のreferenceは変更に必要なものだけ読む
4. **Implement**: 仕様とテストを同じ変更範囲で更新する。別件は混ぜない。`.ts` / `.tsx`を書く前に[typescript.md](references/code/typescript.md)、Reactコンポーネントを書く前に[react.md](references/code/react.md)を必ず読む
5. **Verify**: 変更範囲に必要なリポジトリ固有のformat / lint / typecheck / testと`inta:test`能力を実行する。広範な品質監査、仕様trace、保守候補探索は追加しない
6. **Record**: コードから読めない意思決定を`.docs/`へ残し、価値のある変更だけCHANGELOGへ記録する
7. **Deliver**: 依頼範囲がcommit / push / PR / mergeを含む場合だけ、その地点まで進めて結果を確認する。commitのメッセージ書式は[git.md](references/tools/git.md)に従う

# 設計reference

変更に関係するものだけ読む。

- Product / UI: [UX 5 planes](references/design/ux-five-planes.md)、[Page routing](references/design/page-routing.md)
- Domain / Application: [Architecture](references/design/architecture.md)、[Value Object](references/design/value-object.md)、[Service Layer](references/design/service-layer.md)
- Code: [Error handling](references/design/error-handling.md)、[React](references/design/react.md)、[Data fetching](references/design/data-fetching.md)
- API / DB: [API](references/design/api.md)、[Database](references/design/database.md)
- Performance: [Performance](references/design/performance.md)、本番の計測は [Cloudflare analytics](references/tools/cloudflare-analytics.md)
- State / patterns: [FSM](references/design/fsm.md)、[Reducer](references/design/reducer.md)、[Phantom Type](references/design/phantom-type.md)、[Fluent API](references/design/fluent-api.md)
- Specification / tests: [Testing](../test/references/testing.md)

# コーディング規約reference

`.ts` / `.tsx`を書く前に必ず読む。

- [TypeScript](references/code/typescript.md)
- [React](references/code/react.md)

原則は、依存方向を Interface → Application → Domain → Infrastructure に保ち、単純CRUDを不必要に多層化せず、業務上の不変条件だけをDomainへ置くこと。Applicationは一つの利用者目的につき一つの具象ユースケースクラスとし、複数操作を一クラスへまとめない。詳細な判断はreferenceと対象リポジトリの既存設計から行う。

# `.docs` reference

`.docs/`は対象製品リポジトリに置く。コードから読めない意図・声・判断を記録し、コードから生成できる一覧は実装を正として部分更新する。対象成果物のreferenceだけを読む。

- 入口と文章規則: [index](references/docs/index.md)、[writing rules](references/docs/writing-rules.md)、[validation](references/docs/validation.md)
- 仕様と導線: [features](references/docs/features.md)、[stories](references/docs/stories.md)、[pages](references/docs/pages.md)、[sitemap](references/docs/sitemap.md)
- 製品判断: [signals](references/docs/signals.md)、[backlogs](references/docs/backlogs.md)、[decisions](references/docs/decisions.md)、[sources](references/docs/sources.md)
- 構造と権限: [architecture](references/docs/architecture.md)、[domain](references/docs/domain.md)、[roles](references/docs/roles-and-permissions.md)、[API schema](references/docs/api-schema.md)
- 利用者向け: [capabilities](references/docs/capabilities.md)、[manual](references/docs/manual.md)、[glossary](references/docs/glossary.md)

signals / backlogsの人間ゾーンは [human-agent-zone.md](references/docs/human-agent-zone.md) に従う。ファイルを丸ごと再生成せず、矛盾した部分だけ更新する。

# サブコマンド

| command                  | 既定動作                         | 書き込みを許可する入力 |
| ------------------------ | -------------------------------- | ---------------------- |
| [next](commands/next.md) | bounded scanで次の製品候補を提案 | `--write`              |
| `review [target]`        | [review.md](references/tools/review.md)でPR / 差分 / pathを読み取り専用レビュー | 明示されたreview投稿 |
| [ci](commands/ci.md)     | 失敗runを特定して原因と再現方法を報告 | 明示された修正依頼 |
| [pr-chain](commands/pr-chain.md) | 関連PRの依存・CI・競合と安全な順序を報告 | `merge`または明示されたmerge依頼 |

モデルが自発的に呼び出してよいのは`next`、`review`、`ci`、`pr-chain`の読み取り専用の既定動作だけ。`--write`、review投稿、Issue作成、push、branch更新、mergeへ暗黙に権限を広げない。
