# React コーディング規約

Reactコンポーネントの実装作法。設計判断（構造・状態管理の選択）は[design/react.md](../design/react.md)を参照し、こちらは実装時の禁止事項と作法を扱う。

## コンポーネント

- `type Props` を定義、`export function` を使う
- `props: Props` で受け取る（destructuring しない）
- コンポーネントの説明コメントをつける

## Hooks

- useEffect 禁止
- useCallback 禁止
- useMemo は1000件以上の計算でのみ許可（理由コメント必須）

## TailwindCSS

- `pb-` でなく `space-` / `gap-` を使う

## ハイドレーション（SSR時）

- `new Date()` / `Math.random()` をレンダー中に使わない
- `window` / `document` を条件分岐で使わない
- `suppressHydrationWarning` 禁止

## エラー

- mutation は onError、関数は try-catch + instanceof Error

## shadcn/ui

- shadcn/ui をベースにする。一から作らない
- 型エラー（未使用 import 等）が出ても手で直さず、shadcn の更新を待つか tsconfig 側で exclude
- コンポーネント追加は shadcn CLI（MCP / `vp dlx shadcn@latest add ...`）経由のみ

### Card

CardHeader と CardContent を使わずに Card を直接使う場合、デフォルトの padding と gap で不要な余白ができる。`p-0 gap-0` をつける。

```tsx
// CardHeader + CardContent を使う場合はそのまま
<Card>
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>

// 直接使う場合は p-0 gap-0
<Card className="p-0 gap-0">
  <div className="p-4">...</div>
</Card>
```
