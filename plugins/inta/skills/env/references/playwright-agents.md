# playwright-testエージェントのワークフロー

[playwright.md](playwright.md)のセットアップ完了後にテストを整備するフェーズのガイド。ブラウザを操作してテスト計画書を作る、計画書を元にテストファイルを生成する、失敗テストを修正する、の3段階。

役割分担。

- 人間: 仕様整理・最終レビュー・データ整備
- `@agent-playwright-test-planner`: テスト計画書の作成
- `@agent-playwright-test-generator`: 計画書1項目につき1テストファイルの生成
- `@agent-playwright-test-healer`: 失敗テストの修正

## テスト計画書の作成

プロジェクト固有の仕様を事前にまとめた`specs/project-context.md`を参照させる（無ければ[playwright-project-context.md](playwright-project-context.md)で先に作る）。テストファイルのパス規約も明示して`specs/`配下に揃える。

```
@agent-playwright-test-planner
事前に specs/project-context.md を読んでプロジェクト固有の仕様を把握した上で、サイトをクロールしてテスト計画書を作って。
テストファイルのパスは必ず specs/<section>/<test-name>.spec.ts 形式で計画すること（tests/ 配下に書かない）。
seed ファイルは プロジェクトルートの seed.spec.ts を参照する。
```

パス規約を明示しないと、generatorの内部例示が`tests/`ベースのため計画書が`tests/...`で書かれることがある。`testDir: './specs'`によって実行時は`specs/`以下しか拾わないが、計画段階で揃えておいた方が事故が少ない。

エージェントは主要ページを実際に開き、DOM構造・JSコンポーネント・URLパラメータの挙動を確認し、テスト項目を機能別にグルーピングして`specs/test-plan.md`へ書き出す。各項目の構造は次の通りで、generatorがこのまま読み取る。

```markdown
### N. セクション名

**Seed:** `seed.spec.ts`

#### N.M. テスト名

**File:** `specs/section/test-name.spec.ts`

**Steps:**

1. アクション
   - expect: 期待値
```

plannerの生成物は完璧ではない。人間が次を確認する。

- 重要機能が抜けていないか
- データ依存（投稿件数、カテゴリ存在等）の前提が現実的か
- フォーム送信やデータ変更を伴うテストの扱い（送信せず確認画面までで止めるなど）
- テスト名・ファイル名の命名規約の一貫性

## テストの生成

計画書の各項目に対して呼び出す。プロンプト冒頭で必ず`specs/project-context.md`を参照させる。

```
@agent-playwright-test-generator
事前に specs/project-context.md を読み、プロジェクト固有の仕様・カスタムフィールド・独自管理画面・フィクスチャを把握した上でテストを書くこと。

<test-suite>セクション名</test-suite>
<test-name>テスト名</test-name>
<test-file>specs/section/test-name.spec.ts</test-file>
<seed-file>seed.spec.ts</seed-file>
<body>
Steps: ...（計画書の該当箇所をそのまま貼る）

注意:
- プロジェクト固有の前提条件（オープニングアニメーション回避など）
- Biome 準拠など
</body>
```

playwright-test MCPサーバーはブラウザ状態を共有するため、並列実行は競合する。順次1件ずつ実行する。1テスト生成に60〜180秒、40件で30〜60分を見込む。

すべてのテストに共通する前提は毎回プロンプトに含める。

- オープニングアニメーション / 初回モーダル等の回避方法（`sessionStorage`キー名）
- リンター / フォーマッタの規約（Biome、Prettier、ESLint等）
- 命名規約、ファイル配置ルール
- 必要なビューポートサイズ（PC / SP）

## テスト実行

```bash
bunx playwright test                                   # 全件
bunx playwright test specs/header                      # セクション単位
bunx playwright test specs/header/gnav-open-close.spec.ts
bunx playwright test --last-failed                     # 失敗のみ再実行
bunx playwright show-report specs/playwright-report    # HTML レポート
bunx playwright test specs/foo --debug                 # ステップ実行
bunx playwright test specs/foo --headed                # ブラウザ表示
bunx playwright test --trace on                        # 全テストで trace 取得
```

CLIで`--reporter=list`のように単体指定するとconfig側のreporter配列を上書きし、HTMLレポートが生成されない。configの設定を使いたいときは`--reporter`を付けずに実行する。

出力先。

- ターミナル: `list`レポーターの結果
- `specs/test-results/<test-name>-chromium/`: 失敗したテストの成果物（error-context.md、スクリーンショット等）
- `specs/playwright-report/index.html`: 全テスト分のHTMLレポート
- `specs/.last-run.json`: 直近実行の状態（`--last-failed`用）

テストは機能 / ページ別のディレクトリ（`specs/header/`、`specs/modal/`等）で分けると、セクション単位で実行できて扱いやすい。

## 失敗テストの修正

まず原因を切り分ける。

サイト側の問題（実装バグ、データ不足）の場合。

- データ整備（投稿追加、フォーム実装完了等）で解消できるなら整備する
- 実装バグならIssue化してテストはそのまま残す
- 環境依存で本番では通るならコメントを残す

テスト側の問題（セレクタ誤り、CSS computed値、フォーカス等）の場合。

- `@agent-playwright-test-healer`に修正を依頼するか自分で修正する。healerにも必ず`specs/project-context.md`を参照させる
- 失敗の`error-context.md`とpage snapshotを見て根本原因を特定する
- 次回以降のテスト生成プロンプトに注意点を追加して再発を防ぐ

よくある失敗パターンは[playwright-pitfalls.md](playwright-pitfalls.md)。

## 環境依存テストの扱い

データ件数依存のテスト（ページネーション、フィルタ等）はローカルでデータが少ないとスキップしたい。`test.skip()`を使う。

```ts
const nextButton = paginationContainer.locator('[data-action="next"]')
if ((await nextButton.count()) === 0) {
  test.skip(true, "投稿数が perPage 以下のためページネーションが表示されない")
  return
}
```

実装が未完成なフォーム等は、計画書通りにテストを書いて実装完了後に通る状態にしておく。`test.fail()`で「現状失敗が期待値」と明示する手もあるが、原則は実装側を直す。
