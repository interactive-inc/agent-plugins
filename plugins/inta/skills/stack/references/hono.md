# Hono を採用済みの製品

既存の Hono 製品を扱う場合に読む。新規製品の基盤は [stack](../SKILL.md) の Void 方針に従う。API の構文は導入版と [Hono 公式資料](https://hono.dev/docs/) で確認する。

## 標準配置

既存製品の規約がなければ次にそろえる。不要な空ディレクトリは作らない。

```text
api/
  domain/             entities/・values/・errors/
  application/        利用者目的ごとの操作
  infrastructure/     repositories/・adapters/・converters/
  interface/          routes/・middlewares/・serializers/・factory.ts
  lib/                横断する内部処理
  migrations/
  drizzle.schema.ts
  env.d.ts
  index.ts
```

依存とユースケースの規約は [architecture](../../dev/references/design/architecture.md)、値の適用条件は [Value Object](../../dev/references/design/value-object.md) を正本にする。

## 境界と命名

- Entity class は `XxxEntity`、生成 factory は `createWithEmail()` のような具体名。Entity は `xxx.entity.ts`、値オブジェクト class は `xxx.value.ts`、Repository は `xxx.repository.ts`、外部連携は `xxx.adapter.ts`。
- Application は `create-customer.ts` のように目的を表す。HTTP Context を渡さず、入力と具体的な依存を入口で組み立てる。
- Entity は DB レコードを知らない。レコードと Entity の変換は Repository が行い、外部 API・メール・ストレージは Adapter に置く。
- HTTP の入力検証・認証との接続・レスポンス変換は Interface が所有する。エラーは [共通方針](../../dev/references/design/error-handling.md) に従い HTTP 境界で変換する。
- `customers.$customer.orders.ts` のようなファイル名と実 URL の対応は、製品のルート登録方式で確認する。Hono 自体がファイルから自動登録する前提にしない。
- DB の名前・型・migration は既存 schema にそろえる。DB や認証の独自ひな形をコピーせず、利用版の API と試験で確かめる。

仕様 ID と試験の接続は [testing](../../test/references/testing.md)。依存の追加は [stack](../SKILL.md) の `vp install` 方針に従う。
