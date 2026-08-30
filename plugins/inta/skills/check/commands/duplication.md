# duplication — semantic duplication

文字列一致ではなく、同じ業務判断や契約が複数箇所で独立進化していないかを読み取り専用で検査する。

1. 計算式、状態遷移、権限集合、validation、mapping、error変換、config既定値を候補として列挙する
2. 名前が違う重複と、見た目が似ていて責務が異なる実装をcall pathとownerで区別する
3. copyされたtest helper / fixtureが別の期待値を持ち始めていないか確認する
4. frontend / API / workerなど複数boundaryに同じ判断が複製されていないか確認する
5. 共通化により依存方向や公開surfaceが悪化する候補は、統合推奨にしない

各findingに重複owner、差分、今後のdrift risk、共通化しない選択肢を示す。
