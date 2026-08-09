# prettier / eslint / biome の廃止と vp への一本化

検証ツールが複数あると設定の食い違い（セミコロン・quote・import 順）で整形が往復する。vp check / vp fmt に一本化し、他は依存ごと消す。

# 検出

次を順に見て、残骸を洗い出す。

- package.json の devDependencies: `prettier`、`eslint`、`biome` / `@biomejs/biome`、`eslint-config-*`、`eslint-plugin-*`、`@typescript-eslint/*`、`prettier-plugin-*`
- 設定ファイル: `.prettierrc*`、`prettier.config.*`、`.prettierignore`、`.eslintrc*`、`eslint.config.*`、`.eslintignore`、`biome.json*`
- package.json の scripts: `lint` / `format` / `fmt` が上記ツールを呼んでいないか
- `.vscode/settings.json`: `editor.defaultFormatter` や `editor.codeActionsOnSave` が prettier / eslint を指していないか
- CI（`.github/workflows/*.yml`）: eslint / prettier の実行ステップ
- husky / lint-staged: `.husky/`、package.json の `lint-staged` フィールド（vp の staged と二重になる）

# 手順

1. ブランチを切る（全体整形の差分が出るため main 直は不可）
2. 依存を削除する: `bun remove prettier eslint ...`（検出したもの全部。husky / lint-staged も vp staged に置き換わるなら削除）
3. 設定ファイルを削除する（`.prettierignore` に独自の除外があれば `.gitignore` か vp 側の除外に引き継いでから消す）
4. scripts を置き換える: `"lint": "vp check"`、`"format": "vp fmt --write ."`。旧ツール名の script は残さない
5. `.vscode/settings.json` から旧ツール参照を外す。保存時整形に頼らず、コミット時の vp staged フックを整形の正本にする
6. CI の eslint / prettier ステップを `vp check` に置き換える
7. [vite-config.md](vite-config.md) の標準形で vite.config.ts を整える（既にあれば fmt / lint / staged の 3 点が揃っているか確認）
8. `vp check --fix` をリポジトリ全体にかけ、出た差分だけを `style: migrate formatting to vp fmt` の単独コミットにする
9. `bun install` → ダミーコミットで hook 発火を確認 → CI 緑を確認してからマージ

# 注意

- eslint ルールで独自に守っていた規約（import 制限など）があれば、消す前に vp check で同等の検査が効くかを確認する。効かないものはリポジトリのカスタム lint スクリプト（`scripts/check-*.ts` 方式）に移してから廃止する
- 生成物ディレクトリが prettier の除外に入っていた場合、vp staged 側の除外（vite-config.md 参照）に必ず引き継ぐ
