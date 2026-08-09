# architecture — dependency and boundary health

architecture、特にDDDの境界と依存方向が複雑化していないかを読み取り専用で検査する。

1. module / workspace / package / layerと、その実import・call・data ownershipを列挙する
2. Interface → Application → Domain → Infrastructureの依存方向、循環、逆流、境界越しの直接DB / external I/Oを確認する
3. Domain間の相互依存、共有mutable state、巨大aggregate、Applicationを跨ぐtransactionを確認する
4. 単純CRUDの過剰抽象化と、複数業務判断が一箇所へ集まりすぎた状態の両方を見る
5. generated code、framework entrypoint、公開API、意図されたadapterを除外して反証する

図の美しさではなく、変更理由、ownership、failure境界が混線している証拠をfindingにする。
