---
name: check
description: "Perform human-requested read-only product, code, and documentation checks."
argument-hint: "[changed|full|trace|docs|code|readme|env] [scope]"
user-invocable: true
disable-model-invocation: true
---

# 製品の点検

人間が明示した読み取り専用の点検。修正・Issue 起票・ファイル保存は含めず、開発中に独立した全体点検を自動起動しない。

| 入力 | 範囲 |
| --- | --- |
| 引数なし / `changed` | [現在の変更](references/scopes.md#changed) |
| `full` | [製品全体](references/scopes.md#full) |
| `code` / `docs` / `readme` と対象 | [指定領域](references/scopes.md) |
| `trace` と対象 | [仕様と検証の接続](commands/trace.md) |
| `env` | [開発環境](../env/SKILL.md) の読み取り専用点検 |

比較基点と範囲を決め、現在の実装・規約・再現条件で裏付けられた問題だけを報告する。利用者への影響、根拠となる場所、推奨する次の対応を添え、バグ・証拠不足・環境要因を区別する。未検査を合格へ数えない。

修正も依頼された場合は、その許可範囲で開発または保守へ続ける。点検結果だけで変更や外部送信の許可が増えるとは扱わない。
