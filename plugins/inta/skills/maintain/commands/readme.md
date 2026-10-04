# readme — CLAUDE.md と README.md の刈り込み

`/inta:maintain readme [scope]`は、人間が指定した範囲のCLAUDE.md / AGENTS.mdと既存README.mdを「読者に合った最小限」へ締め直す。READMEの新規作成やsetup情報の追加が目的なら`inta:docs readme`を使う。必要なら先に[inta:check readme](../../check/commands/readme.md)でfindingを確定する。

# 読者の定義

- AGENTS.md / CLAUDE.mdなどagent向け指示（ルート・サブディレクトリ・rules配下）: 読者は実行agent。毎sessionのcontextを消費するため、「知らないと事故る規約・制約・手順」だけを置く
- README.md: 読者は人間（新しく来た開発者・非開発者）。何のプロダクトか、セットアップ、起動、テスト、デプロイの入口だけを置く

# 手順

1. 対象を列挙する: ルートと各workspaceのAGENTS.md / CLAUDE.md / README.md、agent別rules
2. 各記述を実態と突合する。コマンド・パス・アカウント・URL は実際に叩く / 存在確認する（「書いてあるが動かない」が最優先の直し対象）
3. 1 行ずつ「これは誰のための情報か」を問い、行き先を決める
   - Claude が事故を避けるための規約・制約 ⇒ CLAUDE.md に残す
   - 人間の入口情報 ⇒ README.md に残す
   - 意思決定の経緯・歴史 ⇒ `.docs/decisions/` へ移す（dev スキルの書式）
   - 実装から読み取れる自明な説明・解決済みの注意書き・重複 ⇒ 削除
4. 重複を潰す。同じ規約が CLAUDE.md と `.claude/rules/` と dev スキルに多重記載されていたら、正本 1 箇所に寄せて他はリンクか削除
5. 変更は差分をオーナーに見せられる粒度でコミットする

# 判定の目安

- 「〜していた時期があった」「以前は〜」で始まる段落は decisions 行き
- 特定 Issue の対応中メモ（Issue が close 済み）は削除
- 同じ内容を 2 箇所で説明していたら、詳しい方を残して他方をリンクにする
- CLAUDE.md の 1 セクションを消しても Claude の行動が変わらないなら、それは不要だった

# 禁止

- 「このセクションを削除・短縮しない」等の保護マーカーが付いたセクションに触ること
- 実態確認をせずに「古そう」という感触だけで削除すること
- README.md に Claude 向けの規約を書き足すこと（逆も同じ）
