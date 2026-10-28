# Database Design

命名の preferences は [database](../preferences/database.md)。

## Deletion

- 物理削除が正。論理削除（`deleted_at` / `is_deleted`）は負債
- 理由: すべてのクエリに削除フィルタが必要になり、ユニーク制約・外部キー・集計が壊れる
- 例外: 監査要件・復元要件がある場合のみ、選択肢として採用可。採用時は負債と認識する
- 履歴が必要なら別テーブル（`*_archives` など）に移送する
