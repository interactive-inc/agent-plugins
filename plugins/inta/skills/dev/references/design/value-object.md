# Value Object

プリミティブ値: Zod でバリデーション、getter で判定ロジック。

```ts
const emailSchema = z.string().email()

export class Email {
  constructor(private readonly value: string) {
    emailSchema.parse(value)
    Object.freeze(this)
  }

  get isCompanyEmail(): boolean {
    return this.value.endsWith("@example.co.jp")
  }

  get domain(): string {
    return this.value.split("@")[1]
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
```

オブジェクト値: `with*()` で不変更新、計算結果は getter。

```ts
const personNameSchema = z.object({
  first: z.string().min(1),
  last: z.string().min(1),
})

type Props = z.infer<typeof personNameSchema>

export class PersonName {
  constructor(private readonly props: Props) {
    personNameSchema.parse(props)
    Object.freeze(this)
  }

  get fullName(): string {
    return `${this.props.last} ${this.props.first}`
  }

  withFirst(first: string): PersonName {
    return new PersonName({ ...this.props, first })
  }

  equals(other: PersonName): boolean {
    return this.props.first === other.props.first && this.props.last === other.props.last
  }
}
```

## ファイル命名

`*.value.ts` は、値で識別されるイミュータブルな値オブジェクト class を primary export として持つファイルにだけ使う。バリデーション schema や補助型を同じファイルに置く場合も、利用側がそのファイルから使う中心は値オブジェクト class とする。

class ではない module は `*.value.ts` にせず、責務に合う suffix を使う。

| 責務 | suffix | 例 |
| --- | --- | --- |
| 文字列 union・選択肢の定義 | `*.definition.ts` | `care-level.definition.ts` |
| 定数表・参照カタログ | `*.catalog.ts` | `service-type.catalog.ts` |
| 業務判定 policy | `*.policy.ts` | `billing-eligibility.policy.ts` |
| DTO・入出力 contract | `*.contract.ts` | `resident-import.contract.ts` |
| validation schema | `*.schema.ts` | `email.schema.ts` |
| 表示・文字列 formatter | `*.formatter.ts` | `money.formatter.ts` |

規約を満たすためだけのダミー class や、関数・定数を static member に移しただけの static-only class で非class moduleを包まない。値オブジェクト class にする不変条件や振る舞いがなければ、exportとファイル名を実際の責務に合わせる。

ルール:

- コンストラクタで Object.freeze
- Zod でバリデーション + 型推論
- プリミティブ値は getter、複数値は `with*()` で更新
- 判定ロジックは getter (`isXxx`, `hasXxx`)
- 等価比較は `equals()` で値比較
