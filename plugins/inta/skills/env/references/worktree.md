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

`inta:env`の引数なしでは、Makefileとtargetの有無、`.PHONY`、上記の禁止処理、初期化に必要な手順の不足を読み取り専用で報告する。`inta:env apply`では、確認できたリポジトリ固有の初期化だけをtargetへ追加・修正し、既存targetの独自処理を理由なく置き換えない。

Issueフローが自分でlinked worktreeを作成した場合は、その直後に新しいworktree内で`make worktree`を1回実行する。IDEなどが作成した既存linked worktreeからセッションを開始した場合は、作成者が初期化済みである前提とし、AI agentは`make worktree`を再実行しない。
