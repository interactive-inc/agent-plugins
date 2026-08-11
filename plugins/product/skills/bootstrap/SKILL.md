---
name: bootstrap
description: "Bootstrap a new product repository or adopt an existing repository into the product workflow. Use for initial product framing, architecture, stack, workspace, development environment, test baseline, documentation baseline, and minimal scaffolding before ordinary feature development begins."
---

`product:bootstrap`は製品・リポジトリの立ち上げ入口。初期の境界と開発可能なbaselineを作り、通常の機能開発は`product:dev`へ渡す。

# モード

- `new` → [new.md](commands/new.md)。新しい製品・リポジトリを最小構成で立ち上げる
- `adopt` → [adopt.md](commands/adopt.md)。既存リポジトリの実態を保ったままproduct運用へ取り込む
- 引数なし → 対象の有無から`new` / `adopt`を判定し、結果を変える不明点だけ確認する

# 実行契約

- 利用者、解決する問題、対象外、運用制約、完了条件を実装構造より先に確定する
- architectureは境界、依存方向、data ownership、外部I/O、deployment単位を決め、将来候補を先取りしない
- [product:stack](../stack/SKILL.md)、[product:env](../env/SKILL.md)、[product:docs](../docs/SKILL.md)、[product:test](../test/SKILL.md)から必要な能力だけ使う
- scaffoldは合意したarchitectureを実体化する手段として扱い、雛形生成自体を目的にしない
- package追加、外部service、課金、公開API、新規配布単位は明示的な合意なしに追加しない
- 起動、標準check、最小testが実行でき、次の開発依頼を`product:dev`で開始できる状態を完了とする
