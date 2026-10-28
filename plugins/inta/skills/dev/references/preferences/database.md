# DB の preferences

製品の呼び方やコンセプト変更で schema の差分を増やさないため、DB の名前を統一する。

- テーブル名は複数形の snake_case、カラム名も snake_case。
- UI 固有の呼称を schema に持ち込まず、表示名が変わっても残せる汎用名を使う。利用者の呼び方が違ってもテーブルは `users` などにする。
- `info`・`metadata`・`data` のように具体的な複数形にできない名前を避け、粒度を分けて表す。

既存 DB の rename は単なる書式修正とせず、migration・consumer・運用への影響を判断する。削除・履歴の方法論は [database design](../design/database.md)。
