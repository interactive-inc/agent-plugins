# PHP runtime upgrade

WordPressを動かすPHP runtime、extension、Composer依存、deployment設定を互換性を保って更新する。引数なしと`plan`は読み取り専用、`apply`だけが変更する。

## 1. Baseline

- 対象リポジトリの指示、current branch / worktree、CI、deploy、hosting制約を確認する
- `php -v`、Composerの`require.php`、`.php-version`、Dockerfile、CI、hosting設定から現在値を集める
- WordPress core / plugin / themeが要求するPHP範囲を確認する
- 現行環境でsyntax check、unit / integration、主要smokeを実行し、既存failureを分ける
- DBとuploadsの復元方法、staging、rollback手順を確認する

対象versionが依頼されていなければ、hostingとWordPress ecosystemが共通してsupportする候補を公式資料から提示する。最新という理由だけで決めない。

## 2. Compatibility research

実行時点の公式PHP migration guide、WordPress hosting requirements、Composer platform check、利用plugin / themeのsupport情報を確認する。

versionを跨ぐごとに次を整理する。

- removed / deprecated syntax and functions
- changed error level or type behavior
- required / removed extensions
- Composer package constraints
- web server / FPM / container / CI image changes
- WordPress、plugin、themeのminimum / maximum support

固定されたdeprecated function listをSkillへ保存せず、current sourceと公式guideから対象codeを検索する。

## 3. Plan output

`plan`ではファイルを変更せず、次を報告する。

- current and target PHP versions with source
- compatibility blockers and affected paths
- dependency / extension / infrastructure changes
- test, staging, backup, rollback plan
- recommended batch order
- unknowns that block apply

## 4. Apply

明示されたscopeで次の順に進める。

1. source codeのremoved syntax / APIを、behaviorを保つ最小差分で修正する
2. Composer constraintとlockfileを正規commandで更新し、platform checkを通す
3. container、CI、local version、hosting configを同じtargetへ揃える
4. extension変更がある場合は代替実装とdata compatibilityを検証する
5. syntax check、static analysis、unit / integration、WordPress smokeを実行する
6. stagingでlogin、public page、admin、form、mail、cron / queue、cache、plugin固有導線を確認する

依存追加、DB変更、hosting変更、production deployは対象リポジトリの承認境界に従う。testを通すためにwarningを非表示へ変えたり、platform requirementを偽装しない。

## Delivery

Issue、branch / worktree、PR、mergeは`inta:dev`へ戻す。PRにはtarget version、互換性修正、lock / runtime変更、staging evidence、rollbackを記録する。本番反映は明示依頼とbackup / rollback確認後だけ行う。
