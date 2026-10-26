# Cloudflare Workers + D1 での手順

Workers と D1 の製品で、範囲の優先順位を決める本番の統計（経路別の wall と CPU、リクエストあたりの DB 呼び出し回数、クエリ別の回数 × 読み行数）と、候補を確定する EXPLAIN を取る手段、この構成に固有の制限・注意。D1 の API 仕様（Sessions API、read replication など）は [D1 の Worker API](https://developers.cloudflare.com/d1/worker-api/) と [read replication](https://developers.cloudflare.com/d1/best-practices/read-replication/) の公式ドキュメントを正本にし、ここには複製しない。

## 目次

- 前提（アカウントと設定ファイル）
- Worker の wall と CPU
- D1 の読み取り
- 実行計画と本番での読み取り専用の確認
- 本番に入れないときのローカルでの測り方
- 配置
- 制限
- SQLite 固有の注意
- 初回起動とデプロイ日の突き合わせ

## 前提（アカウントと設定ファイル）

- 操作する環境は `wrangler -c <wrangler.<env>.json>` で決まる。作業ディレクトリの `wrangler.json` が環境変数のアカウント ID より優先されることがあるので、本番を見るときは必ず設定ファイルを明示する
- 本番の D1・ログ・Analytics を読める権限は人によって違う。`code: 7403 not authorized` が返ったら、トークンの期限切れを疑う前に、ログイン中のアカウントを確かめる
- 本番への `d1 execute --remote` は SELECT / EXPLAIN だけにする。DDL やデータの変更は migration と deploy の経路で行う

## Worker の wall と CPU

- 日別・時間別の分布: GraphQL Analytics の `workersInvocationsAdaptive`（filter: `scriptName` と期間）。`quantiles { wallTimeP50 wallTimeP90 wallTimeP99 cpuTimeP50 cpuTimeP99 }`（単位は µs）、`sum { requests errors subrequests }`。悪化の前後で同じ窓を取る
- 経路別: `wrangler -c <config> tail --format json` で業務時間帯に 10 分ほど拾い、`event.request.url` ごとに `wallTime` と `cpuTime` を集計する。早朝は起動の比率が高く、業務時間帯の代わりにならない
- 工程別: アプリが出す `Server-Timing`。Workers の `performance.now()` は I/O の完了でしか進まないので、工程の値は I/O 待ちの時間であり CPU 時間ではない。CPU は tail の値と並べて判断する
- リクエストのトレース: wrangler 設定の `observability.traces`（`enabled: true`、`head_sampling_rate: 0.05` など）で一部のリクエストを記録すると、各 D1 呼び出しの経過時間と、SQL の実行時間・`rows_read`・試行回数を対応づけられる。SQLの実行時間と呼び出し全体の経過時間を比べ、SQL以外の待ちを切り分ける
- Workers Observability の Telemetry Query API は OAuth トークンでは 403 になり、API トークンが要る

GraphQL の入口は `https://api.cloudflare.com/client/v4/graphql`。wrangler の OAuth トークン（macOS では `~/Library/Preferences/.wrangler/config/default.toml` の `oauth_token`）を `Authorization: Bearer` で渡す。データセットごとに期間 filter の名前が違うことがあるので、エラーになったら introspection（`__type(name: ...)`）で確かめる。

## D1 の読み取り

- 全体像: `wrangler -c <config> d1 info <binding>`。`running_in_region`（計算との距離）、`database_size`、`read_queries_24h` と `rows_read_24h`（比が大きければ全走査の疑い）
- 日別: `d1AnalyticsAdaptiveGroups`（filter: `databaseId`）の `sum { readQueries writeQueries rowsRead }`。`readQueries ÷ Worker の requests` が、リクエストあたりの DB 呼び出し回数になる
- クエリ別: `d1QueriesAdaptiveGroups`（filter: `databaseId`）の `count`、`avg { queryDurationMs rowsRead }`、`dimensions { query }`。`orderBy: [count_DESC]` で毎リクエスト走るものが、`[sum_queryDurationMs_DESC]` で重いものが分かる。読み行数の合計は `count × avg.rowsRead` で出し、上位から見る
- 呼び出しごとのメタ: D1 の応答メタに `rows_read`、`served_by_region`、`served_by_colo`、`served_by_primary` がある。`wrangler d1 execute --remote --json --command "SELECT 1"` で、primary がどの拠点にあるかを確かめられる

D1 の読み行数は従量課金の対象になる。料金と無料枠は [D1 の料金](https://developers.cloudflare.com/d1/platform/pricing/) を確認する。集計する値は対象製品の許可された計測から取得し、共通の手順へ実数を転載しない。

## 実行計画と本番での読み取り専用の確認

```bash
bunx wrangler -c wrangler.production.json d1 execute <binding> --remote \
  --command "EXPLAIN QUERY PLAN <SELECT 文>"
```

- 本番のデータ量でしか計画が変わらないことがある。ローカル（miniflare・bun:sqlite）の計画だけで判断しない
- 新旧の SELECT を同じ引数で本番に流し、結果のハッシュと `rows_read` を比べる（[verify.md](verify.md)）
- bind 値に個人を特定できる値を使うときは、出力をリポジトリや Issue に貼らない。貼るのは行数・時間・ハッシュだけにする

計画は統計の有無で変わる。本番に統計があるかを `SELECT tbl, idx, stat FROM sqlite_stat1 WHERE tbl = '<表>'` で確かめ、ローカルの EXPLAIN を同じ状態にそろえる。migration に `PRAGMA optimize` や `ANALYZE` があると、一部の表にだけ統計が残っていることがある。

EXPLAIN の読み方:

- `SCAN <table>`: 全走査。行数が多い表で出たら疑う
- `SEARCH <table> USING INDEX <name> (<col>=?)`: 索引で絞れている
- `USING COVERING INDEX`: 表本体を読まずに索引だけで済んでいる
- `CORRELATED SCALAR SUBQUERY` / `CORRELATED LIST SUBQUERY`: 外側の行ごとに中身を実行する。中に CTE や集計があれば掛け算になる
- `MATERIALIZE <cte>`: CTE やサブクエリを一時表として組み立てている。外側の条件が中に効いていない兆候のことがある
- `USE TEMP B-TREE FOR ORDER BY / DISTINCT`: 並べ替え・重複除去のために一時表を作っている

## 本番に入れないときのローカルでの測り方

本番の D1 を読めない人や、本番で試せない書き換えは、ローカルの D1 で読み行数を測る。

- Miniflare（wrangler の内部と同じ D1 の実装）で D1 を立てると、`all()` / `run()` の結果の `meta.rows_read` で読み行数が取れる。bun:sqlite などの素の SQLite は読み行数を返さない。sqlite3 CLI の `.scanstats` もビルドによっては使えない

```ts
import { Miniflare } from "miniflare"

const runtime = new Miniflare({
  modules: true,
  script: "export default { fetch() { return new Response(null) } }",
  compatibilityDate: "2026-08-01",
  d1Databases: ["DB"],
})
const db = await runtime.getD1Database("DB")
const result = await db.prepare("SELECT ... WHERE account_id = ?").bind(id).all()
console.log(result.meta.rows_read)
await runtime.dispose()
```

- 本番規模のデータは、再帰 CTE で SQL だけで作ると速い（`WITH RECURSIVE sequence(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM sequence WHERE n < 1000) INSERT INTO ... SELECT ... FROM sequence`）。件数（利用者数 × 月 × 1 人月の行数など）と、値の分布（対象になる行の割合、NULL の割合）を本番に寄せる。スキーマは migration を流して本番と同じにする。D1 は外部キーを強制するので、参照先の表ごと全 migration を順に流す。一部の表だけを作るために `FOREIGN KEY` / `REFERENCES` を外した DDL を使ったときは、そのことを報告に書く
- 計測用の一時スクリプトやデータは、リポジトリの外（OS の一時ディレクトリ）に置く。リポジトリの中に置くと、編集時の hook や lint に止められたり、コミットに混ざったりする
- 「他人のデータが増えても本人の読み行数が増えない」は、このやり方でテストとして残せる
- ローカルの数字は「配信前・合成データ」と明記して報告する。統計の状態（`sqlite_stat1` の有無）も併記する

## 配置

- `placement: { "mode": "smart" }` は、トラフィックの解析後に配置を決める。トラフィックが足りないと移動しない。配置先は対象環境で確認する
- 主な DB の地域が分かっているなら、`placement: { "region": "<対象環境の地域>" }` のように明示する（Cloudflare の拠点の選択であり、AWS へ移すわけではない）
- 反映後に応答ヘッダ `cf-placement` を確かめる（`local-XXX` は移動なし、`remote-XXX` は移動済み）
- 戻すときは `region` を消すか `{ "mode": "off" }` にする。D1 や Worker の旧版を戻す必要はない
- staging や PR プレビューは起動の比率が高く、応答時間を本番の効果検証に代用できない

## 制限

- 1 文の bind は 100 個まで。超えると `too many SQL variables`。テストの bun:sqlite はずっと緩いので、テスト用ラッパーで上限を再現する（[checks.md](checks.md) の「bind」）
- Worker のメモリは 128MB。全 route のコードを評価すると上限に近づくことがある。ビルド成果物で heap を測る検査を置く
- CPU 時間の上限は wrangler 設定の `limits.cpu_ms` で決まる。集計 API の CPU が上限に近づいたら、計算を減らすか分割する
- SQL 1 本の実行時間に上限がある（30 秒）。長い変換は分割する
- `batch` は複数文を 1 往復で送り、トランザクションとして原子的に実行する。依存しない読みをまとめる第一の手段になる
- 行サイズ・batch の大きさにも上限がある。数値は [D1 の制限](https://developers.cloudflare.com/d1/platform/limits/) で確かめる

## SQLite 固有の注意

- `LIKE` は既定で ASCII の大文字小文字を区別しない。BINARY 照合の索引では前方一致の範囲検索にならない。区別の要らない前方一致は `GLOB 'prefix*'` で索引を使える（ワイルドカードの記法が違うので結果集合の一致を確かめる）
- 部分索引（`CREATE INDEX ... WHERE <述語>`）は、クエリの WHERE がその述語を含むと証明できるときだけ使われる。述語が少しずれると黙って使われなくなる
- 外側の WHERE が派生表の内側へ押し込まれない場合がある（LEFT JOIN の右側、集計・窓関数・DISTINCT を含む派生表など）。内側で絞る
- 改訂履歴のように種別の違う行を 1 つの表に持つ設計では、ある種別のための索引が別の種別を読む CTE の計画を変えることがある。種別の述語付きの部分索引にする

## 初回起動とデプロイ日の突き合わせ

- 初回起動: `curl -sk -o /dev/null -w '%{time_starttransfer}\n' <URL>` を同じ URL に 5 回以上。静的なページでも 1 回だけ数秒かかるなら、isolate の初回のモジュール評価を疑う。デプロイの出力にある Worker Startup Time は入口ファイルの評価時間だけで、最初の要求で読み込む chunk の時間を含まない
- デプロイ日: `wrangler deployments list` / `versions list` は直近 10 件しか返さない。古い反映日は CI の実行履歴（`gh run list --workflow <deploy workflow> --json createdAt,conclusion,headSha`）と `git merge-base --is-ancestor <commit> <headSha>` で特定する
