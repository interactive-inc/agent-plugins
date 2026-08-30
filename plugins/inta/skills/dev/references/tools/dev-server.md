# 開発serverの起動

UI / HTTP検証でdev serverが必要な場合の共通境界。実際のcommand、checkout、URL、port、proxy、DB seedは対象リポジトリの指示を正本にする。

## Before start

1. repository instructionsとpackage script / Makefileを読み、正規commandとURLを特定する
2. 指定URLへ軽いrequestを送り、既存serverが現在のcheckoutを検証できるか確認する
3. worktreeでのserver起動可否、必要なenv / DB / seed、migration影響を確認する
4. server名やportが指定されている場合は形を変えない。別portや別proxyで回避しない

現在のcheckoutを検証できる既存serverが使える場合は新規起動しない。別checkoutのコードを配信するserverは代用しない。自分が所有しないprocessをrestart / stopしない。

## Start

- repositoryが指定するwrapper commandをそのまま使う。素のframework commandへ置き換えない
- Issueの検証ではIssue用linked worktreeのserverを使い、primary checkoutのブランチへ切り替えない
- worktree serverが禁止されている、またはenv、DB、port、cleanupを安全に分離できない場合は、primary checkoutで代用せず検証のblockerとして報告する
- migrationがshared local DBを先行させる場合は、人間判断が必要な変更として止める
- portlessやcertificate、system serviceの新規導入は、人間が`inta:env`を明示実行した場合だけ提案・適用する

## During verification

利用したURL、server command、checkout、account / seedを記録する。proxy error、application error、API errorを分け、代替portで症状を隠さない。

## Stop or keep

repositoryが常駐serverを前提にする場合は停止しない。今回だけの一時serverとして自分が起動し、他の作業が使っていないことを確認できる場合は、検証後に同じsessionから終了する。判断できなければprocessを触らず、状態を報告する。
