# /inta:dev next

コード、docs、signal、backlog、Issue / PRから、まだ記録されていない価値の高い次候補を探す。既定はbounded read-only scanで、候補をチャットに返す。

## 起動

```text
/inta:dev next
/inta:dev next <path-or-theme>
/inta:dev next --all
/inta:dev next <scope> --write
```

- 引数なし: changed fileと直近のsignal / backlog / Issueを中心に最大20候補
- path / theme: 指定範囲だけ
- `--all`: リポジトリ全体。時間と未検査範囲を先に示し、明示時だけ実行する
- `--write`: 確定候補をリポジトリ既定の記録先へ追記する

## 手順

1. 製品vision、現在のmilestone、既存tasks / backlog / signal、open Issue / PR、recent changesを確認する
2. 対象に合う4〜8個のlensを選ぶ。例: 仕様drift、価値gap、実装漏れ、権限、data lifecycle、failure / retry、test gap、運用・rollback
3. 各lensで具体的なpath、利用者影響、再現条件または欠けた証拠を収集する
4. 反証して推測だけの候補を棄却し、既存記録との重複を除く
5. blocker / high / medium / lowで優先し、今やる理由と次の最小行動を示す

利用可能なら独立lensを並行してよいが、特定のagent基盤、最低agent数、token量を前提にしない。探索できなかった範囲は明示する。

## 出力と書き込み

候補ごとに`title / impact / evidence / existing-record check / next action`を示す。根拠の無い一般論は候補にしない。

`--write`なしではファイルやIssueを変更しない。`--write`でも既存sectionへ最小限追記し、Issue起票や実装へは進まない。
