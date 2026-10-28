# TypeScript の実装

作成・変更前に [TypeScript preferences](../preferences/typescript.md) と [構造・分割](structure.md) を読む。表記の好みと、テスト容易性のための設計を分けて適用する。

外部入力はスキーマで検証し、業務判断は I/O から分離する。予想できる失敗は `T | Error` を返して `instanceof` で判別する。HTTP 境界の例外変換や予想不能な障害は [エラー方針](../design/error-handling.md) に従う。
