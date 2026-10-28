# Portless

ローカルサーバーを起動する必要があるときだけ使う。ユーザーの通常の起動フローを妨げない。

## package.jsonのscripts

- scriptsに`portless`を書かない（`"dev": "portless run next dev"`は禁止）
- scriptsはプレーンなコマンドにする（`"dev": "next dev"`、`"dev": "vite"`）
- `dev` scriptが無ければ追加する（portlessが起動対象として参照する）

## セットアップ / アンインストール

- セットアップ手順（未導入なら手動実行を促す）
  1. `vp i portless -g`
  2. `portless trust`（CA trust。sudoが必要なのでAIは実行せずユーザーに依頼する）
  3. `portless service install`（LaunchDaemon登録。管理者パスワードが必要なのでAIは実行せずユーザーに依頼する）
- 状態確認: `portless service status`でdaemonの状態を見る
- アンインストール: `portless service uninstall`（LaunchDaemon削除）に加えて`portless clean`でCA / state / hostsを消す
- 導入済みならmacOS再起動後もLaunchDaemonがrootでportless proxyを自動起動する。ターミナル操作は不要

## proxy port

- 既定ポート（HTTPS 443）を使う。URLにポートを付けない
- LaunchDaemonがrootで起動するためsudoプロンプトは出ない

## 起動コマンド

- サーバーを起動するときは`portless --script dev`（`dev` scriptをproxy経由で実行）を使う
- 別scriptを使う場合は`portless --script <name>`
- app名は`package.json` / gitルート / ディレクトリ名から自動推定する。上書きは`--name <app>`

## URLルール

- `https://<app>.localhost`（ポート無し）で開く
- worktreeではportlessの自動prefixに従う: `https://<branch>.<app>.localhost`
  - linked worktreeはブランチ名をsubdomainとして自動で先頭に付ける
  - main worktreeにはprefixが付かない（`https://<app>.localhost`）
- ブランチ名にスラッシュを含む場合はportlessの既定に従う（必要なら`--name`で上書き）

## TLD

- 既定の`.localhost`を使う（Chrome / Firefox / Edgeが127.0.0.1へ自動解決する）
- 必要な場合だけ`--tld test`または`PORTLESS_TLD=test`で切り替える
