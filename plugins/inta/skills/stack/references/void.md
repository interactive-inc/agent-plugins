# Void

新規のWeb製品の標準基盤。`void` と `@void/*` を使う。導入版の公式資料を正本にする。

## 調べる入口

まず対象製品に導入された `void` の版、設定、公式スキルを確認する。資料の正本は `node_modules/void/docs/`。導入済みの公式 `void` スキルがあればそれを使い、なければ [公式資料](https://void.cloud) の該当箇所を読む。

- 初期構築：`docs/guide/quickstart.md`
- 製品の種別と配置：`docs/guide/app-types.md`
- 画面とサーバー処理：`docs/guide/pages-routing/`、`docs/guide/server-routing.md`
- 命令：`docs/reference/cli.md` と該当する `docs/reference/cli/` の資料

## 配置

製品ルートに `AGENTS.md`・`.docs/`・実行設定を置く。新規製品は導入版の公式生成器が作る配置を維持し、画面は `pages/`、サーバーの入口は `routes/` を基本にする。具体的な配置と伴うサーバーファイルは導入版の公式資料に合わせる。

業務判断と外部入出力は画面や経路へ詰め込まず、製品内の `domain/`・`application/`・`infrastructure/` に責務で分ける。小さな試作で不要な層や空のフォルダは作らない。複数のアプリと共有部品が実際に必要な場合だけ `apps/`・`packages/` を導入する。

既存製品の構成が違う場合は、製品の指示を読み、移行を今回の範囲へ含めるかを決める。設定の存在だけで公開先を推測せず、配備は依頼された環境と範囲で行う。
