---
name: wordpress
description: "Plan or explicitly apply WordPress and PHP upgrades with verification and recovery planning."
argument-hint: "[upgrade|php-upgrade] [plan|apply]"
user-invocable: true
disable-model-invocation: false
---

# WordPress・PHP の更新

既存製品の WordPress core / plugin / theme と PHP runtime の互換性を調べ、安全に更新する。

- `upgrade [plan|apply]`：WordPress の更新。
- `php-upgrade [plan|apply]`：PHP runtime と依存の更新。

引数なし・`plan` は読み取り専用。`apply` または実装の明示依頼があれば指定範囲を変更する。対象がリポジトリから分からない場合だけ確認する。

共通手順と対象ごとの確認項目は [upgrade.md](references/upgrade.md)。実行時点の公式資料で互換性を確認し、staging と復旧方法を確かめて検証する。設定ファイルや version 表示だけで動作確認済みにしない。

依存・DB・hosting・本番反映は対象リポジトリの承認範囲に従う。復元可能な backup と rollback を確認できない状態で本番へ進めない。Issue・PR など共通の開発運用は `dev` の規約を使う。
