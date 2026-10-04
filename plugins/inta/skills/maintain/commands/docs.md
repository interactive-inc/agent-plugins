# docs — .docs の矛盾検出と整理

`/inta:maintain docs [scope]`は、確認済みの`.docs/`とコードの矛盾から、意味が一意な文書追従だけを修正する。検査手順は[inta:check docs](../../check/commands/docs.md)を正本とする。

# 手順

次の順で実行する。

1. 指定scopeの`inta:check docs`結果を確認する。結果が無ければ同じscopeを読み取り専用で検査する
2. 仕様書・READMEと実装、routes / Applicationとfeatures、文書linkのfindingを分ける
3. 既存Issue / PRと重複せず、正本と修正方向が一意なfindingだけを選ぶ
4. 上記に含まれない棚卸し
   - backlogs に完了済みの項目が残っていないか（実装済みなら削除）
   - decisions が現在の実装と矛盾していないか（矛盾は「コード正」で本文を更新するか、決定が覆った旨を追記）
   - milestones の日付が現状計画と合っているか
   - `ephemeral: true` の notes で役目を終えたものの削除
5. コードが正で意味が一意な項目だけ直す。方向性・価値・仕様変更や、コード自体が誤っている可能性がある項目は確認リストへ分ける

# 後始末

- 更新したファイルは dev スキルの「更新時の整合チェック」に従い、連動ファイル（features/index、capabilities、sitemap 等）まで同期する
- リンク健全性の機械チェックがリポジトリにあれば最後に必ず実行する
- branch / worktree / commitは対象リポジトリの運用に従う。docsだけを理由にmain直commitへ決め打ちしない

# 注意

- signals / backlogs の人間ゾーン（dev スキルの human-agent-zone.md）は AI が書き換えない
- 丸ごと再生成しない。矛盾した箇所だけを部分更新し、人間の追記コメントは残す
