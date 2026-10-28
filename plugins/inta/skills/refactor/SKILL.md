---
name: refactor
description: "Check and apply coding preferences, file structure, and testable design without changing behavior."
argument-hint: "[path|changed] [--check]"
user-invocable: true
disable-model-invocation: true
---

# 規約にそろえるリファクタリング

人間が明示した対象の書き方・配置・責務を、振る舞いを保って規約へそろえる。引数なしは対象製品の手書きコード全体、path はその範囲と直接の利用先、`changed` は現在の差分。`--check` は読み取り専用。通常の開発へ全体リファクタを自動追加しない。

## 正本

- 好みと書式：[preferences](../dev/references/preferences/index.md)。TypeScript / React の各 ID を含め、対象に適用する規則をすべて確認する。
- 方法論：[ファイル分割とテスト容易性](../dev/references/code/structure.md)、[依存・ユースケース](../dev/references/design/architecture.md)、[React の境界](../dev/references/design/react.md)。
- 基盤と配置：[stack](../dev/references/guides/stack/index.md)。文書も対象なら [文書規約](../dev/references/docs/index.md)。

## 進め方

1. 製品の指示、Git 状態、対象と呼び出し元、実行設定、生成物・保護対象を確認する。適用規則と明示された例外を解決し、既存試験の結果を取る。
2. 各規則を既存 formatter / lint / 型検査 / 専用 checker で点検し、機械で判定できない規則はコードと利用箇所を読む。チェックした一部から全体合格を推測しない。
3. 違反を修正する。1ファイル1関数／1クラスと `utils.ts`・`types.ts` の例外、名前・import・Props・Hooks・責務・依存・試験境界を合わせる。必要な回帰試験を先に固定し、移動先・import・export・設定・関連文書を同じ変更で追従させる。
4. 修正後は対象ファイルの一覧と呼び出し先を取り直し、全適用規則と必要な試験・build を再確認する。機械検査の成功だけで、手動判定の項目も適合したと扱わない。

他者の差分、生成物、外部契約を守り、型エラーを cast や検査除外で隠さない。機能・認可・データ・認証方式の変更、package 化や公開 API の追加が必要なら、挙動不変の修正と分けて対話する。単なる書式の選好を毎回聞き直さない。

結果は各規則を「適合／修正済み／対象外／未確認・保留」に分け、例外の根拠と未修正箇所を示す。未確認・保留がある状態で「全て満たした」と言わない。commit・push・PR は依頼と製品規約の範囲で行い、Issue・PR のラベル必須を維持する。
