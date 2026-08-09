# Patrol procedure

## Route の実在確認

- sidebar / nav の実 link を列挙し、候補 path と照合する
- ID を含む path は list API などから実 ID を取得し、hardcoded ID や placeholder を使わない
- route 不在や対象 role に本来許可されない画面はバグにしない
- link が表示されるのに権限エラーになる、または実 ID で失敗する場合だけ候補にする

## 巡回

- role ごとに session を分離し、保存済み state を復元する
- 24時間以内の visited path は後回しにする
- 各遷移直後と network idle 後に console、errors、4xx/5xx の差分を見る
- snapshot で主要領域と空画面を確認し、視覚判断が必要なら screenshot / computed style を使う
- toast など一時 UI は操作直後と短い待機後に DOM を確認する

## 反証

- 別の実データや入力でも再現するか確認し、seed や単一データだけの不整合を切り分ける
- 疑わしいだけ、再現不能、期待仕様が不明なものは起票しない
- 類似の open bug Issue を検索し、重複なら起票しない

## 起票と終了

- タイトルは `[bug] {role} {path} で {現象}`
- 本文に再現手順、期待、実際、console / network、screenshot、環境を含め、個人情報を残さない
- `bug` と `auto-found` label を付ける
- visited に日時、role、path、Issue番号、state更新時刻を追記する
- state を保存して session を閉じる
- 1 iteration につき起票は最大1件
