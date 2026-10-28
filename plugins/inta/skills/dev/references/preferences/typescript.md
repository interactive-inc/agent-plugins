# TypeScript の preferences

目的は表記の選択肢を減らし、同じ意味のコードに不要な差分を出さないこと。`.ts` / `.tsx` の作成・変更前に読む。

| ID | 統一する書き方 |
| --- | --- |
| TS01 | re-export 禁止。`export * from`、`export { ... } from`、import して再公開するだけの barrel を作らず、定義元から直接 import する。ライブラリの公開エントリだけ例外。 |
| TS02 | import は `@/` の絶対パス。相対パス禁止。未設定の製品は alias の実在・解決設定を確認して整える。外部 package の参照は package 名を使う。 |
| TS03 | static import のみ。動的な `import()` とインライン型 import 禁止。型はファイル冒頭の `import type` にする。 |
| TS04 | 型定義は `type` のみ。`interface`・`enum` 禁止。検証スキーマに対応する型は Zod の `z.infer` で導出する。 |
| TS05 | 不明な入力は `unknown`。`any` と `as` による強制変換は禁止。`as unknown as T` は原因を調べても境界を表せない最終手段とし、理由を残す。 |
| TS06 | 値が無いことは `null`。空文字や optional で代用せず、`string | null` など明示する。外部 API の契約は境界で扱う。 |
| TS07 | 名前を省略せず、`data`・`result`・`items` のような意味の薄い汎用名を避ける。配列は複数形、Boolean は `is` / `has` / `can`。 |
| TS08 | ファイル内の単一の入力型・依存型は `Props` / `Deps`。不要な class 名の接頭辞を付けず、公開時に名前が衝突する場合だけ具体化する。 |
| TS09 | 変換は `with*()`、出力は `to*()`、取得は `get*()`。DB 操作など別の明示命名があるものはその規約に従う。 |
| TS10 | 変数宣言は `const` のみ。object・array・引数での分割代入は禁止。必要な値は名前付きの参照や添字で読む。static import の named binding は分割代入に含めない。 |
| TS11 | 繰り返しは `for-of`、分岐は早期 return と `if`。`switch` 禁止。ただし Reducer の Action 分岐は exhaustive switch。ユースケース選択に三項演算子を使わない。 |
| TS12 | 処理同士に空行を1行入れる。関数本体など浅い2段目まで適用し、3段目以降の深い処理は詰める。 |
| TS13 | 関数・class の説明コメントは JSDoc (`/** ... */`)。`@param`・`@return`、自明な役割ラベルは書かず、名前だけでは分からない意図・制約を残す。Application class は対象と操作を自然な日本語で説明する。 |

1ファイル1関数／1クラスと `utils.ts`・`types.ts` の例外、引数・関数長・不変性は [構造の方法論](../code/structure.md)。
