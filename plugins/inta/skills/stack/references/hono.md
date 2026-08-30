# Hono Backend

Layered (Interface → Application → Infrastructure → Domain). Lib は横断のみ。

## Layout

```
api/
├── domain/
│   ├── entities/
│   ├── values/
│   └── errors/
├── application/
├── infrastructure/
│   ├── repositories/
│   ├── adapters/
│   └── converters/
├── interface/
│   ├── routes/
│   ├── middlewares/
│   ├── serializers/
│   └── factory.ts
├── lib/
├── migrations/
├── drizzle.schema.ts
├── env.d.ts
└── index.ts
```

## Layer Rules

- Interface: validation、auth、HTTPException 変換
- Application: 1ユースケース = 1具象クラス。公開操作は対象リポジトリの規約に沿った一つだけにする
- Domain: Entity / Value Object / business rules、外部依存なし
- Infrastructure: Repository / Adapter で DB ・外部 API を隔離
- Lib: 横断的関心事のみ、外部サービス連携は含めない

## Domain

- Entity は DB を知らない（`fromRecord()` を持たない）。DB → Entity 変換は Repository の責務
- Factory メソッドは具体名（`create()` より `createWithEmail()`）

## Naming

- Entity ⇒ `xxx.entity.ts`
- Value Object class ⇒ `xxx.value.ts`（適用条件と非class moduleのsuffixはdevの[Value Object](../../dev/references/design/value-object.md)を参照）
- Repository ⇒ `xxx.repository.ts`
- Adapter ⇒ `xxx.adapter.ts`
- Application use case ⇒ `動詞-名詞.ts`（`create-customer.ts`、`update-customer.ts`）
- Route ⇒ `resource.$param.ts`（`customers.$customer.ts`）

### Application Use Case Prefix

`create-` / `update-` / `delete-` / `fetch-` / `get-` / `approve-` / `reject-` / `publish-` / `cancel-`

`write-` / `save-` / `upsert-` / `manage-` / `process-` / `handle-`のように、完了後の状態を特定できない総称は使わない。

### Route File

- `/customers` ⇒ `customers.ts`
- `/customers/:customer` ⇒ `customers.$customer.ts`
- `/customers/:customer/orders` ⇒ `customers.$customer.orders.ts`
- `/customers/search` ⇒ `customers.search.ts`

## References

### Domain

- [Entity](hono/domain-entity.md)
- [Value Object](hono/domain-value.md)
- [Error](hono/domain-error.md)

### Application

- [Application Operation](hono/application-service.md)

### Infrastructure

- [Repository](hono/infrastructure-repository.md)
- [Adapter](hono/infrastructure-adapter.md)

### Interface

- [Route Handler](hono/interface-route-handler.md)
- [Entry Point](hono/interface-entry-point.md)
- [Error Handling](hono/interface-error-handling.md)

### Common

- [Drizzle Schema](hono/drizzle-schema.md)
- [Lib](hono/lib-structure.md)

## Agent tools

横断ツールは [stack スキル](../SKILL.md) を参照。

### hono-skill

`vpx skills add yusukebe/hono-skill --agent <client-id> --skill hono-skill -y`。`client-id` は利用中agentの識別子へ置き換える。

### sentry-for-ai

Sentry 利用時。`npx skills add getsentry/sentry-for-ai`。前提: `sentry-cli`。
