# GitHub リポジトリ運用

Issue / PR の書式ではなく、リポジトリそのものの設定と衛生を保つ運用ルール。書式は [gh-templates.md](gh-templates.md) を参照する。

## リポジトリ設定の確認

PR操作を始める前に、必要ならhead branchの自動削除設定を読み取る。無効でも、今回のPR依頼だけを根拠にrepository設定を変更しない。設定変更を明示された場合だけ有効化する。

```bash
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
gh api "repos/$REPO" -q .delete_branch_on_merge
# 明示依頼がある場合だけ有効化する
gh api -X PATCH "repos/$REPO" -F delete_branch_on_merge=true
```

## ブランチの棚卸し

squash マージされたブランチは `git branch --merged` に現れない（マージコミットを共有しないため）。ローカルブランチを消す前に、対応する PR の状態で判定する。

```bash
gh pr list --head "$BRANCH" --state all --json state -q '.[0].state'
# MERGED なら git branch -D で消してよい
```

PR を持たないブランチは、tip のコミット件名と差分を main と突き合わせ、重複作業の残骸なら消す。判断がつかないものは残して報告する。

## worktree の掃除

マージ済みブランチに紐づく worktree は `git worktree remove` で片付ける。`git worktree list` に残った detached / 古い日付のエントリは棚卸しの対象にする。
