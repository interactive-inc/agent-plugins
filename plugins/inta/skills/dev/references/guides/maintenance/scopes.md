# 手入れの対象

## code

開発中の局所整理は [構造・分割](../../code/structure.md) と [preferences](../../preferences/index.md) を使う。独立した全体整理を人が実行する入口は `/inta:refactor`。このガイドから自動起動しない。

## docs

[文書点検](../../../../check/references/scopes.md#docs) で確認した差から、現状の説明と実装を同期する。未反映の決定・将来の要件を、実装と違うだけで消さない。

完了済み backlog、日程、役目を終えた一時メモも確認し、経緯や人の記述を保ちながら整理する。[文書の整合規約](../../docs/validation.md) に従い、関連する入口とリンクまで更新する。

## readme

README は人の入口、AGENTS.md / CLAUDE.md は agent が必要とする規約と制約に絞る。実装から自明な説明・重複は削り、意思決定の経緯は既存の `.docs/decisions/` などへ寄せる。同じルールを複製しない。

コマンドや参照先の実在を確認して部分更新し、人が書いた背景や保護された節を保持する。README を新しく作る仕事は [docs readme](../../docs/readme.md)。
