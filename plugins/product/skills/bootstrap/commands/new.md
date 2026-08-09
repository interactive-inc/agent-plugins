# new — new product bootstrap

1. 利用者、解決する問題、主要journey、対象外、運用・security・delivery制約を確定する
2. capability、Domain、Application、Interface、Infrastructureの境界とdata ownershipを、必要な複雑さだけで決める
3. runtime、framework、storage、deployment、test toolを既存標準と制約から選ぶ。未承認packageを追加しない
4. workspace、entrypoint、config、環境変数example、CI、test、docsの最小scaffoldを作る
5. build / typecheck / test / local起動のbaselineを実行し、未確認を分ける
6. 初期判断を短いarchitecture / decision文書へ残し、最初の機能開発を`product:dev`へ渡す

サンプル機能、将来用workspace、抽象基盤、公開packageを雛形の都合で追加しない。
