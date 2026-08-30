# Storybook story 量産の執筆規律

数百件規模で story を追加するときの、実測で確立した検査観点と罠。個別の配線は [storybook-msw.md](storybook-msw.md) を参照。

## フィクスチャの業務精度

typecheck はもっともらしい捏造を捕まえない。量産時の最多の誤り筋はここに出る。

- マスタ値（シフト帯・職種・単価・単位数）は seed / マスタ定義と突合する。値を発明しない
- 導出値（合計・割合・レイアウト座標）は手書きせず、production の計算ヘルパを実際に実行して作る。内訳と合計が矛盾した表は嘘のカタログになる
- エラー文言はサーバ / バリデーションが実際に出す文字列だけを使う。もっともらしい創作文は「正しく見える」ぶん有害
- 週・月・曜日の起点は production ヘルパの定義に合わせる（日曜起点か月曜起点かを確認する。1 列ずれた月グリッドは目視でも気づきにくい）
- 共有 identity（デモ人物・施設名）は 1 つの sample-data モジュールに収斂させる。隣接 story で同じデモ利用者が別人になるのを防ぐ

## 型が詰まったときの分岐（優先順）

- `satisfies Meta<typeof X>` が nullable コールバック args で詰まる → `const meta: Meta<typeof X> = {...}` の型注釈に切り替える（副作用が最小）
- 判別 union / 自前 `render` prop で args 推論が never に潰れる → `meta.component` を省略し、理由をコメントで固定する。ラッパーコンポーネント化は autodocs が偽の props 表を出すので選ばない
- controller（hook の戻り値）を受けるコンポーネント → `ReturnType<typeof useXxx>` で型注釈したスタブを作る。シグネチャ変更でコンパイルエラーになり、黙って腐らない
- controller が肥大（数十フィールド・mutation 混在）でスタブが捏造になる → story の render で実 hook を駆動するか、B 群（MSW 経由）へ送る。リテラルの丸写しはしない

## Storybook の仕様の罠

- meta と story の decorator は「置換」でなく「合成」される。story 側で table を張ると meta 側の tr の内側に入れ子になる。文脈系 decorator は meta 側 1 箇所に集約する
- CSF Next（definePreview）では `parameters.msw` が黙って無視される。ハンドラは `beforeEach({ msw })`
- story 名に `Error` を使わない（モジュール全域でグローバル Error を隠す）
- `new Date()` / `Math.random()` を使わない。日付は固定リテラル

## smoke ゲートとの整合

全 story レンダリング検査（smoke ゲート）を敷いている前提での作法。

- null を返す状態（閉じたダイアログ・空で非表示のカード）は story 化しない。ゲートは空描画を fail と数える
- Suspense 境界を story 側で補うときの fallback は必ず null にする。fallback が何か描くと、ハンドラが壊れて永久 suspend しても緑になり検査が骨抜きになる
- ポータル系（dialog / drawer / sheet）は開いた状態を story で固定する。ゲートは body 直下のポータル描画も「描画された」と数える

## フィクスチャ忠実度（fidelity）の検査 3 点

MSW 付き story の量産で最も効いたレビュー観点。どれも typecheck と smoke ゲートでは捕まらない。

- 実装が出せる値の組か。フックが純粋ビルダから導出する値は story でも同じビルダを通す。「職員 0 名なのに平均 2.4」のような組は型が通っても嘘になる
- そのロールでその画面に到達できるか。ルートの分岐（権限による コンポーネント選択）まで見る。到達に必要な権限キーが揃った合成プリセットを drift テスト付きで作る
- client-parse するコンポーネントは応答完全形か。境界エラーの描画も「何か描けた」として smoke を通る。欠けたキーは境界エラーとして静かに固定される

controller 型が広いコンポーネントは、リテラルスタブ（時計依存フック向け）と「実 hook を MSW の上で駆動する story 用 harness」（時計非依存向け）を使い分ける。どちらも無理ならコントローラの props 分解リファクタが先。

## 検証の分担

- 全件の描画到達はゲートに委ね、実ブラウザ目視は「表示の意味が問われるもの」だけに絞る（ダイアログの分岐、グリッドの起点、チャートの系列、金額の整合）
- 受け入れ側のサンプリングで story ID を推測しない。`storybook-static/index.json` から実 ID を引く
