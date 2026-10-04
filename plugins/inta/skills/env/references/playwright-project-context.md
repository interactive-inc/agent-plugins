# プロジェクトコンテキストの収集

テスト対象プロジェクトの独自機能・仕様を事前に洗い出し、`specs/project-context.md`にまとめる。カスタムフィールド・独自管理画面・Excelインポート・静的化処理のような独自機能は、ブラウザ探索だけでは「何が正しい挙動か」まで掴めない。コード探索とユーザーヒアリングでここを埋める。

## 出力先

必ず`specs/project-context.md`に書き出す。

- `workspace/`には置かない（specs/に閉じ込める方針）
- gitにコミットしてチームで共有する
- 仕様が変わったら該当箇所を再調査して更新する
- 廃止機能は削除ではなく「(廃止 YYYY-MM-DD)」注記で残すとレビューで気づきやすい
- 書ききれないほど大規模になったら、機能別に`specs/context/`配下へ分割する

## 共通チェック項目

どのスタックでも先に確認する。

- `.docs/` / `docs/` / `README.md` / `CLAUDE.md`に書かれたサイト仕様
- 主要な画面とURL一覧、エントリーポイント付近のルーティング定義
- 管理画面・フォームのURLと期待挙動
- 認証が必要な画面の範囲（storageState戦略が必要になるか）
- ファイルアップロードを含むフォームの仕様（受付形式・サイズ上限）
- 時間のかかる処理（バッチ処理、静的化等）の想定処理時間。fixtureやtimeout調整が必要な箇所
- 外部サービス連携の有無（決済・メール送信・認証等）
- ローカル環境で再現できない機能

## WordPressプロジェクト

```bash
grep -rn "register_post_type" wp-content/themes/ wp-content/plugins/   # カスタム投稿タイプ
grep -rn "add_menu_page\|add_submenu_page" wp-content/                  # 管理画面メニュー
grep -rn "wp_ajax_\|admin_post_" wp-content/                            # Ajax / admin_post
find . -type d -name "acf-json"                                         # ACF フィールド
grep -rn "acf_add_local_field_group\|get_field" wp-content/
grep -rn "add_shortcode" wp-content/                                    # ショートコード
grep -rn "register_rest_route" wp-content/                              # REST API
```

書き出す項目。

- サイト概要（WordPressバージョン、テーマ、主要プラグイン）
- カスタム投稿タイプ一覧と管理画面URL・フロントURL
- カスタムフィールド（投稿タイプごとに列挙）
- カスタム管理画面のURL・機能・期待挙動
- 独自ボタン・Ajax処理（処理時間、完了判定方法）
- ショートコード一覧
- REST / Ajaxエンドポイント
- フィクスチャが必要なもの（インポート用Excel、テスト用画像等）
- 認証情報（テスト用管理者ユーザー、storageState置き場）

## Laravelプロジェクト

```bash
php artisan route:list                                        # ルート一覧（一番確実）
cat routes/web.php routes/api.php routes/admin.php 2>/dev/null
ls database/migrations/                                       # テーブル構造
find app/Models -name "*.php"                                 # モデル一覧
find app -name "*Request.php"                                 # フォームリクエスト
cat config/auth.php                                           # 認証設定
```

書き出す項目。

- サイト概要（Laravelバージョン、主要パッケージ）
- ルート一覧（認証要否・ロール要否を付記）
- 主要モデルとリレーション
- フォームバリデーションルールの要点
- ジョブ・コマンドなど非同期処理
- 外部API連携（モックが必要なもの）
- シーダー・ファクトリの有無

## SPAプロジェクト（React / Vue / その他）

```bash
grep -rn "createBrowserRouter\|<Route\b\|defineRoutes\|RouterModule" src/   # ルート定義
find src -path "*api*" \( -name "*.ts" -o -name "*.tsx" -o -name "*.vue" \)  # API クライアント
find src -path "*store*"                                                     # 状態管理
grep -rn "requireAuth\|authGuard\|ProtectedRoute" src/                       # 認証ガード
```

書き出す項目。

- フレームワークとバージョン
- ルート一覧
- 認証フロー（ログイン・セッション維持・ログアウト）
- 主要APIエンドポイント（バックエンド側で認証要否を確認）
- 状態管理の範囲（永続化される値の有無）
- モックが必要な外部依存

## ユーザーへの確認

検出結果を提示し、次を聞き取ってから反映する。

- 期待挙動が明示されていない箇所の正解
- テスト対象外にする機能（外部連携、ローカルで動かない機能等）
- 既知のハマりやプロジェクト固有の前提（初回モーダル回避のキー名等）
- フィクスチャとして必要なサンプルファイルの有無

## エージェントへの渡し方

planner / generator / healerを呼ぶ際、プロンプトに次を必ず含める。

> 事前に `specs/project-context.md` を読み、プロジェクト固有の仕様を把握した上で作業すること

## 書式例（WordPress想定）

```markdown
# プロジェクトコンテキスト

## サイト概要

- 種別: WordPress 6.x
- テーマ: custom-theme
- 主要プラグイン: ACF Pro, Custom Post Type UI

## カスタム投稿タイプ

timetable

- 管理画面URL: /wp-admin/edit.php?post_type=timetable
- フロント: /timetable/{slug}/
- アーカイブ: /timetable/

## カスタムフィールド（ACF）

timetable 投稿に付与

- departure_station (text): 出発駅
- arrival_station (text): 到着駅
- departure_time (time_picker): 出発時刻

## カスタム管理画面

/wp-admin/admin.php?page=timetable-import

- 機能: Excel から時刻表をインポート
- 受付形式: xlsx（列: 駅名, 時刻）
- サンプルファイル: specs/fixtures/timetable-sample.xlsx
- 期待動作: 成功時に「インポートが完了しました」が表示される

## 独自ボタン・Ajax 処理

静的化実行

- URL: /wp-admin/admin.php?page=static-gen
- 処理時間: 30 秒〜2 分（timeout 180_000 推奨）
- 完了判定: .static-gen-done クラスが表示される

## ショートコード

[timetable_table category="..."] — 時刻表テーブルを表示

## フィクスチャ

- specs/fixtures/timetable-sample.xlsx — インポート正常系
- specs/fixtures/timetable-broken.xlsx — 列数違いエラー検証用

## 認証

- 管理者ユーザー: admin / (env経由で渡す)
- storageState: specs/.auth/admin.json（globalSetup で生成、テスト時は再利用）

## テスト対象外・既知のハマり

- 静的化は他テストと並行実行不可 → serial 指定
- 外部決済連携はローカルで動かないのでスキップ
- オープニングアニメーション回避: sessionStorage に opening-shown をセット
```
