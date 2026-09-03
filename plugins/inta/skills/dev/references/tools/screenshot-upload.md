# PR screenshotの任意手順

対象リポジトリが画像保存・uploadを許可し、ユーザーまたはPR規約が画像を要求する場合だけ使う。禁止規則がある場合は適用せず、URL、account / role、viewport、操作、結果を文章で残す。

## Preconditions

- 正規のdev serverとbrowser検証手順が分かっている
- screenshotの撮影、保存、uploadがrepository規則で許可されている
- upload先と公開範囲が依頼に含まれる
- `gh --version`が2.99.0以上で、`gh pr create --help`に`--attach`が出る。古い場合はuploadせず文章証拠へ切り替え、gh更新は人間へ提案する

どれかを満たさなければ外部uploadしない。

## Capture

- `/tmp/pr-screenshots/<run>/`へ保存し、repository内へ置かない
- 変更に必要なpage、state、viewportだけを撮る
- before取得のためにユーザーの変更をstash / revert / checkoutしない。安全なreference環境が無ければafterと文章で説明する
- 個人情報、token、非公開dataが写っていないか確認する

## Upload

`gh`の`--attach`で画像・動画を添付する。browser操作でuploadしない。対応commandは`pr create` / `pr edit` / `pr comment` / `issue create` / `issue edit` / `issue comment`。

```bash
# 作成時に添付。`#`以降はalt textになる
gh pr create --title "..." --body-file body.md --attach '/tmp/pr-screenshots/<run>/after.png#After: 一覧画面'

# 既存PRへ追加。複数はflagを繰り返す（1回50fileまで）
gh pr edit <number> --attach ./before.png --attach ./after.png

# commentへ添付
gh pr comment <number> --attach ./walkthrough.mp4
```

- 本文にlocal pathを`![alt](/tmp/pr-screenshots/<run>/after.png)`の形で書いておくと、そのpathがupload後のURLへ置換される。書いていなければ本文末尾へ追加される
- 差し替えoptionは無い。古い画像を消すには、新しい画像を`--attach`した後に`--body` / `--body-file`で本文を丸ごと書き換え、古い埋め込みURLを手動で外す
- 投稿直後に`gh pr view --web`または`gh pr view --json body`でrender結果を確認する
- `--attach`が使えない場合は画像なしの文章証拠へ切り替え、別のhostingを勝手に使わない

## Cleanup

PRと文章証拠を確認後、一時画像を削除する。repositoryへstage / commitされていないことを`git status`で確認する。
