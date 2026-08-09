# Application Operation 実装パターン

## 概要

Application operation は Repository、Adapter、Domain を組み合わせ、利用者または外部システムから見た一つの操作を実現する。ユースケースは操作と対応させ、クラスとは同一視しない。

## 選び方

- 一つの入力から一つの結果を返す処理は関数を既定とする
- 関連する複数操作で注入済み依存や状態を共有するときだけクラスを使う
- static-only class や、名前を失わせるためだけの `execute()` は作らない
- HTTP `Context` を Application へ渡さず、Interface で必要な値と具体依存へ分解する
- 依存の既定値を Application 内で暗黙生成せず、composition root で組み立てる

仕様の正本は `.docs` の安定したFeature IDとする。コード側の現在の所有者は関数、またはクラスの具体的なメソッドでよく、リネームや移動ではIDを変えない。

## エラーハンドリング

- 予想可能な業務エラーは値として返す
- 戻り値は `Promise<Result | NotFoundError | ConflictError | ...>`
- 予想不能な障害まで握り潰さず、製品の共通方針に従って記録・変換する

## 関数を使う例

```ts
import type { CustomerRepository } from "@/infrastructure/repositories/customer.repository"
import { CustomerEntity } from "@/domain/entities/customer.entity"
import { ConflictError } from "@/lib/errors"

type CreateCustomerInput = {
  name: string
  email: string
}

type CreateCustomerDeps = {
  customerRepository: CustomerRepository
}

export const createCustomer = Object.assign(
  async function createCustomer(
    input: CreateCustomerInput,
    deps: CreateCustomerDeps,
  ): Promise<{ customer: CustomerEntity } | ConflictError> {
    const existing = await deps.customerRepository.findByEmail(input.email)
    if (existing) return new ConflictError("このメールアドレスは既に登録されています")

    const customer = CustomerEntity.create({ name: input.name, email: input.email })
    await deps.customerRepository.save(customer)
    return { customer }
  },
  { featureId: "00480001" as const },
)
```

`Object.assign` は必須の実装形式ではない。既存製品にFeature manifestや隣接定数の規約があればそれを使い、「IDから現在のowner symbolを一意に引ける」ことだけを守る。

## クラスを使う例

```ts
export class CustomerApplication {
  static readonly featureIds = {
    updateCustomer: "00480002",
    deleteCustomer: "00480003",
  } as const

  constructor(private readonly customerRepository: CustomerRepository) {}

  async updateCustomer(input: UpdateCustomerInput): Promise<UpdateCustomerResult | NotFoundError> {
    const customer = await this.customerRepository.findById(input.id)
    if (!customer) return new NotFoundError("顧客が見つかりません")

    const updated = customer.withName(input.name)
    await this.customerRepository.save(updated)
    return { customer: updated }
  }

  async deleteCustomer(input: DeleteCustomerInput): Promise<void | NotFoundError> {
    const customer = await this.customerRepository.findById(input.id)
    if (!customer) return new NotFoundError("顧客が見つかりません")

    await this.customerRepository.delete(customer.id)
  }
}
```

クラス全体ではなく各メソッドが一つのApplication operationである。クラスをFeatureの境界として巨大化させない。

## Route Handler からの呼び出し

```ts
export const POST = factory.createHandlers(
  authorizedAdmin(),
  zValidator("json", zCreateCustomerBody),
  async (c) => {
    const result = await createCustomer(c.req.valid("json"), {
      customerRepository: new CustomerRepository(c.env.DB),
    })

    if (result instanceof ConflictError) {
      return c.json({ message: result.message }, 409)
    }
    return c.json({ customer: result.customer }, 201)
  },
)
```

Interface は入力変換、認証・認可の接続、HTTP responseへの変換を所有する。Application operationの業務分岐をRoute Handlerへ複製しない。
