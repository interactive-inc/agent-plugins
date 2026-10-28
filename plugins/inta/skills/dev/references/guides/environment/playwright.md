# Playwright の導入

`env apply` で E2E 環境を追加するときに読む。既存環境があれば拡張し、設定や agent を二重導入しない。

## 設定

- 対象 URL、利用者ロール、既存 runner・設定・テストデータを確認する。リポジトリから分かることは聞き直さない。
- 新しい依存・browser runtime・MCP の追加は対象リポジトリの承認範囲に従う。依存は [stack](../stack/index.md) の `vp install` 方針を使う。
- 既存の配置がなければ `specs/` を E2E 用に使い、unit runner の探索から除外する。[設定例](assets/playwright.config.ts) は必要部分だけ統合し、baseURL を実際の対象へ合わせる。
- [ignore の例](assets/specs.gitignore) を参考に、report・trace・認証状態・一時生成物を Git 管理から除く。認証情報は本文や fixture に書かない。

## 公式 test agent を使う場合

planner / generator / healer は任意。導入済み Playwright の help と [公式資料](https://playwright.dev/docs/test-agents) で対応 client と生成方法を確認する。生成前に既存の MCP・seed・agent 定義への影響を確認し、既存設定を保持して統合する。プラグイン内へ生成物の手書きコピーを持たない。

テスト計画には既存仕様へのリンク、対象 URL・ロール、fixture、操作と期待結果、保存先、外部送信の許可範囲を渡す。既存の正本を丸ごと別の中間仕様書へコピーしない。共有 browser 状態を操作する agent は競合させない。

## 実行確認

代表的な正常系と失敗系を実行し、test が探索されること、URL と認証、report の保存先、失敗 trace を確かめる。version 表示や設定ファイルの存在だけで導入完了にしない。生成後の試験は [inta:test](../../../../test/SKILL.md) の責任分担に従う。

locator は利用者の操作に近いものを選び、viewport・初期モーダル・データの前提を明示する。失敗を force click、期待値の緩和、無条件 skip で隠さず、実装・試験・環境の問題を切り分ける。必要な回避策は対象製品の試験設定へ短く残す。
