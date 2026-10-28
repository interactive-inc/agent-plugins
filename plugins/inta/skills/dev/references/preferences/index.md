# Preferences — 差分を増やさないための統一

同じ意味のコードを好みで書き換えないための規約。技術的な優劣を主張する一般論ではなく、書き方を固定し、生成するコードとレビューの差分を安定させる。簡潔化するときも個々の規則と例外を失わない。

- TypeScript は [typescript.md](typescript.md)。React は加えて [react.md](react.md)。
- 物理配置と命名は [stack](../guides/stack/index.md)、DB の名前は [database](database.md)、値の suffix は [value-object](../design/value-object.md)。
- 文書の書式は [文書規約](../docs/index.md)・[文章規約](../docs/writing-rules.md)、Issue・PR は [issue-pr](../tools/issue-pr.md) が正本。ここへ複製しない。

対象製品に別の明示規約があればそちらを優先する。既存コードが違うという理由だけで、この preferences を任意扱いにしない。基盤の必須契約・生成物との衝突は確認して例外を記録し、暗黙に緩めない。

テスト容易性・責務・ファイル分割の方法論は [code/structure](../code/structure.md) と [design](../design/architecture.md) に分ける。好みを変える変更と、振る舞いを改善する変更は区別する。
