# changed — 差分から検証を選ぶ

`/inta:test`または`/inta:test changed`は、default branchとの差分、staged、unstaged、untracked fileから必要な検証を選ぶ。検証だけの依頼ではファイルを変更しない。

## Selection

1. 対象リポジトリの指示と標準quality gateを確認する
2. 比較基点を解決し、変更fileと直接影響するcaller / consumerを列挙する
3. 次の対応で検証を選ぶ
   - pure logic、Application / Domain、data transform → `unit`
   - API / DB / CLI → リポジトリ固有のintegration / endpoint test。公開contractが変わる場合は`api`
   - UI component、style、layout、interaction → `visual`。必要なら`a11y`、performance影響が受け入れ条件にある場合は`perf`
   - 基準sourceとの見た目一致 → `diff`
4. 変更fileのformat / lint / typecheck、focused test、必要な全体gateの順に実行する

仕様trace、既存仕様のdrift、dead code探索などの横断点検は、人間が`inta:check`を直接実行した場合だけ行い、このcommandから自動起動しない。

## Report

選択した検証と理由、成功、失敗、未検査、baseline / environment failureを分ける。実行していない全体testを「影響なし」と推測しない。
