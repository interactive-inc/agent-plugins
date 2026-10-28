# linked worktree の初期化契約

リポジトリルートの `Makefile` に `.PHONY` な `worktree` targetを置き、IDEやAI agentのどれがlinked worktreeを作っても同じ初期化を実行できるようにする。

```make
.PHONY: worktree
worktree:
	# リポジトリ固有の初期化command
```

targetは次を満たす。

- freshly-created linked worktreeを実装・test・dev server起動が可能な状態へ準備して終了する
- 複数回実行しても結果が壊れない冪等な処理にする
- lockfileに従う依存取得、生成物、local configなど、対象リポジトリに必要な初期化だけを行う
- dev server、watch process、browserなどの長時間processを起動しない
- branch / worktreeの作成・切り替え、commit、pushを行わない
- shared DBへの破壊的migration、secretの生成・commit、未承認のpackage追加を行わない
- repository instructionsに既存のwrapper commandや初期化順序があれば、それを正本にする

点検だけなら Makefile と target、`.PHONY`、禁止処理、初期化手順の不足を報告する。整備を依頼された場合だけ、確認した製品固有の初期化を追加・修正し、既存 target の独自処理を保つ。
