# Cloudflare で本番の遅さを測る

Workers + D1 の本番で「遅い」を数字にする手順。Sentry のトレースが無効な製品でも使える。アカウントは `wrangler.<env>.json` の `account_id` で決まるので、`-c` で設定ファイルを明示する。

## D1 の全体像

```bash
bunx wrangler -c wrangler.production.json d1 info <binding>
```

`running_in_region`（Worker との距離）、`database_size`、`read_queries_24h` と `rows_read_24h` の比（1 クエリあたりの走査行数。大きければ全走査の疑い）を見る。

## GraphQL Analytics

OAuth トークンは `~/Library/Preferences/.wrangler/config/default.toml` の `oauth_token`。`https://api.cloudflare.com/client/v4/graphql` に `Authorization: Bearer` で POST する。

- Worker の応答時間の推移: `workersInvocationsAdaptive`（filter: `scriptName`、`datetime_geq/leq`）。`quantiles { wallTimeP50 wallTimeP90 wallTimeP99 cpuTimeP50 cpuTimeP99 }`（単位 µs）、`sum { requests errors subrequests }`、`dimensions { date }`
- D1 の日次: `d1AnalyticsAdaptiveGroups`（filter: `databaseId`）。`sum { readQueries writeQueries rowsRead }`。`readQueries ÷ requests` が往復数/リクエスト
- D1 のクエリ別: `d1QueriesAdaptiveGroups`（filter: `databaseId`）。`count`、`avg { queryDurationMs rowsRead }`、`dimensions { query }`。`orderBy: [count_DESC]` で毎リクエスト走るものが、`[sum_queryDurationMs_DESC]` で重いものが分かる。`count ÷ requests` でリクエストあたりの実行回数を出す

Workers Observability の Telemetry Query API は OAuth トークンでは 403 になる（API トークンが要る）。経路別の応答時間が要るときは `wrangler tail --format json` で実トラフィックを拾い、`event.request.url` と `wallTime` を集計する。

## デプロイ日との突き合わせ

`wrangler deployments list` / `versions list` は直近 10 件しか返さない。古い反映日は GitHub Actions（`gh run list --workflow 'Deploy Production' --json createdAt,conclusion,headSha`）と `git merge-base --is-ancestor <commit> <headSha>` で特定する。

## 未認証の外れ値

`curl -sk -o /dev/null -w '%{time_starttransfer}'` を同じ URL に 5 回以上。静的なページでも 1 回だけ数秒かかるなら isolate 初回のモジュール読み込み。恒常的に速い URL と遅い URL の差は、認証前に走る処理の差。
