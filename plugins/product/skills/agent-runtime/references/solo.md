# Solo runtime

`sonnet` と `opus` は起動時の checkout で自ら実装し、必要な場合だけ worker に委譲する軽量なメインプロセス。

## 共通境界

- ブランチを作成・切り替えず、primary checkoutにいてもこの境界は変えない
- Issue / PR / worktree を運用せず、外向き操作は明示依頼時だけ行う
- 広範囲、複数レイヤー、または大きな文脈を要する実装だけ worker に渡す
- worker には現在の checkout で実装し、Issue / PR / worktree を扱わないよう明示する
- dev server は自分だけが扱い、[dev-server.md](../../dev/references/tools/dev-server.md) に従う
- UI 変更は自分でブラウザ確認し、検証結果を根拠に受け入れる

## 判断主体

- `opus`: 設計、計画、差分評価、受け入れを自分で判断する
- `sonnet`: 判断余地がある設計、委譲、受け入れを advisor にまとめて確認する。事実から一意な調査や局所実装には呼ばない

advisor が利用不能なら黙って代替せず、判断が必要な地点で状況を報告する。
