# api — API contract差分とconsumer影響を検証する

`/product:test api [base..head|PR|scope]`は、HTTP APIのpath、method、request、response、status、認証契約を比較し、破壊的変更とconsumerへの影響を報告する。検証だけの依頼では仕様、code、PRを変更しない。

## 手順

1. 比較基点とscopeを解決し、対象リポジトリの公開API、内部API、versioning規則を確認する
2. OpenAPIなどの機械可読な正本と既存contract checkerがあれば最優先する。無ければroute、schema、handler、endpoint testからcontractを復元する
3. method / path、path・query・body、required / optional、response field / type、status code、認証・認可の変更を比較する
4. 次を破壊的変更候補として抽出する
   - endpointまたはfieldの削除・rename
   - required inputの追加、許容値の縮小、型の非互換変更
   - response typeまたはstatus semanticsの変更
   - 認証要件の強化、consumerが依存するheader / pagination / error contractの変更
5. client、SDK、別package、別repositoryなど確認可能なconsumerを検索し、call siteと実際の影響を確認する。見つからないconsumerを「影響なし」と断定しない
6. endpoint / contract testを実行し、静的な型差分とruntime behaviorを分ける

## 報告

- comparison、contract source、対象endpoint数、未検査consumer
- breaking / compatible / ambiguousを分けた変更一覧
- 影響するconsumer pathと必要な移行
- 実行したtest、失敗、未実行

PR commentや外部通知は明示依頼がある場合だけ行う。
