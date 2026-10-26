# 公開リポジトリの保守

このリポジトリは `interactive-inc/agent-plugins`。公開する内容は、非公開の社内資源がなくても理解・利用できるものに限る。

## 公開境界

- 社内情報、顧客情報、非公開の案件・仕様・識別子・URL・リポジトリ・文書を入れない。
- 社内専用CLI、API、認証、ネットワーク、個人のパス、秘密値を前提にしない。
- 製品名を伏せていても、実在の本番計測値・作業履歴・配置情報・認証構成は公開しない。例示は架空と明示し、実際の値を架空と呼び替えない。
- 第三者の出典・著作権表示を保ち、公開範囲を確認する。

## 共通の正本

`plugins/inta` は共通配布物そのもの。公開先だけの書き換え・追加・除外で別版を作らず、正本で確認した内容へ完全一致させる。別プラグインの変更を混ぜない。

```text
plugins/inta/
  plugin.json                 Agent Plugins定義
  .claude-plugin/plugin.json  Claude Code定義
  .codex-plugin/plugin.json   Codex定義
  README.md                   利用案内
  skills/                     共有する手順
  agents/                     Claude Codeの担当別の定義
```

スキルは `name`・`description` と本文を共有する。呼び出し制御等の追加項目は必要なクライアントの機能として保持し、他のクライアントに同じ制御が適用されると断定しない。担当の具体値は各定義を正本とし、共通の手順を複製しない。

収録機能と依存関係は [intaのREADME](plugins/inta/README.md)。旧 `bootstrap`・`security`・`agent-runtime`・`design` を復活させない。

## 登録と検査

ルートの `.claude-plugin/marketplace.json` と `.agents/plugins/marketplace.json` の名前・参照先を実体へそろえる。各配布定義の名前・版・説明は共通のものにそろえ、Codex版のキャッシュ識別子以外の相違を作らない。

```sh
claude plugin validate plugins/inta
claude plugin validate plugins/inta/skills
claude plugin validate plugins/inta/agents
git diff --check
```

`plugin.json` は指定された公式JSON Schema、手順と参照は実ファイルで確認する。ファイルの一致は実動作の証明と区別する。今回変更していない別プラグインの既存の検査結果を、inta更新の成功と混同しない。
