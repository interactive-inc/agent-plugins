---
name: wordpress
description: "Plan and execute WordPress core, plugin, theme, or PHP runtime upgrades. Use for WordPress/PHP compatibility reviews, upgrade planning, implementation, staging verification, rollback planning, and GitHub delivery. Defaults to a read-only plan; use `apply` or an explicit implementation request for changes."
---

> このスキルを更新するときは [product設計](../../README.md) に従う。

WordPress固有のupgrade判断と検証を提供する。Issue、worktree、PR、mergeなど共通のdeliveryは`product:dev`のリポジトリ規約に従い、このSkill内へ別実装しない。

# 振り分け

```text
/product:wordpress upgrade [plan|apply]
/product:wordpress php-upgrade [plan|apply]
```

- `upgrade` → [upgrade.md](references/upgrade.md)。WordPress core、plugin、themeのupgrade
- `php-upgrade` → [php-upgrade.md](references/php-upgrade.md)。PHP runtimeと依存の互換性upgrade
- 対象が未指定でリポジトリから判別できない場合だけ、WordPressかPHPかを確認する

各subcommandは引数なしと`plan`が読み取り専用。`apply`または「実装して」などの明示依頼がある場合だけ変更する。旧`demo`入力は`plan`として扱い、`issue-demo/`などの模擬GitHubファイルは生成しない。

# 安全境界

- 作業前に復元可能なDB / uploads backup、staging、rollback手順の有無を確認する
- 最新versionや互換性は実行時に公式WordPress / PHP / plugin / hosting資料で確認し、Skill内の固定versionを信頼しない
- WordPress coreやvendorを直接編集せず、package manager、Composer、WP-CLI、管理対象のtheme / plugin sourceを正規経路で更新する
- package追加、platform設定、DB migration、本番deployは対象リポジトリの承認境界に従う
- backupやstagingが無い状態でproductionへ進めない。調査不能を互換性確認済みにしない
- upgrade後はpublic page、管理画面、login、主要form、cron / queue、mail、cache、plugin固有導線を実環境相当で確認する
