# architecture — dependency and boundary health

architecture、特にDDDの境界と依存方向が複雑化していないかを読み取り専用で検査する。

1. module / workspace / package / layerと、その実import・call・data ownershipを列挙する
2. Interface → Application → Domain → Infrastructureの依存方向、循環、逆流、境界越しの直接DB / external I/Oを確認する
3. Domain間の相互依存、共有mutable state、巨大aggregate、Applicationを跨ぐtransactionを確認する
4. 単純CRUDの過剰抽象化と、複数業務判断が一箇所へ集まりすぎた状態の両方を見る
5. Application層がある場合は全ユースケースを機械検索し、定義とcall pathを読んで次を反証する。確認できたものはstructure candidateではなく`rule violation`とする
   - 一つのproduction fileまたはclassに複数の公開操作がある
   - `action` / `operation` / `mode`などで、作成・更新・削除、承認・却下など別操作を切り替えている
   - `Write` / `Save` / `Upsert` / `Manage` / `Process` / `Handle`など、完了後の状態を特定できない総称をユースケース名にしている
   - 一つのユースケースクラスが、意味の異なる複数routeまたはcommandから共有されている
   - Applicationクラスが別のApplicationクラスを呼び、分割した操作をFacadeや共通writerへ再統合している
   - ユースケース選択をネストした三項演算子で書いている
   - ApplicationクラスのJSDocが、対象と操作を自然な日本語で説明せず、層名や永続化方式だけを説明している
6. generated code、framework entrypoint、公開API、意図されたadapterを除外して反証する

図の美しさではなく、変更理由、ownership、failure境界が混線している証拠をfindingにする。Application違反の修正案は、操作ごとの具象クラスへ分け、共通の業務規則をDomain、I/OをInfrastructureへ置き、Applicationの統合クラスを残さない。
