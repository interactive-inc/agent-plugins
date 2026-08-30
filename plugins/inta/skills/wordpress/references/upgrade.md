# WordPress core / plugin / theme upgrade

WordPress core、plugin、themeを、dataと運用を壊さず更新する。引数なしと`plan`は読み取り専用、`apply`だけが変更する。

## 1. Baseline

- repository instructions、current branch / worktree、deployment方式を確認する
- WordPress core version、PHP、Composer / lockfile、WP-CLI、plugin / theme一覧と管理方法を特定する
- mu-plugin、custom plugin / theme、child theme、core patchなど独自変更を列挙する
- current environmentでunit / integration、public / admin smoke、scheduled taskを実行してbaselineを残す
- DB / uploads backup、staging、maintenance mode、rollback手順を確認する

WordPress coreやvendor fileを直接patchしない。Composer、WP-CLI、管理対象sourceなど、リポジトリが採用する正規経路を使う。

## 2. Research

実行時点の公式WordPress release notes、security release、plugin / theme changelog、support matrix、hosting制約を確認する。third-party packageは公式配布元またはvendor documentationを優先する。

各更新について次を記録する。

- current → target version
- security / behavior / schema changes
- PHP and WordPress compatibility
- removed hooks, functions, blocks, REST behavior
- migration or re-save requirement
- rollback availability

version情報をSkill内のlocal JSONへ保存して再利用しない。毎回current sourceを確認する。

## 3. Plan output

`plan`では変更せず、更新を次へ分ける。

- core
- first-party / custom code compatibility
- plugin
- theme / child theme
- DB migration and cache
- deployment / rollback

同時更新が必要なcompatibility set以外は小さいbatchへ分ける。更新不能、abandoned、security riskは通常upgradeと分離してproduct decisionとして示す。

## 4. Apply

1. backupとstagingを再確認する
2. dependency manifest / lockfileまたはWP-CLIで選択batchを更新する
3. custom codeのdeprecated API、hook、template override、block / REST互換性を修正する
4. schema migration、rewrite rule、cache flushなど公式に必要な操作だけを行う
5. source diffを確認し、unexpected core / vendor editや不要fileを除く
6. static check、unit / integration、WordPress health / smokeを実行する
7. stagingでpublic page、login、admin、editor、media upload、form、mail、search、cron / queue、cache、主要plugin導線を確認する
8. log、PHP warning、browser console、failed requestを確認する

自動update設定、production maintenance、DB migration、deployは対象リポジトリの承認境界に従う。backupやrollbackを検証できない状態でproductionへ進めない。

## Delivery

Issue、worktree、PR、mergeは`inta:dev`の共通flowを使う。PRにはversion一覧、custom compatibility修正、migration、verification、known gaps、rollbackを記録する。旧`demo`はread-only `plan`として扱い、模擬Issue / PR fileを作らない。
