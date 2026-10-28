# React の設計

単方向のデータフローを保つ。Props は下へ、イベントは上へ流し、表示から計算できる値を重複した状態として保存しない。書き方・Hooks・Context の選択は [preferences](../preferences/react.md) を正本にする。

## 状態と描画

単純な値は `useState`、更新パターンが複数なら Reducer、関連する値と判断は Value Object、順序を制約するなら FSM を使う。[状態の表現](state-modeling.md) に従い、画面から独立して試験する。

新規 Web 製品は [stack](../guides/stack/index.md) の Void 方針と導入版の取得・更新方式を使う。既存の React Query + Hono RPC 製品は [data-fetching](data-fetching.md) にそろえる。新たな取得方式を重ねない。

## データ取得と境界

React Query 製品では `useSuspenseQuery` を第一選択とし、データを表示する最小の部品で呼ぶ。ページ上部で独立したクエリをすべて一括取得しない。

- 独立するカード・パネル・テーブルごとに Suspense + ErrorBoundary を置く。ラッパーが境界を持ち、別ファイルの body が取得を行う。
- ページの主役データはページシェルの境界で受け、主役なしで周辺だけ表示しない。
- キャッシュにデータがある background refetch の失敗で、表示中の内容をエラー画面へ変えない。
- 再試行は ErrorBoundary と失敗した query の reset を協調させる。
- 権限上発行できない query は、利用者情報に応じ `enabled` 等で条件化する。サーバーの認可は必ず残す。

## 表示例

見た目を持つ部品は Storybook に登録し、story と MSW handler を部品の隣に置く。データあり・空・失敗を分け、部品試験とハンドラを共有する。

到達ゲート・リダイレクト・Provider・route shell・portal の装置部分は登録対象外とし、見た目の本体を分離して登録する。独立した導入・移行が必要な既存製品では範囲を決め、未提供を暗黙に合格扱いしない。配線と検証は [storybook](../../../test/references/storybook.md)。
