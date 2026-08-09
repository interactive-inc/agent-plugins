# PR screenshotの任意手順

対象リポジトリが画像保存・uploadを許可し、ユーザーまたはPR規約が画像を要求する場合だけ使う。禁止規則がある場合は適用せず、URL、account / role、viewport、操作、結果を文章で残す。

## Preconditions

- 正規のdev serverとbrowser検証手順が分かっている
- screenshotの撮影、保存、uploadがrepository規則で許可されている
- upload先と公開範囲が依頼に含まれる

どれかを満たさなければ外部uploadしない。

## Capture

- `/tmp/pr-screenshots/<run>/`へ保存し、repository内へ置かない
- 変更に必要なpage、state、viewportだけを撮る
- before取得のためにユーザーの変更をstash / revert / checkoutしない。安全なreference環境が無ければafterと文章で説明する
- 個人情報、token、非公開dataが写っていないか確認する

## Upload

対象環境で承認済みのupload commandを使い、PR本文へ貼る。投稿直後にrender結果を確認する。利用できない場合は画像なしの文章証拠へ切り替え、別のhostingを勝手に使わない。

## Cleanup

PRと文章証拠を確認後、一時画像を削除する。repositoryへstage / commitされていないことを`git status`で確認する。
