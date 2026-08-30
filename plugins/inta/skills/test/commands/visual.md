# visual — UI変更の実表示検証

`/inta:test visual`は、UI変更を実applicationで操作し、描画、状態遷移、responsive、console / network errorを確認する。push前でも実行できる。

## Workflow

1. リポジトリ指示から正規のdev server、URL、account、seed、browser手段を確認する。独自portや別serverを勝手に起動しない
2. 変更componentが現れるpageとstateを特定する
3. representativeなdesktop / mobile viewportで、到達、操作、success、empty、errorなど変更に関係するstateを確認する
4. layout、overflow、focus、loading、transition、console error、失敗したrequestを確認する
5. screenshotが必要なら`/tmp/product-test/visual/<run>/`だけに保存する。repo内へ置かない

before状態を得るために、並行作業を含むworktreeをstash、revert、checkoutしない。既存のreference URL / image / cleanな別worktreeが安全に使える場合だけ比較し、なければ現在の受け入れ条件を検証する。

## Evidence

結果は次の形で文章化する。

- URL
- account / role
- viewport
- action
- expected / actual
- console / network result
- untested state

対象リポジトリがscreenshot保存・uploadを禁止している場合は、確認後に全画像を削除する。許可があっても外部uploadはユーザーまたはリポジトリが明示した場合だけ行う。
