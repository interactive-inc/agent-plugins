# skills — install useful Skills

対象リポジトリの技術stackを見て、役に立つSkill packageだけを追加する。`/inta:env skills`という人間の明示呼び出しを追加承認として扱う。他の作業中に暗黙実行してはいけない。

## 起動条件

`/inta:env skills`で起動する。引数は取らない。

## スタック判定

`package.json` の dependencies / devDependencies を読み、該当があれば候補に挙げる。

- `react` があれば `millionco/react-doctor` の `react-doctor` skill を候補にする
- `components.json` が存在する、または dependencies に shadcn 関連パッケージ（`shadcn`、`shadcn-ui`）があれば `shadcn/ui` の `shadcn` skill を候補にする
- `wrangler` が dependencies / devDependencies にある、または `wrangler.toml` / `wrangler.jsonc` がリポジトリ直下にあれば `cloudflare/skills` の `wrangler` `workers-best-practices` `cloudflare` skill を候補にする

該当が無ければ「対象なし」で終了する。無理に候補をひねり出さない。判定基準に無いスタックを見つけても、根拠のある対応パッケージが分からなければ候補にしない。

## 追加

対象リポジトリの指示と利用中agentを確認し、判定できた候補を`vpx skills add`で追加する。`--agent`と`--skill`を必ず明示し、対象外Skillをまとめて入れない。`skill_agent` はClaude Codeなら `claude-code`、Codexなら `codex` とする。

```bash
skill_agent=claude-code
vpx skills add millionco/react-doctor --agent "$skill_agent" --skill react-doctor -y
vpx skills add shadcn/ui --agent "$skill_agent" --skill shadcn -y
vpx skills add cloudflare/skills --agent "$skill_agent" --skill wrangler workers-best-practices cloudflare -y
```

`--skill` を付けずに実行しない。`--list` オプションは使わない。ドキュメント上は「インストールせず一覧表示するだけ」だが、エージェント検出下では実際にはパッケージ内の全 skill をインストールしてしまう（2026-07-20 実機確認）。skill 名が変わってコマンドがエラーを返したら、実行を止めて何が起きたかをオーナーに報告する。

追加後、`vpx skills list` で反映を確認する。

## 報告

追加した skill を一覧で報告する。何を根拠に判定したか（`react` 依存を検出、`wrangler.toml` を検出、等）も添える。

## 禁止事項

- `--skill` を省略した `vpx skills add <owner>/<repo>` を実行しない（skill 名未指定だとパッケージ内の全 skill が対象になりうる）
- `--list` で skill 名を確認しようとしない（実際にはインストールされる）
- 該当が無いのに候補を作らない
- スタック判定に使わなかった根拠（勘・一般論）で候補を挙げない
