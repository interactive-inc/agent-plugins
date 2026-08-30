# Applicationユースケース実装パターン

## 概要

ApplicationはRepository、Adapter、Domainを組み合わせ、利用者または外部システムから見た一つの目的を実現する。一つのユースケースを一つの具象クラスで表し、公開操作は対象リポジトリの規約（`execute()` / `run()`など）に沿った一つだけにする。

## 境界

- クラス名とファイル名は`CreateCustomer` / `create-customer.ts`のように、対象と操作を具体的に表す
- 作成・更新・削除、承認・却下などを一つのクラスへ統合しない
- `action` / `operation` / `mode`を受け取り、内部で別の操作へ分岐しない
- `Write` / `Save` / `Upsert` / `Manage` / `Process` / `Handle`のように結果を特定できない総称をユースケース名にしない
- Applicationクラスから別のApplicationクラスを呼ぶFacadeや共通writerを作らない
- 共通の業務規則はDomain、DBや外部I/OはInfrastructureへ置く
- HTTP `Context`をApplicationへ渡さず、Interfaceで必要な値と具体依存へ分解する
- 依存の既定値をApplication内で暗黙生成せず、composition rootで組み立てる
- JSDocは「顧客を作成する。」のように、対象と操作を自然な日本語で書く

仕様の正本は`.docs`の安定したFeature IDとする。コード側では一つのユースケースクラスが一つのFeature IDを所有する。リネームや移動ではIDを変えず、業務上別の操作へ分割したときはFeatureとの対応を見直す。

## エラーハンドリング

- 予想可能な業務エラーは値として返す
- 戻り値は`Promise<Result | NotFoundError | ConflictError | ...>`とする
- 予想不能な障害まで握り潰さず、製品の共通方針に従って記録・変換する

## 実装例

```ts
import type { CustomerRepository } from "@/infrastructure/repositories/customer.repository"
import { CustomerEntity } from "@/domain/entities/customer.entity"
import { ConflictError } from "@/lib/errors"

type Props = {
  customerRepository: CustomerRepository
}

type Input = {
  name: string
  email: string
}

/** 顧客を作成する。 */
export class CreateCustomer {
  static readonly featureId = "00480001"

  constructor(private readonly props: Props) {
    Object.freeze(this)
  }

  async execute(input: Input): Promise<{ customer: CustomerEntity } | ConflictError> {
    const existingCustomer = await this.props.customerRepository.findOne({ email: input.email })
    if (existingCustomer !== null) {
      return new ConflictError("このメールアドレスは既に登録されています")
    }

    const customer = CustomerEntity.create({ name: input.name, email: input.email })
    await this.props.customerRepository.write(customer)

    return { customer }
  }
}
```

更新と削除は`CreateCustomer`へメソッドを足さず、`UpdateCustomer`と`DeleteCustomer`へ分ける。

## Route Handlerからの呼び出し

```ts
export const POST = factory.createHandlers(
  authorizedAdmin(),
  zValidator("json", zCreateCustomerBody),
  async (context) => {
    const useCase = new CreateCustomer({
      customerRepository: new CustomerRepository(context.env.DB),
    })
    const result = await useCase.execute(context.req.valid("json"))

    if (result instanceof ConflictError) {
      return context.json({ message: result.message }, 409)
    }

    return context.json({ customer: result.customer }, 201)
  },
)
```

Interfaceは入力変換、認証・認可の接続、HTTP responseへの変換を所有する。入力の状態から複数ユースケースを選ぶ必要がある場合は、ネストした三項演算子でなく明示的な`if`を使う。
