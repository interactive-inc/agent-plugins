# Value Object

値で識別され、不変条件や業務上の振る舞いを持つ値を class で表す。単純な入力検証だけなら既存のスキーマで足りる。規約に合わせるためだけの class は作らない。

構築時に検証し、値の変更は `with*()` などで新しい値を返す。判定は getter、等価性は `equals()` で値を比較する。`Object.freeze(this)` は保持するオブジェクトの内部まで凍結しないため、可変参照を外へ渡さない。

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
