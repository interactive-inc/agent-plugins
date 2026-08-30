# unit — 振る舞いの単体検証

`/inta:test unit`は、選択した関数、Application / Domain、componentの外から観察できる振る舞いを、対象リポジトリのunit runnerで検証する。

## Scope

```text
/inta:test unit
/inta:test unit <path-or-symbol>
/inta:test unit --full <path>
```

- 引数なし: default branchとの差分と直接影響するunit
- path / symbol: 指定対象と既存test
- `--full`: ユーザーが明示したpath配下。リポジトリ全体を暗黙に対象にしない

比較基点が解決できない場合は取得できたdiffだけを使い、制約を報告する。

## Workflow

1. リポジトリ指示、test runner、既存test配置、fixture / helper、対象のpublic behaviorを確認する
2. 既存testを先に実行し、baseline failureを分ける
3. 検証依頼ならtestを変更せず、現在のcoverageと失敗を報告する
4. test追加・修正まで依頼されている場合は、最小の公開境界で次を検証する
   - normal success
   - boundary / empty / null
   - failure後の状態
   - retry / idempotency
   - identity / tenant / authorization scope
   - persistence order / concurrency（該当時）
5. mockは外部I/O境界に限定し、業務判断そのものをmockへ移さない
6. focused test、変更fileの検査、リポジトリ標準gateを順に実行する

## Dependencies

既存のtest stackを使う。testing library、DOM runtime、runnerなどが不足していて追加が必要なら、package、理由、対象file、lockfile影響を説明して許可を得る。検証のためだけに戦略fileや設定を自動生成しない。

## Report

対象、守った振る舞い、実行command、pass / fail数、未検査、追加・変更したtestを報告する。testが書けない場合は、隠すための除外listを作らず、設計上のtestability問題として理由を示す。
