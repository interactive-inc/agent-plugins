# Agent Plugins

Interactive Inc. が公開する開発支援の拡張機能です。配布元の名前は `inta-agent-plugins`。

## inta

社内外共通の製品開発の手順です。対話から目的と制約を理解し、全体と細部を往復しながら実装・試験・記録を進めます。共通の開発基盤は `vp` と `void`。特定企業の非公開システムや認証を前提にしません。

| 呼び出し | 頼みたいこと |
| --- | --- |
| `inta:dev` | 作りたい・直したい・相談したい |
| `inta:review` | 既存レビュー・PR レーンの判定と設定 |
| `inta:check` | 問題や抜けがないか点検してほしい |
| `inta:refactor` | 動作を変えず、書き方と構造をそろえてほしい |
| `inta:test` | ちゃんと動くか確かめてほしい |

性能・基盤・環境・WordPress などの専門手順は、AI が必要に応じて読むガイドにまとめています。人は `dev` に目的を伝えれば進められます。README と開発文書の更新も `dev` に含みます。

詳しい用途と契約は [intaの説明](plugins/inta/README.md) を参照してください。

`inta:review` または `inta:dev` に「PR レーンを設定して」と伝えると、製品のマージ方針を設定できます。dev は PR 操作前に review の分類を呼び、通常は検査後に人のレビューを待たずマージし、共有は論点を残して進めます。DB・事業・専門技術の判断が必要な変更は要確認へ分けます。対象製品ごとの許可と条件を設定して使います。

## 導入

Claude Code:

```text
/plugin marketplace add interactive-inc/agent-plugins
/plugin install inta@inta-agent-plugins
```

Codex:

```sh
codex plugin marketplace add interactive-inc/agent-plugins
codex plugin add inta@inta-agent-plugins
```

`plugins/inta/plugin.json` は Agent Plugins形式、`.claude-plugin/plugin.json` と `.codex-plugin/plugin.json` は各クライアントの配布定義です。手順本体は一つで、呼び出し制御等のクライアント固有の設定は対応するクライアントで適用します。

## 旧版からの変更

0.9.0では人向けの入口を4つへ整理しました。旧 `stack`・`env`・`perf`・`wordpress`・`orca`・`maintain` はガイドへ統合し、独立コマンドとしては提供しません。旧 `docs` の README 更新は `dev` へ統合し、HTML・PDF の配布資料生成は公開プラグインから外しました。自動転送はありません。

好みの preferences、分割・テスト容易性の方法論、Issue・PR のラベル、標準配置と文書規約は維持しています。

別プラグインの `jobantenna` も登録されています。旧 `claude` は予約名で登録できないため一覧から外しています。これらの本体ファイルは今回変更していません。

## 保守

公開境界と検査は [CLAUDE.md](CLAUDE.md)、第三者資料の出典は [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) を参照してください。
