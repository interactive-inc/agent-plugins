# React の実装

作成・変更前に [React preferences](../preferences/react.md) と [TypeScript preferences](../preferences/typescript.md) を読む。構造は [分割・テスト容易性](structure.md)、状態と取得の境界は [React の設計](../design/react.md) に従う。

読み込み・空・失敗・成功と重要な操作完了を試験する。mutation の失敗は `onError`、外部呼び出しの例外は `try-catch` と `instanceof Error` で扱い、失敗を空表示へ潰さない。

shadcn の生成物の型エラーは原因と導入版の対応を調べる。更新待ちや検査除外が必要なら対象・理由・未検証を報告し、検査を通したことにしない。
