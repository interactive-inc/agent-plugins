# inta — 社外にも公開する開発支援

社内外の製品開発者が使う、開発・設計・検証・保守の手順です。会社専用の認証や社内資料を前提にしません。

対話から目的・規模・期限・運用を理解し、全体を見て必要な部分を作り、試験で得た発見を全体へ戻します。関係する `.docs/`・`AGENTS.md` は追記だけでなく整理し、次の開発に必要な理解を短く保ちます。

標準の道具は `vp`、新規のWeb製品の基盤は `void`。依存の導入・追加は `vp install` を入口にし、配置と文書の書式は共通規約へそろえます。既存製品の移行は今回の目的と範囲を決めてから行います。

## 開発する

| 機能 | 用途 |
| --- | --- |
| [dev](skills/dev/SKILL.md) | 要望や不具合を整理し、実装・検証へ進める |
| [test](skills/test/SKILL.md) | 変更に必要な試験・操作性・見た目を検証する |
| [perf](skills/perf/SKILL.md) | 既存の処理の遅さを調べ、改善する |
| [stack](skills/stack/SKILL.md) | 技術の選定・移行方針を検討する |
| [wordpress](skills/wordpress/SKILL.md) | WordPress・PHPの更新を計画・実施する |
| [orca](skills/orca/SKILL.md) | Orcaの作業場所へ課題の実装を引き渡す |

[check](skills/check/SKILL.md) は点検、[maintain](skills/maintain/SKILL.md) は挙動を変えない手入れ、[env](skills/env/SKILL.md) は環境整備です。この3つは人が明示的に呼び出します。

## 短い呼び出し

- `dev next`・`dev review`・`dev ci`・`dev pr-chain`：次の仕事、差分、CI、関連 PR。
- `test changed|unit|api|a11y|visual|diff|perf`：必要な検証を選ぶ。
- `check [full|trace|code|docs|readme|env]`：読み取り専用の点検。
- `maintain code|docs|readme`：挙動を保つ整理。
- `env [apply|skills]`・`stack migration`：環境整備と基盤移行。
- `wordpress upgrade|php-upgrade [plan|apply]`・`orca [fanout] #番号`：更新と作業の引き渡し。

スキル名は既存の短い名前を維持しています。各入口は必要な参照だけを読み、詳細な書式・標準配置・専門検証をそれぞれの正本へ分けます。

## 開発文書

[docs](skills/docs/SKILL.md) は製品の正本からHTML・PDF・READMEを作成します。対象製品の書式を優先し、会社共通の見た目には依存しません。仕様や設計判断の管理は `dev` が担当します。

提案資料、社内の説明資料、試作画面・動画、会社共通の見た目は収録しません。

## 補助担当

Claude Code 向けには `fable`・`opus`・`sonnet`・`worker`・`hacker`・`loop` を収録しています。各担当の定義は [agents](agents/) にあります。Codex は共通の手順を直接利用します。

## 適用範囲

社内外で同じ開発手順を使います。製品固有の手順は対象リポジトリの指示へ残し、会社専用の資料・業務システムを共通手順の依存条件にしません。

## 導入

公開配布元を登録して `inta` を導入します。

```text
/plugin marketplace add interactive-inc/agent-plugins
/plugin install inta@inta-agent-plugins
```

Codex では次を使います。

```sh
codex plugin marketplace add interactive-inc/agent-plugins
codex plugin add inta@inta-agent-plugins
```

別の配布元へ登録されている場合は、導入時の配布元名へ置き換えてください。共通の手順は同じです。

Claude Code・Codexと、Agent Plugins形式の定義を収録しています。呼び出し制御などのクライアント固有の設定は、対応するクライアントで適用します。
