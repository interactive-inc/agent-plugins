# TanStack を採用済みの製品

既存の TanStack Start / Query 製品を扱う場合に読む。新規製品へ自動採用せず、基盤は [stack](index.md) の Void 方針に従う。ルーティング・SSR・認証は導入版と [TanStack 公式資料](https://tanstack.com/) で確かめる。

- Hono の責務と配置は [hono.md](hono.md)。データ取得と更新時のキャッシュ整合は [data-fetching](../../design/data-fetching.md) を正本にし、別の refetch 方針を重ねない。
- 読み込み・空・成功・失敗・再試行を区別し、製品が採用する Suspense / ErrorBoundary の境界を使う。既存の取得方式を理由なく別方式へ移さない。
- セッション表示と認可を区別する。クライアントのロール表示だけで権限を保証せず、サーバーで確認する。JWT・Cookie・ログインの独自実装例をコピーしない。
- Cloudflare の binding・実行環境・DB 接続は、現在の設定と導入版の公式資料に照合する。
- Storybook / MSW を使う場合は [UI の試験と表示例](../../../../test/references/storybook.md)。導入を全製品へ強制しない。

型を通すためのラッパーや二重検証を追加する前に、サーバーが公開する契約と導入版の型を調べる。未導入の道具の追加は [tools](tools.md) に従う。
