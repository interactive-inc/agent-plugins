---
name: dev
description: "Develop products through ongoing dialogue, focused implementation, tests, and maintained project context."
argument-hint: "[next|review|ci|pr-chain|自然文|Issue番号]"
user-invocable: true
disable-model-invocation: false
---

# 継続的な開発

対話を通じて、何を実現したいのか、なぜ今作るのかを理解する。目的・利用者・規模・期限・運用期間・失敗時の影響から、作り方と検証の厚さを調整する。既に分かっていることは聞き直さず、方針を変える問いを自分から提起する。

全体の目的を見て、必要な部分を実装・検証し、その結果から全体を見直す。この往復を続け、ずれ・新しい発見・よりよい選択肢を対話へ戻す。合意した範囲は自律的に進め、目的・優先順位・影響範囲が変わる判断は利用者と決める。

## 共通の約束

- まず対象製品の指示と実装・設定・試験を読む。並行作業の変更を保護する。
- 現状を説明する文書が実装と食い違う場合は、動く実装・設定・試験で確かめる。古い説明に合わせるためだけに実装を変えない。明示された変更方針や業務要件は現状の説明と区別し、作業中に見つけた食い違いと採った判断を報告する。
- 一つのファイルに複数の責務を詰め込まない。業務判断を画面・通信から分け、重要な正常系・失敗系を確かめながら実装する。不具合は可能なら再現する試験を先に作る。試験の具体的な方法は [inta:test](../test/SKILL.md)。
- 対話と実装で得た理解を [文書規約](references/docs/index.md) と [記録・整理](references/docs/development-context.md) に従い `.docs/`・`AGENTS.md` に残す。関係する古い説明・重複・矛盾は同じ仕事の中で整理し、決定の経緯と人の記述を失わない。
- 依頼済みの操作の承認は取り直さない。送信・公開・権限変更は依頼された範囲で行い、必要な検証と成果物がそろった地点まで進める。

## 短い呼び出し

| 入力 | 進め方 |
| --- | --- |
| 自然文・Issue / PR | [request](references/request.md) |
| `next` | [次の候補](commands/next.md) |
| `review` | [差分の確認](references/tools/review.md) |
| `ci` | [自動検査の失敗](commands/ci.md) |
| `pr-chain` | [関連する変更の整理](commands/pr-chain.md) |

引数なしでは、現状を読み次の候補を対話する。`check`・`maintain`・`env` は独立した人間起動の仕事で、開発中に自動実行しない。作業に伴う文書の整理や必要な試験は開発に含む。

## 必要な規約だけ読む

- 道具・開発基盤・標準配置：[inta:stack](../stack/SKILL.md)
- 責務と依存方向：[設計](references/design/architecture.md)。業務の不変条件を定めるときは [Value Object](references/design/value-object.md)、[Service](references/design/service-layer.md)
- 書き方：[TypeScript](references/code/typescript.md)、[React](references/code/react.md)
- 製品・画面の判断：[UX](references/design/ux-five-planes.md)、[画面の導線](references/design/page-routing.md)
- API・保存・性能：[API](references/design/api.md)、[DB](references/design/database.md)、[Performance](references/design/performance.md)、既存処理の改善は [inta:perf](../perf/SKILL.md)
- 記録：[文書の入口](references/docs/index.md)、[文章](references/docs/writing-rules.md)、[整合確認](references/docs/validation.md)
- 外部へ届けるとき：[GitHub](references/tools/gh.md)、[課題・変更提案の書式](references/tools/gh-templates.md)、[コミット](references/tools/git.md)、[変更履歴](references/tools/changelog.md)
