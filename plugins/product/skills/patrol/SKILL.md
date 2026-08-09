---
name: patrol
description: "Patrol a running local product UI as a specified role, verify real routes and runtime failures, and file at most one evidence-backed GitHub bug. Use for loop-agent health-check iterations; never use for code changes."
user-invocable: false
disable-model-invocation: false
---

起動済み localhost アプリを1ロールで巡回し、実在するバグを最大1件だけ GitHub Issue にする。コード、dev server、他 Agent は操作しない。

# 入力

- role
- 巡回候補 path
- 起動済み dev server URL
- visited 記録（既定 `.claude/agent-memory/loop/visited.md`）

# 実行

1. [run.md](references/run.md) に従って実在 route と実 ID を確定する
2. 未巡回 path を確認し、console、例外、4xx/5xx、空画面、視覚崩れを観測する
3. 異常を反証し、既存 Issue と重複しない場合だけ1件起票する
4. state と visited を保存して browser を閉じる

# 出力

200字以内の1行に限定する。

```text
issue=#N role={role} path={path} kind={console|404|500|visual|design|nav} note="{要約}"
```

新規バグがなければ `issue=none role={role} covered_paths={N}` を返す。
