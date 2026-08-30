# security — security boundary health

[inta:security](../../security/SKILL.md)のreconnaissanceと判定基準を、読み取り専用の定期検診として使う。

- 認証・認可、tenant / role境界、入力validation、secret、cookie / CORS / CSP、upload、external fetchを確認する
- codeと安全なlocalhost観測だけを使い、永続変更、攻撃payload送信、大量request、外部callbackを行わない
- confirmed vulnerability、危険な設計候補、機能している防御、未検査を分ける

再現のために状態変更が必要なら実行せず、必要な権限と最小手順を報告する。
