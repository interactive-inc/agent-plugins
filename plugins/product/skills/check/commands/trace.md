# trace — specification trace check

仕様IDを起点に`.docs`、Application、Featureテスト、Journey受け入れ証拠を限定範囲で結び、未接続と潜在仕様バグを読み取り専用で検査する。仕様IDとテスト責任の判定基準は[testing.md](../../test/references/testing.md)を正本とし、このcommandへ複製しない。

## 起動

```text
/product:check trace changed
/product:check trace 00480001
/product:check trace path/to/target
/product:check trace unbound [--limit N]
/product:check trace all
```

引数は次の順で解釈する。

- `changed`: default branch とのブランチ差分、staged、unstaged、untracked の対象から仕様IDを解決する。比較基点を解決できない場合は、取得できた差分だけを対象にして制約を報告する
- `unbound`: 仕様IDを宣言していないApplication操作と、所有者または必要なテスト証拠がない移行済み仕様を監査キューとして列挙する。`--limit` は安定した並び順の先頭N件へ制限する
- `all`: 全ての移行済みFeature / Storyと未紐付けキューを対象にする。コードベース全体の一般的な品質監査ではなく、仕様トレースの全数検査である
- 実在するファイルまたはディレクトリ: 配下と直接の参照元・参照先から仕様IDを解決する
- それ以外: 先頭の0を保持した文字列の仕様IDとして、Feature / Storyを検索する。同じIDが複数文書にある場合は曖昧なまま進めず重複として報告する

引数なしは`changed`とする。どのscopeでもfile、Issue、backlogを変更しない。直接の人間起動なしに開発フローから実行しない。

## 手順

### 1. リポジトリの規約と記法を解決する

対象リポジトリの指示を読み、`.docs` の配置、Application層、テスト配置、default branch、既存の監査スクリプトを確認する。仕様マニフェストや監査スクリプトがあれば先に実行し、そのリポジトリの仕様ID・テストマーカー・移行済み判定を使う。

専用スクリプトがなければ、[testing.md](../../test/references/testing.md)の既定記法を手掛かりに`rg`で次を収集する。

- `.docs` のFeature / Story IDと実装・テスト・受け入れ状態
- Application所有者が宣言する安定した仕様ID
- `[feature:{ID}]` の業務判断テスト
- `[acceptance:{ID}]` の利用者完了テスト

symbol名やファイルパスを文書へ追記して接続を作らない。現在のowner symbolとパスは、IDから毎回生成する監査結果として扱う。

### 2. 入力を同じ仕様スコープへ解決する

入力から見つかったIDごとに仕様文書の種別を判定する。Application操作を表すFeatureではApplication所有者とFeatureテストを、複数操作を横断するStoryでは子FeatureとJourney受け入れ証拠を集める。endpoint、DB、メール、画面などに対象パスが広がっても、同じFeature / Storyの証拠だけを追う。

明示IDのない変更パスは無視せず、直接呼び出すApplicationまたは対応テストからIDを逆引きする。逆引きできなければ `unbound` として結果へ残す。共通ライブラリのように一つの仕様へ所有させられないものは、無理にIDを付けず、影響する呼び出し元だけを列挙する。

### 3. 機械的な接続を検査する

移行済みのApplication操作Featureには一意なApplication ownerとFeatureテストがあることを確認する。ownerは関数、または依存や状態を共有するクラスの具体的なメソッドとして解決する。Storyは子Featureからownerを辿り、Story自身を一つのownerへ押し込まず、文書が要求するJourney受け入れ証拠を確認する。重複ID、文書なしID、Feature ownerなし、証拠なしの実装済み・受け入れ済み宣言、文書とコードとテストのID不一致を失敗として扱う。

未移行Applicationは全体を失敗させず監査キューへ分ける。ただし、新規または移行済みFeatureに見つかった未接続は例外化しない。

### 4. 選択範囲の意味を検査する

[testing.md](../../test/references/testing.md)の「テストの正を分ける」と「潜在仕様バグを探す」を読み、選択したApplication操作とStoryだけに適用する。

各操作について開始状態、成功後、失敗後、再試行後の状態を復元し、永続化順序、対象を絞るキー、競合時の書き込み条件、期限・旧データ、外部I/Oとの境界を実装とテストで確かめる。反例を構成できた場合だけ潜在仕様バグとし、単なる証拠不足はカバレッジ不足へ分ける。

Application / Domain、endpoint E2E、Journey E2E、smokeの責任を混ぜない。endpoint E2Eの存在だけを利用者完了の証拠にせず、同じ業務判断を複数層へコピーすることも要求しない。

### 5. 結果を分けて報告する

最初に検査スコープ、比較基点、利用した専用スクリプト、未検査範囲を示す。その後、次の2つを別々に報告する。

1. `Trace`: IDと仕様種別ごとに文書、Application所有者または子Feature、Featureテスト、Journey受け入れ証拠、接続状態を示す
2. `Semantics`: 確認済みの潜在仕様バグ、カバレッジ不足、製品判断が必要な曖昧さを、根拠となるコード・仕様・テストとともに示す

指摘がなければ、それぞれ `接続異常なし`、`選択範囲に潜在仕様バグの証拠なし` と明記する。検査できなかったことを合格へ数えない。

## 他の入口との境界

- `product:check`: 人間の明示実行を受け、既定ではchangedまたは上限付きunbound、`full`ではallを選ぶ
- `product:test`: 開発差分に必要なunit / a11y / visual / diffを実行し、仕様監査を自動起動しない
- `product:maintain`: この結果から挙動不変の保守だけを別作業として行う
- `product:dev`: confirmed bugまたは仕様変更を別の開発作業として扱う
