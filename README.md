# Agent Plugins

Interactive Inc. が公開する開発支援の拡張機能です。配布元の名前は `inta-agent-plugins`。

## inta

社内外共通の製品開発の手順です。対話から目的と制約を理解し、全体と細部を往復しながら実装・試験・記録を進めます。共通の開発基盤は `vp` と `void`。特定企業の非公開システムや認証を前提にしません。

| 呼び出し | 用途 |
| --- | --- |
| `inta:dev` | 対話を通じた継続開発 |
| `inta:test` | 変更に必要な試験と検証 |
| `inta:stack` | 技術基盤・配置・移行 |
| `inta:perf` | 性能問題の検証と修正 |
| `inta:docs` | 製品のHTML・PDF・README |
| `inta:check` | 人が起動する読み取り専用の点検 |
| `inta:maintain` | 人が起動する挙動不変の手入れ |
| `inta:env` | 人が起動する環境の確認・適用 |
| `inta:wordpress` | WordPress・PHPの更新 |
| `inta:orca` | 明示された課題実装の引き渡し |

詳しい用途と契約は [intaの説明](plugins/inta/README.md) を参照してください。

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

0.7.0では指示と参照構成を整理しました。スキル名と短いコマンドを維持し、重複したひな形を共通規約へ集約しています。Issue・PR のラベル、文書の書式、配置、検証の規約は残しています。

0.6.1では共通の正本へそろえ、旧 `bootstrap`・`agent-runtime`・`security`・`design` を廃止しました。開発は `dev`、基盤と初期構築の判断は `stack` を入口にします。既存の `.docs` や製品の指示は保持し、必要な規約だけを参照します。

別プラグインの `jobantenna` も登録されています。旧 `claude` は現在の配布仕様で予約名として拒否されるため一覧から外しました。両者の本体ファイルは今回変更していません。

## 保守

公開境界と検査は [CLAUDE.md](CLAUDE.md)、第三者資料の出典は [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) を参照してください。
