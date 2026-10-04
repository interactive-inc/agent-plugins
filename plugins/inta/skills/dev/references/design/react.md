# React

設計（構造・選択）に関する指針。

## 命名と構成

- コンポーネント名は技術用語（Container, Wrapper）でなくビジネス名（ProductCard, PaymentForm）
- children で composition する
- コーディング規約（Hooks禁止事項、shadcn/ui運用）は[code/react.md](../code/react.md)

## レンダリング戦略

- 社内ツール・管理画面 ⇒ SPA
- 公開ページ ⇒ SSR
- 完全静的サイト ⇒ SSG
- ISR は使わない

## 状態管理

- 単方向データフロー: Props は下へ、イベントは上へ
- 状態はレンダー中に導出する。useEffect は禁止 ⇒ [code/react.md](../code/react.md)
- データ取得は React Query のみ。queryOptions は使用側にインライン化し、queryKey は `$path()` から導出する ⇒ [data-fetching.md](data-fetching.md)
- Context はグローバル変数と同等。基本使わない
- Context を許可する用途: 多言語、認証状態、ユーザー情報のみ
- 複雑なコンポーネント内の Props Drilling 回避には使ってよい
- フォーム状態や UI の開閉は Context に入れない
- Context を使うなら Reducer と組み合わせる

## データ取得と境界

- useSuspenseQuery を第一選択とし、データを表示する最小のコンポーネントで呼ぶ。ページトップの hook で複数クエリを一括取得しない
- 独立した UI の島（カード・パネル・テーブル）ごとに Suspense + ErrorBoundary で囲み、1 クエリの失敗とローディングをその島に閉じ込める
- 形は 2 ファイル分割。ラッパーが境界（Suspense + ErrorBoundary）を持ち、body がクエリを呼ぶ
- シェルの境界はページ全体の最後の受け皿として 1 枚残す。ページの主役データはシェル境界で受ける（主役が無いまま周辺だけ生きた画面を作らない）
- queryClient の throwOnError はキャッシュにデータが無いときだけ true にする。背景 refetch の失敗で表示中の画面をエラーに変えない
- エラー表示の再試行は境界の reset と失敗クエリの reset を協調させる。境界だけ reset すると同じ error が即再 throw される
- 権限起因の 403 は境界へ落とす前に enabled でクエリ発行自体を条件化する

## Storybook と API モック

- 見た目を持つコンポーネントは Storybook に登録する。story はコンポーネントの隣に置く（co-location）
- 表示状態はデータあり・空・失敗の 3 状態を story として並べる。空と失敗を同じ見た目に潰さない
- データ取得を含むコンポーネントは MSW でモックする。ハンドラ定義はコンポーネントの隣に置き、story とコンポーネントテストで同じ定義を共有する（配線 ⇒ stack スキルの tanstack/storybook-msw.md）
- 登録しないのは装置系のみ: 到達ゲート、リダイレクト専用、Provider そのもの、ルートシェル、portal 前提のオーバーレイ。装置の見た目の本体は別コンポーネントに分離して登録する

## 状態の選択

- 単純な値 ⇒ useState
- 更新パターンが複数 ⇒ useReducer / [Reducer](reducer.md)
- 関連する値をまとめロジックを持たせたい ⇒ Value Object クラス
- 状態遷移のルールが決まっている ⇒ FSM クラス
