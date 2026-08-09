# Data Fetching

クライアント（React Query + Hono RPC）のデータ取得設計。

## 原則

- クエリラッパー関数を作らない。queryOptions を包むだけの関数や横断 queries 層は、文字列 queryKey の手動管理とクライアント側 zod parse という重複を生むだけで価値がない
- queryOptions は使用側のフック / コンポーネントにインライン化する
- queryKey はエンドポイントの `$path()` から導出する。文字列リテラルのキーを書かない
- レスポンス検証はサーバ側が正本。API ルートが `c.json(zSchema.parse(...))` で返し、クライアントは Hono RPC の型を信頼して `res.json()` をそのまま返す。クライアント側で zod parse しない（二重検証）

## パターン

使用側ファイルのモジュールトップにエンドポイント参照を置く。

```ts
const closingsEndpoint = apiClient.api.company.closings

// フック / コンポーネント内
const query = useQuery(
  queryOptions({
    queryKey: [closingsEndpoint.$path(), month],
    queryFn: async () => {
      const res = await closingsEndpoint.$get({ query: { month } })
      if (!res.ok) throw new Error("closings.fetch_failed")
      return await res.json()
    },
  }),
)

// mutation の onSuccess
await queryClient.invalidateQueries({ queryKey: [closingsEndpoint.$path()] })
```

- invalidate は `[endpoint.$path()]` の前方一致で、そのエンドポイントの全パラメータ分を無効化する
- path param 付きルートもキーの第 1 要素は引数なし `$path()`（`:user` を含むテンプレート）に固定し、id は第 2 要素以降に置く（`[endpoint.$path(), userId, month]`）。`$path({ param })` でパスに埋め込むと第 1 要素がインスタンスごとに変わり、全インスタンス横断の前方一致 invalidate が効かなくなる。リクエスト自体は `$get({ param: {...} })` で解決する
- 同一エンドポイントを複数ファイルで使う場合、queryKey の第 2 要素以降の形を揃える（キャッシュ共有のため）。null があり得るパラメータは `?? null` で正規化する
- 例外: `useSuspenseQueries` の動的配列を組むために queryOptions を返す関数が要る場合は、使用側と同じファイル内の局所ヘルパーとして持つ（横断層に置かない）。キーと戻り値の形は単発の使用箇所と一致させる
- 例外: 多数の画面（目安 10 箇所以上）が同一の複雑なフィルタ群で共有する基盤クエリ（利用者名簿・施設一覧・職員一覧など）は、共有 queryOptions 関数として 1 箇所に置いてよい。インライン化による同一ロジックの大量複製とキー漂流の方が害が大きい。ただし queryKey の先頭は必ず `$path()` にし、例外である理由をコメントで明記する
- 例外: 1 つのルートがパラメータで複数の応答スキーマを出し分ける場合（union 応答）、RPC の型推論は union を共通フィールドの最小形へ潰す。この場合に限りクライアント側の zod parse を残してパラメータごとの型を確定させる（サーバ側 parse は正本として維持したまま）。parse を落とすと片側の列が型から静かに消える。理由をコメントで明記する

## apiClient の base

- Hono RPC クライアントは相対 base で 1 つだけ作る（`hc<Api>("/")`）。ページを配った origin に自動追随するので、localhost / ステージング / 本番 / プレビューの全環境で同一ビルドが設定ゼロで動く
- env から絶対 URL を焼き込まない。ビルドが環境に結合し、プレビュー系の可変ドメインから壊れる
- `window.location.origin` を base にしない。コンポーネントをサーバ（Worker）でも描画する構成では module 初期化時に window が無く落ちる
- `$url()` を動かす目的で base を絶対化しない。queryKey は origin 非依存の `$path()` が正しく（環境でキーが揺れない）、絶対化しても `$url()` に使い道が生まれない
- 絶対 URL が本当に必要な場面（外部に渡すリンク等）は、ブラウザ限定の呼び出し側で `new URL(endpoint.$path(), window.location.origin)` を組んで局所に留める

## 落とし穴

- `$url()` を使わない。apiClient が相対 base（`hc<Api>("/")`）の場合、`$url()` 内部の `new URL()` が実行時に Invalid URL で落ちる。typecheck では検出できず、画面がエラーバウンダリに落ちて初めて分かる。URL パースをしない `$path()` を使う
- `if (!res.ok) throw` を消さない。エラー経路であると同時に、hono の ClientResponse を成功レスポンス型にナローイングする役割を持つ。外すと `res.json()` がエラー型との union になり型が壊れる
- queryKey の形式を移行するときは、そのエンドポイントの invalidateQueries / setQueryData を同じ変更で必ず対にする。片方だけ変えると invalidate が効かなくなり、静かにキャッシュ不整合が起きる
- 手書きキー時代の「ネストによる巻き込み invalidate」は `$path()` 化で静かに消える。旧キーで詳細が一覧の prefix 配下にあった場合（`["residents", id, "care-plans"]` と `["residents", id, "care-plans", planId]`）、一覧の invalidate が詳細も落としていたが、`$path()` では一覧と詳細は別エンドポイント＝sibling になり巻き込まれない。移行時は mutation ごとに旧 prefix が巻き込んでいたキーを洗い出し、対象エンドポイントの `$path()` を明示的に列挙して invalidate する。保存直後に詳細画面へ遷移するフローが典型的な被害箇所（staleTime の間、編集前の内容が表示される）。typecheck でもテストでも検出できないため、キー移行のレビューはこの観点を必ず通す
