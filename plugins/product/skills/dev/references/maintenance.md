# Explicit maintenance and refactoring

挙動不変の整理、文書同期、構造変更、リファクタリングも、ユーザーが対象を明示した変更作業として`product:dev`で扱う。開発中に全体の保守候補を探索せず、探索は人間起動の`product:check`へ分ける。

## 構成拡張の承認境界

「再利用可能」「綺麗に分離」「ライブラリにして」だけから、新規workspace / package、独立配布物、version、公開APIを作らない。次の入力を区別する。

- 「ライブラリにして」: 現在の配布境界内での責務分離として解釈し、配置は確認する
- 「別製品でも使えるように」: 利用先、配布方法、version ownerが未定なら構成を作らない
- 「private workspace packageにして」: repository内package追加が明示されている
- 「npmで公開して」: 公開package、version、registry、release責任の確認が必要

新規packageや大量移動が明示された場合は、変更前後で対象fileを全数照合し、`package.json`、workspace設定、lockfile、import、test、CI / deploy、公開surfaceを同じ変更で整合させる。

確認済みfindingを直す場合も、finding全件を一括修正せず、選ばれたscope、受け入れ条件、挙動不変を証明するtestを固定してから変更する。
