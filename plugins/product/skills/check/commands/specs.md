# specs — specification consistency

仕様書同士、および仕様・Application・test・利用者journeyの接続を読み取り専用で検査する。

1. 対象repositoryの仕様配置、ID記法、Application境界、test marker、既存checkerを確認する
2. Feature / Story、業務判断のowner、Feature test、Journey受け入れ証拠をIDまたは安定した識別子で結ぶ
3. 重複ID、文書なし実装、実装なし文書、矛盾した状態・権限・計算・失敗条件を確認する
4. 開始、成功、失敗、再試行、競合、期限・旧dataの反例を構成し、実装とtestの意味を照合する
5. symbol名やpathの差だけを仕様矛盾にせず、利用者から見た契約差で確定する

接続異常、潜在仕様bug、coverage不足、製品判断が必要な曖昧さを分けて報告する。
