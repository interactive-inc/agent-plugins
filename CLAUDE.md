# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## リポジトリ概要

このリポジトリは Interactive Inc. が提供する Claude Code 用のプラグインマーケットプレースです。複数のプラグインを含み、それぞれが専門的なスキルとエージェントを提供します。

## オープンソースとしての公開境界

このリポジトリは、社外から利用・検証・再配布できるオープンソースとして管理します。すべてのプラグイン、スキル、エージェント、スクリプト、設定、ドキュメント、例示は、非公開の社内資源がなくても理解・実行できる内容にします。

- 社内だけで共有されている情報、顧客情報、非公開のプロジェクト名・仕様・Issue・識別子・データ・設定・URL・リポジトリ・ドキュメントを記載しない
- 社内システム、社内API、社内MCPサーバー、社内SaaS環境、社内ネットワーク、社内認証を前提にしない
- 社内専用CLI、そのコマンド、設定、環境変数、認証方法、ローカルパスを記載または実行要件にしない
- 社内実装を元にした例は、公開可能性を確認したうえで一般化し、架空または汎用的な名前とデータへ置き換える
- 公開に必要な第三者ライセンス、著作権表示、出典を維持し、秘密情報や個人環境への依存がないことを変更前後に確認する
- 社内資源が必要な機能はこのリポジトリへ追加せず、社内リポジトリ側に保持する

## プラグイン構造

### マーケットプレース設定

- 設定ファイル: `.claude-plugin/marketplace.json`
- マーケットプレース名: `interactive-claude-plugins`
- 所有者: Interactive Inc.

### ディレクトリ構造

```
.
├── .claude-plugin/
│   └── marketplace.json     # プラグインマーケットプレース定義
└── plugins/
    ├── claude/              # Claude Code 開発支援プラグイン
    │   ├── .claude-plugin/plugin.json
    │   └── skills/
    │       ├── skill-review/
    │       ├── subagent-review/
    │       ├── hooks-review/
    │       ├── marketplace-review/
    │       ├── mcp-review/
    │       └── slash-command-review/
    ├── jobantenna/          # プロジェクト固有プラグイン
    │   ├── .claude-plugin/plugin.json
    │   └── skills/
    │       ├── laravel-command/
    │       ├── laravel-mail/
    │       └── phpunit-runner/
    └── product/             # 汎用的な製品開発プラグイン
        ├── .claude-plugin/plugin.json
        ├── agents/
        └── skills/
```

## 利用可能なプラグイン

### 1. claude

Claude Code 開発支援プラグイン。スキルとサブエージェント開発を支援します。

**含まれるスキル:**

- **skill-review**: Claude Code スキル自体をベストプラクティスに照らして包括的にレビュー
  - 6つの観点から評価（Description 品質、Progressive Disclosure、コンテンツ品質、ワークフロー、テンプレート・例、技術的詳細）
  - A-F 評価とスコアを算出し、優先度付き改善提案を提供
  - チェックリスト: `plugins/claude/skills/skill-review/CHECKLIST.md`
  - レポートテンプレート: `plugins/claude/skills/skill-review/REPORT_TEMPLATE.md`

- **subagent-review**: Claude Code サブエージェント実装をレビュー
  - 5つの観点から評価（単一責任原則、システムプロンプト品質、ツールアクセス制限、バージョン管理統合、適切な基盤）
  - セキュリティ、フォーカス、効果性を確保するための具体的な改善提案
  - ベストプラクティス例: `plugins/claude/skills/subagent-review/references/examples.md`

- **hooks-review**: Claude Code フック設定をレビュー・構成し、ワークフロー自動化を支援
  - セキュリティ脆弱性、パフォーマンス問題、ベストプラクティス違反を検出
  - 9種類のフックイベント（PreToolUse、PostToolUse、UserPromptSubmit など）をサポート
  - 優先度付き推奨事項と具体的な修正例を提供

- **marketplace-review**: マーケットプレース設定の検証
  - `.claude-plugin/marketplace.json` の構造と参照パスを自動チェック
  - プラグイン、スキル、エージェントの定義を包括的に検証
  - Python スクリプトによるエラーレポートと品質保証
  - マーケットプレース公開前の必須チェック

- **mcp-review**: MCP サーバー設定のレビュー
  - `.mcp.json` をベストプラクティスに照らして検証
  - 7つの観点（セキュリティ、スコープ管理、トランスポートタイプなど）から評価
  - ハードコードされた秘密情報、不適切な環境変数使用を検出
  - stdio/HTTP/SSE の適切なトランスポート選択をガイド

- **slash-command-review**: スラッシュコマンド実装のレビュー
  - 6つの観点（メタデータ、引数処理、動的機能、セキュリティ、スコープ、スキル境界）から評価
  - A-F 評価とスコアリング、優先度付き改善提案
  - コマンドインジェクション、パストラバーサルなどのセキュリティリスクを検出

### 2. jobantenna

JobAntenna プロジェクト固有の開発支援プラグイン。Laravel アプリケーション開発を効率化します。

**含まれるスキル:**

- **laravel-command**: Laravel Artisan コマンドの実装とレビュー
  - 本番環境で実証済みのパターン（JobAntenna v4 から抽出）
  - Laravel 9+ 公式推奨に準拠
  - 7種類のテンプレート（Basic、ServiceIntegration、BatchProcessing、Scheduled、LongRunning、Isolatable）
  - 8つのコアパターン（カスタムベースクラス、サービス統合、大規模データ処理、Dry-Run、エラーハンドリングなど）
  - リファレンス: `plugins/jobantenna/skills/laravel-command/references/command-patterns.md`
  - 専門レビューエージェント: `plugins/jobantenna/skills/laravel-command/agents/laravel-command-reviewer.md`

- **laravel-mail**: Laravel メール機能の実装とレビュー
  - Mailable、Notification、Twig テンプレート、テストの作成
  - JobAntenna プロジェクトの確立されたパターンに準拠
  - 二層アーキテクチャ（Notification + Mailable）による明確な責任分離
  - 8つの Sanitize Traits による安全なデータ変換
  - カスタム MailFake による期待値ファイル比較テスト
  - リファレンス: `plugins/jobantenna/skills/laravel-mail/references/sanitize-traits-reference.md`
  - 専門レビューエージェント: `plugins/jobantenna/skills/laravel-mail/agents/laravel-mail-reviewer.md`

- **phpunit-runner**: PHPUnit テストの実行
  - JobAntenna の Laradock Docker 環境で PHPUnit テストを非同期実行
  - 専用エージェントによる時間のかかるテスト実行
  - 特定のクラス、ファイル、またはすべてのテストを柔軟に選択可能
  - メイン会話をブロックしないバックグラウンド実行
  - 専門実行エージェント: `plugins/jobantenna/skills/phpunit-runner/agents/phpunit-test-runner.md`

**含まれるエージェント:**

- **laravel-command-reviewer**: Laravel Artisan コマンド実装を10の観点から評価し、優先度付き改善提案を提供
- **laravel-mail-reviewer**: Laravel メール実装を10の観点から評価し、JobAntenna パターンへの準拠をチェック
- **phpunit-test-runner**: Docker 環境での PHPUnit テスト実行を自動化し、結果レポートを提供

### 3. product

製品開発、検証、文書成果物、点検・保守・環境整備の共通ワークフローです。

**含まれるスキル:**

- **bootstrap**: 新規・既存repositoryの初期architectureと開発baseline
- **dev**: 要望・bug・Issue・PRを設計、実装、検証、deliveryまで進める
- **test**: unit、API、a11y、visual、diff、performance検証
- **check**: 人間が起動する読み取り専用の横断点検
- **env**: 開発環境の読み取り専用点検と明示的な適用
- **stack**: 技術選定とpackage・framework移行計画
- **docs**: HTML、PDF、READMEの生成と検品
- **wordpress**: WordPress・PHP更新
- **agent-runtime**: Claude Agent の役割別実行境界
- **security**: localhostアプリの非破壊security検査

詳細な設計思想は `plugins/product/README.md` を正本とします。

## スキル開発のベストプラクティス

### スキルファイル構成

各スキルは以下の構造を持ちます：

```
skills/{skill-name}/
├── SKILL.md              # メインスキル定義（YAML frontmatter + 説明）
├── REPORT_TEMPLATE.md    # 出力テンプレート（該当する場合）
├── CHECKLIST.md          # 評価基準（該当する場合）
├── EXAMPLES.md           # 使用例（該当する場合）
└── assets/               # テンプレートやリソース（該当する場合）
```

### SKILL.md の frontmatter

必須フィールド:
- `name`: Gerund 形式（動詞+-ing）、小文字、ハイフン区切り
- `description`: 三人称、具体的なキーワード、トリガーワード含む、1024文字以内

### Progressive Disclosure

- SKILL.md は 500 行以下を推奨
- 詳細情報は外部ファイルに分離（参照の深さは 1 階層のみ）
- 必要時のみ読み込まれる構造

## エージェント開発のベストプラクティス

### エージェントファイル構成

エージェントファイルは Markdown 形式で、スキル内の `agents/` ディレクトリに配置します：

- YAML frontmatter（name, description）
- 役割と専門性の説明
- レビュー観点
- 改善提案方法
- 出力形式
- 最終報告形式への参照

**配置例:**
```
plugins/jobantenna/skills/laravel-command/
├── agents/
│   └── laravel-command-reviewer.md
├── SKILL.md
└── ...
```

### 最終報告形式

エージェントは作業完了時に以下の 5 つのセクションを含む統一形式で報告：

1. 実行結果サマリー
2. 対象ファイル一覧（相対パス）
3. 具体的な提案内容（サンプルコード付き）
4. 意思決定が必要な事項
5. 次のアクション

## 新規プラグインの追加方法

1. `plugins/{plugin-name}/.claude-plugin/plugin.json` を作成
2. 必要なスキルを `plugins/{plugin-name}/skills/` に作成
3. 必要なエージェントをプラグイン内に作成し、`plugin.json` で公開
4. `.claude-plugin/marketplace.json` の `plugins` 配列に `source: "./plugins/{plugin-name}"` の定義を追加
5. `claude plugin validate .` と `claude plugin validate ./plugins/{plugin-name}` を実行

## スキルの使用方法

### スキルのレビュー

`skill-review` スキルを使用して新規スキルの品質を評価します。

**使用例:**
```
このスキルをレビューしてください: plugins/jobantenna/skills/laravel-command
```

### サブエージェントのレビュー

`subagent-review` スキルを使用してサブエージェント実装を評価します。

**使用例:**
```
このサブエージェントをレビューしてください: plugins/jobantenna/skills/laravel-command/agents/laravel-command-reviewer.md
```

### フック設定のレビュー

`hooks-review` スキルを使用してフック設定をレビューし、セキュリティとベストプラクティスを確認します。

**使用例:**
```
フック設定をレビューしてください
```

### マーケットプレース設定の検証

`marketplace-review` スキルを使用してマーケットプレース設定を検証します。

**使用例:**
```
マーケットプレース設定を検証してください
```

### MCP サーバー設定のレビュー

`mcp-review` スキルを使用して MCP サーバー設定をレビューします。

**使用例:**
```
MCP サーバー設定をレビューしてください
```

### スラッシュコマンドのレビュー

`slash-command-review` スキルを使用してスラッシュコマンド実装をレビューします。

**使用例:**
```
スラッシュコマンドをレビューしてください: .claude/commands/my-command.md
```

### Laravel コマンドの実装

`laravel-command` スキルを使用してコマンドを実装またはレビューします。

**実装例:**
```
ユーザーの未承認データを削除するバッチコマンドを作成してください
```

**レビュー例:**
```
app/Console/Commands/DeleteUnverifiedUsers.php をレビューしてください
```

### Laravel メールの実装

`laravel-mail` スキルを使用してメール機能を実装またはレビューします。

**実装例:**
```
パスワードリセット完了メールを作成してください
```

**レビュー例:**
```
app/Mail/PasswordResetComplete.php をレビューしてください
```

### PHPUnit テストの実行

`phpunit-runner` スキルを使用して Docker 環境でテストを実行します。

**使用例:**
```
PHPUnit テストを実行してください
```

**特定のテストクラスを実行:**
```
UserTest クラスのテストを実行してください
```

## プラグインのインストールと利用

### マーケットプレース追加

```bash
/plugin marketplace add interactive-inc/claude-plugins
```

### プラグインインストール

```bash
/plugin install claude@interactive-claude-plugins
/plugin install jobantenna@interactive-claude-plugins
```

### インストール済みプラグインの確認

```bash
/plugin list
```

## 注意事項

- すべてのスキルとエージェントは日本語で記述されています
- ベストプラクティスに厳格に準拠していますが、プロジェクト固有の事情も考慮します
- スキルの Progressive Disclosure により、コンテキストウィンドウを効率的に使用します
