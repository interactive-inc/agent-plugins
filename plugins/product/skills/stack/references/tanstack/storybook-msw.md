# Storybook + MSW

React のコンポーネント開発では Storybook と MSW を標準で入れる。API モックのハンドラ定義 1 つを story とコンポーネントテストで共有し、fetch → hc client → queryFn の実経路を通したまま表示状態を再現する。

```bash
bun add -d msw msw-storybook-addon
bunx msw init .storybook/public
```

## 配線

- service worker は `.storybook/public/mockServiceWorker.js` に生成し、`main.ts` の `staticDirs: ["./public"]` で Storybook にだけ配信する。アプリの `public/` に置かない（製品ビルドへの混入防止）。`package.json` の `msw.workerDirectory` も同じ場所を指す
- `preview.tsx` で `msw-storybook-addon` の addon を登録し、story ごとに独立した `QueryClientProvider`（`retry: false`）を decorator で配る。キャッシュを story 間で共有しない
- QueryClient のインスタンスは decorator 内の `useState` 初期化子で mount 単位に固定する。render ごとに `new QueryClient()` すると、suspend する story で「suspend → 再描画 → 空キャッシュで再フェッチ」の無限ループになる（実測で毎秒約 1200 リクエスト）。story 切替は decorator ごと remount されるので独立性は保たれる
- 両方 devDependencies。production ビルドの成果物に MSW が含まれないことを一度確認する

## ハンドラ共有の型

コンポーネントの隣に `{resource}-msw.ts` を置き、応答を引数に取るハンドラ関数を export する。story とテストが同じ関数を import し、正常系・空・失敗をデータの差だけで表現する。

```ts
export function residentRevisionsHandler(revisions: Revisions) {
  return [
    http.get(PATH, () => HttpResponse.json(revisions)),
    http.get(`*${PATH}`, () => HttpResponse.json(revisions)),
  ]
}
```

相対パスと `*` 前置の両形を必ず登録する。`msw/browser`（Storybook）は same-origin の相対 URL、`msw/node`（テスト、happy-dom の location で絶対 URL 化）は wildcard 形だけが当たる。片方だけだと素通りして実 API を叩く。

## story 側

CSF Next（`definePreview`）では `parameters.msw` は黙って無視される。ハンドラは `beforeEach` で渡す。

```ts
export const Default: Story = {
  beforeEach(context) {
    context.msw.use(...residentRevisionsHandler({ items: [...] }))
  },
}
```

## テスト側（Bun Test）

`msw/node` の `setupServer` は Bun のネイティブ fetch を横取りできる（実測済み、回避策不要）。

- `server.listen({ onUnhandledRequest: "error" })` にする。ハンドラの URL 誤りを「空データで緑」に化けさせない
- happy-dom の登録は `GlobalRegistrator.register({ url: "https://app.test/" })` と url を明示する。location が無いと相対パス fetch が Invalid URL で落ちる
- `afterEach` で `server.resetHandlers()`、テスト用 `QueryClient` は `retry: false`

## 検証の罠

`build-storybook` が通っても story が全部エラー状態で描画されていることがある（モックが当たらず実 API に落ちるケース）。導入時は必ず実ブラウザで story を開き、正常系がモックのデータで描画されることを見る。

## story smoke ゲート

story が増える前に、built Storybook の全 story を Playwright で開いてレンダリングエラーを検出するゲートを敷く。`build-storybook` はバンドルの成否しか見ないため、実行時エラーの検出には実ブラウザが要る。公式 test-runner は Jest 前提なので素の @playwright/test で自作する（index.json を同期読みして story を列挙）。実測で得た設計要点:

- 全 story を 1 test の直列ループにしない。CI ランナーはローカルの約 3 倍遅く、900 story 規模で test timeout を超える。50 story 程度のチャンク × fullyParallel に分割する
- fail 条件は 4 種の複合: iframe.html の非 200（静的サーバの 404 本文を「描画済み」と誤判定する穴を塞ぐ）、pageerror、Storybook のエラー表示（body の `sb-show-errordisplay`）、描画結果が空。「最初に何か出た」直後に 1 tick の猶予を置いて遅延 throw を拾う
- 描画完了の終端は DOM の実描画を待つ。Storybook の body クラスは付け替えでなく積み上げ式で、`sb-show-main` は React の描画完了より前に付くため終端判定に使えない
- 並列負荷で描画待ちを食い潰した story が「空描画」に誤判定される。renderedNothing 判定だけ描画待ち 2 倍で 1 回再検査する（同じ待ち時間での再検査は再 timeout し得る、実測済み）
- 導入時点の既存の壊れは story ID + 症状の対で除外表に載せ、「直ったのに表に残っている」「表の story が削除された」の両方を fail にする stale 検出を付ける。検出力は mutation（故意に壊して fail を確認）で証明する
