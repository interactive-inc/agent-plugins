---
name: env
description: "Inspect or explicitly apply the product repository development environment baseline: linked-worktree initialization, vite-plus, formatting and lint tooling, staged hooks, Bun and Playwright separation, ignore rules, browser-test setup, and useful Skills. Use only when a human directly requests environment inspection or setup."
---

> このスキルを更新するときは [product設計](../../README.md) に従う。

`/inta:env`は、人間が明示実行する製品リポジトリの開発環境入口。引数なしは読み取り専用、`apply`と`skills`だけが明示された変更を行う。開発中に自動起動しない。

# モード

- 引数なし: 現状、逸脱、適用時の差分、追加・削除される依存を報告する
- `apply`: 明示された範囲だけ冪等に適用し、既存の独自設定を保持する
- `skills`: [skills.md](commands/skills.md)に従い、検出したstackに必要なSkill packageだけを追加する

# チェックリスト

1. 対象リポジトリの指示と[inta:stack](../stack/SKILL.md)から、既存stackと採用済みtoolを確認する
2. [worktree.md](references/worktree.md)に従い、リポジトリルートのMakefileに冪等な`worktree` targetがあるか確認する。追加・修正は`apply`のときだけ行う
3. `vite-plus`と既存のformat / lint / typecheck / test構成を確認する
4. prettier / eslint / biomeから移行する場合は[migrate-linters.md](references/migrate-linters.md)を読む
5. `vite.config.ts`は[vite-config.md](references/vite-config.md)を基準に、既存構成へ必要部分だけ統合する
6. Git hookがfileとして存在するだけでなく、通常のcommitから実行されることを確認する
7. Bun TestとPlaywrightの探索対象が混ざっていないことを確認する
8. `.gitignore`の不足を確認する。既存項目を削除しない
9. browser test生成物とportlessなどのlocal server toolは、対象stackとリポジトリ規則に合う場合だけ候補にする

# 適用後の検証

- リポジトリ標準のformat / lint / typecheck / unit testが成功する
- Makefileの`worktree` targetが`.PHONY`で、長時間processやGit操作を含まず、freshly-created linked worktreeの初期化を完了できる
- Playwright専用testがunit runnerへ混入しない
- staged hookを一時的な無害な変更で実行し、test 0件の偽成功にならない
- 生成物や全体formatによる意図しない差分が残らない

全体formatが必要な移行は機能変更と分ける。引数なしではfile、依存、Git設定を変更しない。
