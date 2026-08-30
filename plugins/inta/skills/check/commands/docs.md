# docs — documentation consistency check

`/inta:check docs [scope]`はREADME / `.docs`と実装、および文書graphを読み取り専用で点検する。

## Scope

- 引数なし: README、agent向け指示、`.docs`、manifest、設定と実装の全対象
- `features` / `schema` / `roles`: 指定領域
- path / feature ID: 指定範囲と直接の参照元・参照先

## 手順

1. 対象リポジトリの規約、README / agent向け指示、`.docs`構造、比較基点、既存checkerを確認する
2. 文書から実装状態、機能、path、command、環境変数名、URL、role、table / columnなど検証可能な主張を抽出し、route、Application、authorization、schema、migration、config、live data接続と突合する
3. route / page / ApplicationとFeature文書を突合し、code only、docs only、mismatch、duplicate、granularityを確認する
   - 独立して仕様と受け入れ条件を検品できる業務能力を1 Featureとし、単独のinput / button / label / 遷移 / 装飾をFeatureにしない
   - 計算式、data source、権限、不変条件が違う能力は別Feature候補とする
   - 複数Featureを横断する利用者完了条件はStoryとして確認する
4. `[[wikilink]]`を既存resolverで解決し、unresolved、orphan、closed cycle、ambiguous、style driftを確認する
5. 各候補を反証し、具体的な文書と実装の証拠が揃わないものを棄却する

最終更新日の古さだけをdriftの証拠にしない。新しい文書でも誤り得て、長期間変わらない正しい文書もあるため、現在の実装・設定・リンクとの不一致で判定する。

## 出力

検査scope、比較基点、確認数、確定した乖離、棄却数、未検査範囲を報告する。各findingには文書と実装のpath、差、推奨する正本を示す。文書の同期、link修正、削除は行わない。
