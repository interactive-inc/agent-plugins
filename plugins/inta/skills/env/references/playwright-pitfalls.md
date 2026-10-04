# Playwrightテスト作成・実行時のハマりどころ

実プロジェクトで複数のE2Eテストを整備した際に遭遇した修正パターン。プロジェクトを問わず同種の問題が起きやすい。

## 初回アクセス時の演出を回避する

オープニングアニメーション、ようこそモーダル、Cookieバナー等が初回アクセスで挟まると、テスト中の操作を遮断する。`context.addInitScript`でセッション開始前にフラグをセットする。

```ts
await context.addInitScript(() => {
  sessionStorage.setItem("opening-shown", "1")
})
```

- `page.evaluate`ではなく`context.addInitScript`を使う（`goto`より前にスクリプトが走るため取りこぼしがない）
- セッションストレージのキー名を間違えると効かない。実装側のキー名を確認する

## CSSのcomputed値はinline styleと異なる

`body.style.overflow = ''`で解除してもcomputed CSSでは`'visible'`が返る。`grid-template-rows: 1fr`もcomputedではpx値になる。

```ts
// 失敗する
await expect(page.locator("body")).toHaveCSS("overflow", "")
await expect(panel).toHaveCSS("grid-template-rows", "1fr")

// 通る
await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden")
await expect(content).toBeVisible()
```

`toHaveCSS`はcomputed値で比較される。特殊な値（空文字、fr単位、auto等）は不向き。挙動を見たいなら属性チェックや可視性チェックに置き換える。

## display: noneの要素はクリックできない

レスポンシブで非表示になるボタン（モバイル専用ナビ等）をPC幅でクリックしようとすると`element is not visible`でtimeoutする。

- 計画書側で「PCでは別ボタン」「SPでは同じボタン」のように振り分ける
- ビューポートに合わせて適切なセレクタを使う
- `force: true`で強引にクリックしない（実環境と乖離する）

## URLパターンの揺れ

`a[href^="/cases/"]`は`<a href="http://example.com/cases/01/">`にマッチしない（フルURLは`/`で始まらないため）。WordPressでは`home_url()`がフルURLを返すケースが多い。

```ts
// プロトコル付き URL にマッチしない
page.locator('a[href^="/cases/"]')

// どちらでもマッチ
page.locator('a[href*="/cases/"]')

// ナビの同じパスのリンクと混ざるので main 内に絞る
page.locator('main a[href*="/cases/"]')
```

## ヘッダー / フッターのリンクと本文を区別する

`a[href*="/cases/"]`のような曖昧なセレクタはヘッダー / フッター内の同じパスのリンクにもマッチする。親要素で絞り込む。

- `main a[...]`: 本文のみ
- `footer a[...]`: フッターのみ
- `nav[aria-label="..."] a[...]`: 特定ナビ

## コンテンツが未ビルドのページ

フロントエンドのビルドが完了していないとフォームフィールドが描画されないケース。テストは仕様通りに書いておき、実装が完成してから通る前提にする。または「タブのパネル切替が機能している」だけを検証して中身は不問にする等、検証粒度を分ける。

## test-resultsが親ディレクトリに出る

`outputDir`を明示しないと、Playwrightのデフォルトが`{testDir}/../test-results`を計算し、プロジェクト外に出てしまう。`playwright.config.ts`で必ず明示する。同梱のテンプレートでは設定済み。

```ts
outputDir: './specs/test-results',
```

## dialog.show()のESC処理

ネイティブ`<dialog>`を`showModal()`ではなく`show()`で開いている場合、ブラウザネイティブのESC閉じが効かず、実装側がkeydownを拾って閉じる構造になっているはず。グローバルキーボードイベントだとdialogにフォーカスが当たらず無視されることがある。

```ts
// 効かないことがある
await modal.focus()
await page.keyboard.press("Escape")

// 確実に dialog にイベントを届ける
await modal.press("Escape")
```

## モーダルオーバーレイのクリック位置

オーバーレイ要素はビューポート全体を覆うが、中央にはモーダル本体が乗っている。Playwrightの`click`はデフォルトで要素中央をクリックするので、オーバーレイのつもりでもモーダル本体に当たる。位置を指定する。

```ts
await overlay.click({ force: true, position: { x: 50, y: 50 } })
```

## Tabパネルの可視性

タブで切り替わるパネルが「中身が空（高さ0）だがhidden属性は外れている」場合、`toBeVisible`は失敗する（Playwrightはheight=0を非表示と見なす）。

```ts
// 中身が空だと失敗
await expect(page.locator("#panel-x")).toBeVisible()

// JS の責務である hidden 属性の有無を見る
await expect(page.locator("#panel-x")).not.toHaveAttribute("hidden")
```

## スクロールが必要な要素のクリック

ページ末尾にあるボタン等はviewport外にあると`element is not visible`で失敗する。

```ts
const btn = page.locator(".target")
await btn.scrollIntoViewIfNeeded()
await btn.click()
```

ただし「PCで見えないボタン」をSPで見えるようにスクロールする、のような誤った修正にならないよう、まず本当に存在すべき要素か確認する。
