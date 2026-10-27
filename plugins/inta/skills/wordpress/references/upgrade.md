# WordPress・PHP の更新

共通の更新手順。対象ごとの確認項目を使い、更新範囲を混同しない。

## 調査と計画

現在の version、依存と lockfile、独自実装、hosting・CI・deploy、既存試験と失敗を確認する。実行時点の公式 release notes・migration guide・support matrix から互換性と更新候補を決める。最新という理由だけで採用しない。

DB・uploads の復元可能な backup、staging、rollback 方法を確認する。計画には現在→対象 version、影響箇所、非互換、更新順、検証と復旧、未確認を残す。

### WordPress core・plugin・theme

mu-plugin・child theme・custom plugin・core patch を含めて確認する。PHP 要件、削除された hook / function / block / REST 契約、template override、schema 更新、再保存や cache の要否を調べる。廃止済み・更新不能な依存は通常更新と分けて判断する。

### PHP runtime

`php -v`、Composer の制約、extension、container、CI、hosting の実行版を照合する。跨ぐ version ごとの削除・非推奨 API、型やエラーの挙動、必要 extension、WordPress・plugin・theme の対応範囲を確認する。固定の非推奨一覧をこのスキルへ保存しない。

## 適用と検証

明示された範囲で、互換性上セットが必要なものを小さな単位で更新する。Composer・WP-CLI・管理対象 source など製品の正規経路を使い、core / vendor を直接 patch しない。

PHP は local・CI・container・hosting を同じ対象へそろえ、Composer の platform check と syntax / static / unit / integration 検査を行う。制約の偽装や警告の非表示で通さない。

WordPress の migration・rewrite・cache 操作は公式に必要なものだけを行う。staging で公開ページ・ログイン・管理画面・編集・upload・主要フォーム・メール・検索・cron / queue・主要 plugin の導線とログを確かめる。

本番反映は依頼された場合だけ行い、backup と rollback を確かめられない状態では進めない。version、互換性修正、migration、検証結果、既知の制約、復旧方法を報告する。Issue・PR は共通の [dev 規約](../../dev/references/tools/issue-pr.md) を使う。
