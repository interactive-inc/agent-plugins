# CLAUDE.md

このリポジトリは、Agent Plugins v1、Claude Code、OpenAI / Codexから利用できる公開プラグインマーケットプレースです。

## オープンソースとしての公開境界

すべてのプラグイン、スキル、エージェント、スクリプト、設定、文書、例示は、非公開の社内資源がなくても理解・実行できる内容にする。

- 社内情報、顧客情報、非公開のプロジェクト名・仕様・Issue・識別子・データ・URL・リポジトリ・文書を書かない
- 社内システム、社内API、社内MCPサーバー、社内SaaS、社内ネットワーク、社内認証を前提にしない
- 社内専用CLI、そのコマンド、設定、環境変数、認証方法、個人のローカルパスを書かない
- 社内実装を元にする場合は公開可能性を確認し、汎用的または架空の名前・データへ置き換える
- 秘密情報、個人情報、非公開データを例やfixtureへ含めない
- 第三者のコードや文書を使う場合は、公開に必要なライセンス、著作権表示、出典を確認する
- 社内資源が必要な機能はこのリポジトリへ追加せず、社内リポジトリ側に保持する

## 正本と互換層

プラグイン本体は `plugins/<plugin-name>/` に置く。`inta` の構造は次の通り。

```text
plugins/inta/
├── plugin.json                 # Agent Plugins v1 manifest
├── .codex-plugin/plugin.json   # OpenAI / Codex manifest
├── .claude-plugin/plugin.json  # Claude Code manifest
├── skills/                     # Agent Skills準拠の共通正本
└── agents/                     # Claude Code固有の軽量エージェント
```

- `skills/` を業務フローの唯一の正本とし、クライアント別に内容を複製しない
- 共通 `SKILL.md` のfrontmatterはAgent Skills仕様のフィールドだけを使う
- Claude Code固有のAgentは `agents/`、Codex固有の表示・起動設定は各Skillの `agents/openai.yaml` に閉じ込める
- スクリプトは、そのスクリプトを所有するSkillの `scripts/` に置く。リポジトリ直下へ共通script置き場を作らない
- Agent Plugins v1で可搬なのは主に `skills/` と `mcp.json`。クライアント固有要素は可搬部分の依存条件にしない

## マーケットプレース

- マーケットプレース名: `inta-agent-plugins`
- Claude Code: `.claude-plugin/marketplace.json`
- Codex: `.agents/plugins/marketplace.json`
- 各marketplaceのsource: `./plugins/<plugin-name>`
- プラグイン名、version、description、sourceは各manifest間で同期する
- GitHubリポジトリ: `interactive-inc/agent-plugins`

新しいプラグインを追加するときは、独立した `plugins/<plugin-name>/` を作り、必要な3manifestと両marketplace entryを追加する。

## Inta pluginの設計境界

- `bootstrap`: 新規・既存リポジトリの初期設計と開発baseline
- `dev`: 会話を前提にした通常の機能開発・修正・仕様変更・deliveryの統一入口
- `check`: 人間が起動する読み取り専用の定期検診。開発中に自動起動しない
- `test`、`docs`、`env`、`stack`、`security`、`wordpress`: 開発中に必要時だけ読む専門能力。人間から明示的にも呼び出せる
- `agent-runtime`: Claude Code Agentだけの役割差。一般的な開発手順は `dev` に委ねる

Agentはモデル・権限・委譲先・失うと危険な境界だけを持つ軽量な定義にする。反復する手順や専門知識はSkillへ置き、Agent本文は60行以内を維持する。

## 変更時の検証

最低限、変更範囲に応じて次を実行する。

```bash
bun plugins/inta/skills/dev/scripts/validate-skills.ts
claude plugin validate .
for plugin_dir in plugins/*; do claude plugin validate "$plugin_dir"; done
for plugin_dir in plugins/*; do
  python3 /path/to/plugin-creator/scripts/validate_plugin.py "$plugin_dir"
done
git diff --check
```

加えて、`plugins/inta/plugin.json` はAgent Plugins v1 schema、各 `SKILL.md` はAgent Skillsの公式validatorで検証する。公開前には社内依存・秘密情報・第三者ライセンスも再確認する。
