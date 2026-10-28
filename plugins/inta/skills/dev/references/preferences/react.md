# React の preferences

同じ部品に異なる記法・Hooks・見た目の基盤を持ち込まないための統一。[TypeScript](typescript.md) も適用する。

| ID | 統一する書き方 |
| --- | --- |
| R01 | `type Props = { ... }` を定義し、`export function Component(props: Props)` で受け取る。Props の分割代入・`React.FC`・arrow function での component 定義は使わない。部品の説明を JSDoc で付ける。 |
| R02 | 部品は `ProductCard`・`PaymentForm` のような業務名にする。`Container`・`Wrapper` などの技術的な総称を避け、`children` で composition する。 |
| R03 | `useEffect`・`useCallback` 禁止。`useMemo` は1000件以上の計算だけに使い、理由コメントを付ける。 |
| R04 | Tailwind の項目間隔は `space-*` / `gap-*`。子の `pb-*` で項目間隔を作らない。 |
| R05 | render 中の `new Date()`・`Math.random()`、`window` / `document` の有無による描画分岐、`suppressHydrationWarning` 禁止。 |
| R06 | UI 部品は shadcn/ui をベースにし、同等品を一から作らない。追加は導入版で確認した shadcn CLI / MCP を使い、管理される部品を場当たり的に手編集しない。 |
| R07 | CardHeader / CardContent を使わず Card に直接内容を置く場合は `p-0 gap-0` を付ける。 |
| R08 | Context は基本使わない。多言語・認証状態・利用者情報、複雑な部品内の Props Drilling 回避に限定する。form 状態・UI 開閉は入れない。状態更新を伴う Context は Reducer と組み合わせる。 |

```tsx
type Props = {
  customerName: string
}

/** 顧客名を表示する。 */
export function CustomerName(props: Props) {
  return <span>{props.customerName}</span>
}
```

状態・取得・エラー境界の方法論は [React の設計](../design/react.md)。SSR / SPA など製品単位の選択は [stack](../../../stack/SKILL.md) の Void 方針と導入版の機能に従う。
