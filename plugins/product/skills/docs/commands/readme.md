# readme — READMEを実態から作成・更新する

`/product:docs readme [scope]`は、人間向けの入口READMEを現在のリポジトリ構成から作成または更新する。読み取り専用の乖離検査だけなら`product:check docs`、既存READMEの修正なら`product:dev`を使う。

## 手順

1. rootとworkspaceのREADME、AGENTS.md / CLAUDE.md、manifest、lockfile、runtime設定、`.env.example`、deploy設定を確認する
2. 読者とscopeを決め、次のうち実在する情報だけを選ぶ
   - 製品の目的と対象利用者
   - 前提runtimeとtool
   - setup、起動、format、lint、typecheck、test、build、deployの入口
   - 主要directoryと正本documentへの導線
   - secret値を含まない環境変数名と取得方法
3. READMEが無ければ最小構成で新規作成する。既存READMEがあれば人間の説明を保持し、矛盾した節だけ更新する
4. command、path、URL、設定名を実在確認する。安全に実行できるsetup不要のcommandは実行し、未実行は明記する
5. API一覧やdirectory treeなどコードから生成できる大きな一覧をREADMEへ複製せず、正本または生成方法へリンクする

## 禁止

- package名やversionを推測で補う
- `.env`やsecretの値を転記する
- setup commandを検証せず「動作確認済み」と書く
- agent向けの禁止事項や内部運用履歴をREADMEへ移す
- 既存READMEを全面置換して、人間が書いた背景や例を失う

## 報告

変更したREADME、根拠にした設定、実行したcommand、未確認のsetup / deploy手順を分けて示す。
