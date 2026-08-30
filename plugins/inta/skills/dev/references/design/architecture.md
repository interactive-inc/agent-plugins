# レイヤードアーキテクチャ

Interface → Application → Domain → Infrastructure。依存は一方向で逆転させない。小規模では層を分けない。段階的に導入する。

## 層の構成

- Interface: HTTP リクエスト／レスポンス、認証、バリデーション
- Application: 複数ドメインオブジェクトの調整。1ユースケース = 1クラス
- Domain: Entity、Value Object、ビジネスルール、不変条件
- Infrastructure: DB アクセス、外部 API 通信

## 依存ルール

- 依存は上位層から下位層への一方向。逆転しない（DIP は採用しない）
- 抽象化（interface、抽象クラス）を作らない。具体クラスを直接使う
- TypeScript の `interface` 構文は使わない。`type` で表す
- DI コンテナを使わない。関数引数またはコンストラクタで依存を注入する
- DB 接続・API キーは環境変数で受け、トップレベルで具体クラスを生成して下位層に渡す（バケツリレー）

## Interface 層

バリデーションと認証を行い、ビジネスロジックは Application 層に委譲する。エラーは `instanceof` で分岐してユーザー向けレスポンスに変換する。

## Application 層

一つの利用者目的を、一つの具象ユースケースクラスの公開操作一つで表す。公開操作名は対象リポジトリの規約（`execute()` / `run()`など）に揃える。クラス名とファイル名は `CreateCustomer` / `create-customer.ts`、`ApproveExpense` / `approve-expense.ts` のように、実行する操作を具体的に示す。

- 一つのクラスへ作成・更新・削除、承認・却下など複数操作を統合しない
- `action` / `operation` / `mode` で操作を切り替えない。操作ごとにクラスを分ける
- `Write` / `Save` / `Upsert` / `Manage` / `Process` / `Handle` のように結果を特定できない総称をユースケース名に使わない
- Applicationクラスから別のApplicationクラスを呼ぶFacadeや共有実装を作らない。共通の業務規則はDomain、I/OはInfrastructureへ置く
- Interfaceで入力からユースケースを選ぶ必要がある場合は、ネストした三項演算子ではなく明示的な`if`を使う
- クラスのJSDocは「顧客を作成する。」のように、対象と操作を自然な日本語で書く。層や永続化方式の説明を役割コメントにしない

予想可能な業務エラーは `T | Error` の値として返す。予想不能な障害の扱いは製品の共通方針に従う。

単純な CRUD は Service を経由しない。複数の処理を組み合わせる場合のみ Service を作る。

## Domain 層

Entity はイミュータブル（Object.freeze）。状態変更は `with*()` で新しいインスタンスを返す。

Entity はフラットに保つ。他の Entity を入れ子にしない。関連データは JOIN してフラットに展開する。

集約ルートは守るべき不変条件ごとに分ける。

## Infrastructure 層

Repository は集約ルートごとに作成（具体クラス、interface なし）。メソッドは `findOne`, `findMany`, `write`, `delete` の四種に限定。複雑な検索メソッドは作らない。検索条件は `where` 引数で表現する。

外部 API は Adapter で包む（具体クラス、interface なし）。

## エラーの流れ

Infrastructure（技術エラー） → Application（アプリエラーに変換） → Interface（ユーザー向けレスポンスに変換）

すべて `T | Error` で返す。throw しない。
