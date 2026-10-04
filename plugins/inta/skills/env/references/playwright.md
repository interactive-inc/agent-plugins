# Playwright と playwright-test エージェントの導入

`/inta:env apply`で、Playwrightが未導入のweb productへE2E環境を敷くときの手順。`@playwright/test`と、Playwright公式の`init-agents`が生成するplanner / generator / healerエージェントをセットで導入する。既存プロジェクトで約40本のE2Eテストを整備した運用経験がベース。

導入後のテスト整備は[playwright-agents.md](playwright-agents.md)、テスト作成・実行時のハマりどころは[playwright-pitfalls.md](playwright-pitfalls.md)、プロジェクト固有仕様の事前調査は[playwright-project-context.md](playwright-project-context.md)を参照する。

## 前提条件とパラメータ

以下が揃っていないものがあれば、先に解決するよう案内してから再開する。

- ローカルで対象サイトがURLでアクセスできる（baseURLが決まっている）
- Bun / Node.js / pnpm / yarnのいずれかが使える（Bun推奨）
- Gitリポジトリ配下である
- 主要ページ（トップ・一覧・詳細・フォーム等）が表示できる
- 一覧ページに最低1件のデータがある
- フォームを使う場合、フロントエンドが組み上がっている

確認が取れたら次を聞く。

- ランタイム（`bun` / `npm` / `pnpm` / `yarn`）
- baseURL（例: `http://example.localhost`）
- プロジェクトルートのパス（カレントでよければそのまま）

## 依存関係のインストール

選択されたランタイムに合わせ、必ずプロジェクトルートで実行する。

```bash
# Bun
bun add -D @playwright/test
bunx playwright install chromium

# npm
npm install -D @playwright/test
npx playwright install chromium

# pnpm
pnpm add -D @playwright/test
pnpm exec playwright install chromium

# yarn
yarn add -D @playwright/test
yarn playwright install chromium
```

ブラウザは`chromium`のみで十分なケースが多い。`firefox` / `webkit`は必要になってから追加する。

## playwright.config.tsの配置

[assets/playwright.config.ts](../assets/playwright.config.ts)をプロジェクトルートにコピーし、`baseURL`をユーザー指定値に書き換える。このファイルは次の`init-agents`では生成されないので手動で配置する。先にconfigを置いておくと`init-agents`がprimary projectを正しく識別できる。

設定の要点（基本は触らない）。

- `testDir: './specs'`: テストディレクトリ
- `outputDir: './specs/test-results'`: 生成物をspecs/配下に閉じ込める。省略するとデフォルトで親ディレクトリにtest-resultsが出るため必ず明示する
- `reporter`: list（ターミナル）とhtml（specs/playwright-report/、自動起動なし）の組み合わせ
- `baseURL`: `http://your-site.localhost`をユーザーから聞いた値で置き換える
- `projects`: chromiumのみ

## init-agentsの実行

MCP設定・シード・エージェント定義を一括生成する。npm / pnpm / yarnの場合は先頭を`npx` / `pnpm exec` / `yarn`に置き換える。

```bash
bunx playwright init-agents --loop=claude
```

自動生成されるファイル。

- `.mcp.json`: playwright-test MCPサーバー定義
- `seed.spec.ts`: generatorが踏襲するシードテスト
- `specs/README.md`: 計画書用ディレクトリの説明
- `.claude/agents/playwright-test-planner.md`
- `.claude/agents/playwright-test-generator.md`
- `.claude/agents/playwright-test-healer.md`

これらはPlaywrightが生成・更新する管理物なので、プラグイン側に手書きのコピーを持たない。既存の`.mcp.json`や`seed.spec.ts`がある場合、このコマンドは上書きする。既存設定を残したい場合は事前にバックアップを取るか、実行後に手動でマージする。

## specs/.gitignoreの配置

[assets/specs.gitignore](../assets/specs.gitignore)を`specs/.gitignore`としてコピーする。`specs/`自体は`init-agents`が作っているのでmkdirは不要。

内容はPlaywright実行時の生成物（test-results / playwright-report / blob-report / .last-run.json）をignoreする設定。`specs/`配下に置くのは、他案件へ`specs/`をディレクトリごとコピーした際にignore設定もセットで持っていけるようにするため。

## ルート.gitignoreへの追記

プロジェクトルートの`.gitignore`末尾に以下を追記する。既に同一エントリがあれば追記しない。存在しなければ新規作成する。

```
# Playwright (MCP サーバー固有、specs/ 配下に収まらない)
/.playwright-mcp/
/playwright/.cache/
```

- `.playwright-mcp/`はplaywright-test MCPがセッション中に作るページスナップショット格納先。MCPサーバーがCWD基準で作るため`specs/`内に移動できない
- `playwright/.cache/`はPlaywright内部キャッシュ（保険）

## 動作確認

```bash
bunx playwright --version   # または npx / pnpm exec / yarn 版
```

バージョンが表示されれば依存関係OK。MCPサーバーが動くかは、`.mcp.json`を読み込んだ後に`playwright-test`のツールが使えるかで確認する（セッションの再起動が必要な場合あり）。ユーザーには「Claude Codeを一度再起動するとMCPツールが使えるようになります」と伝える。

## プロジェクトコンテキストの収集

plannerに計画を立てさせる前に、プロジェクト固有の独自機能・仕様を調査して`specs/project-context.md`にまとめる。手順とチェックリストは[playwright-project-context.md](playwright-project-context.md)。この中間仕様書をplanner / generator / healerすべてに毎回渡すことで、独自実装に対するテスト精度が大きく上がる。

## 完了報告

- 作成・更新したファイルの一覧（`playwright.config.ts` / `.mcp.json` / `seed.spec.ts` / `specs/README.md` / `.claude/agents/playwright-test-{planner,generator,healer}.md` / `specs/.gitignore` / `specs/project-context.md` / ルート`.gitignore`追記）
- 設定されたbaseURL
- インストールされたPlaywrightバージョン
- 次のステップ（[playwright-agents.md](playwright-agents.md)の順序）
