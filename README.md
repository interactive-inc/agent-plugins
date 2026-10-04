# Agent Plugins

Interactive Inc. が公開する、製品開発向けのエージェントプラグインマーケットプレースです。

マーケットプレース名は `inta-agent-plugins` です。このREADMEでは `inta` を案内します。スキルは [Agent Skills](https://agentskills.io/) を共通正本とし、次の3形式を同じパッケージで提供します。

- [Agent Plugins v1](https://agent-plugins.org/): `plugins/inta/plugin.json`
- [Claude Code plugins](https://code.claude.com/docs/en/plugins-reference): `plugins/inta/.claude-plugin/plugin.json`
- [OpenAI plugins](https://developers.openai.com/plugins/build/plugins): `plugins/inta/.codex-plugin/plugin.json`

## インストール

### Claude Code

Claude Code の `/plugin` からマーケットプレースとプラグインを追加します。

```text
/plugin marketplace add interactive-inc/agent-plugins
/plugin install inta@inta-agent-plugins
```

### Codex

Codex CLI からGitHubマーケットプレースとプラグインを追加します。

```bash
codex plugin marketplace add interactive-inc/agent-plugins
codex plugin add inta@inta-agent-plugins
```

以前の `product@interactive-claude-plugins` または `product@inta-agent-plugins` を使っていた場合は、新しい `inta@inta-agent-plugins` をインストールしてください。

### Agent Plugins対応クライアント

リポジトリ内の `plugins/inta` がAgent Plugin本体です。対応クライアントからこのディレクトリまたはGitリポジトリを指定してください。利用できるインストール方法はクライアントごとに異なります。

## Inta plugin

人間が選ぶ主な入口は次の4つです。

| スキル | 用途 |
| --- | --- |
| `inta:bootstrap` | 新規・既存リポジトリの初期設計と開発baseline |
| `inta:dev` | 会話を前提にした機能開発、修正、仕様変更、delivery |
| `inta:check` | 人間が起動する読み取り専用の製品点検。引数なしは範囲を絞った日常点検、`full` は全件監査 |
| `inta:maintain` | 点検結果から人間が選んだ、挙動を変えない一系統の手入れ |

`test`、`env`、`stack`、`docs`、`design`、`security`、`wordpress`、`orca` は、通常は入口のスキルが必要に応じて使う専門スキルです。精度を高めたい場合は人間から明示的にも呼び出せます。

Claude Codeでは `agents/` の軽量エージェントも利用できます。Codexと他のAgent Plugins対応クライアントは、同じ `skills/` に書かれた開発契約を直接利用します。

詳しい設計思想は [Inta plugin README](./plugins/inta/README.md) を参照してください。

## 構造

```text
.
├── .agents/plugins/marketplace.json      # Codex marketplace
├── .claude-plugin/marketplace.json       # Claude Code marketplace
└── plugins/inta/
    ├── plugin.json                       # Agent Plugins v1
    ├── .codex-plugin/plugin.json          # OpenAI / Codex
    ├── .claude-plugin/plugin.json         # Claude Code
    ├── skills/                            # Agent Skills共通正本
    └── agents/                            # Claude Code固有の軽量エージェント
```

## 開発と検証

変更後は、共通スキルと各クライアント形式をそれぞれ検証します。

```bash
bun plugins/inta/skills/dev/scripts/validate-skills.ts
claude plugin validate .
for plugin_dir in plugins/*; do claude plugin validate "$plugin_dir"; done
for plugin_dir in plugins/*; do
  python3 /path/to/plugin-creator/scripts/validate_plugin.py "$plugin_dir"
done
```

このリポジトリへ社内情報、社内システム、非公開API、社内専用CLI、秘密情報を追加しないでください。公開境界の詳細は [CLAUDE.md](./CLAUDE.md) にあります。

第三者由来の素材とライセンスは [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) を参照してください。
