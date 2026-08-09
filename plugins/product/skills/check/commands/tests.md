# tests — test portfolio health

test suite全体の価値、責任分担、重複、脆さを読み取り専用で検査する。

1. unit、Application / Domain、endpoint E2E、Journey E2E、smokeの責任を分類する
2. 同じ業務判断を複数層で再実装したtest、実装詳細だけを固定するtest、常に同じ結果になるtestを探す
3. skip、retry、sleep、過大snapshot、日時・順序・共有state依存、削除済み実装のtestを確認する
4. fixture / mockが実契約と乖離し、testだけが通る状態を確認する
5. test数やcoverage率だけで価値を判断せず、利用者契約とfailureを検出できるかで評価する

無駄なtest、重複責任、不足証拠、test infrastructure問題を分けて報告する。期待値やtestは変更しない。
