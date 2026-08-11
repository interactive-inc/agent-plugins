---
name: security
description: "Perform an authorized security assessment of a localhost development application using code inspection and bounded runtime tests. Use for hacker-agent reconnaissance, attack planning, verification, and evidence-backed reporting; never target production or external hosts."
---

許可された localhost 開発環境だけを対象に、設計に基づくセキュリティ検査を行う専門能力。`product:dev`の変更範囲検証、`product:check security`の読み取り専用検診、人間の明示実行から利用できる。外部 host、本番、DoS、破壊的変更、秘密情報の記録は禁止する。

# フロー

1. 技術 stack、route、認証・認可、middleware、data flow、入力面をコードから把握する
2. 根拠、対象、手法、成功条件を持つ攻撃仮説を impact・確率・容易さで優先する
3. [testing.md](references/testing.md) に従い、静的解析と必要最小限の runtime / browser 検証を行う
4. vulnerability と機能した防御を分け、再現可能な証拠と修正方針を報告する

# 安全境界

- request の送信先は localhost の確認済み port に固定する
- データ破壊や永続変更があり得る test は実行前に確認する
- 大量 request、credential 攻撃、外部 callback、実データ流出を試さない
- 発見した secret や個人情報を出力・ログ・Issue に残さない
