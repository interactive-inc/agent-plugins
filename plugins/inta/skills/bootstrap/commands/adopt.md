# adopt — existing repository bootstrap

1. 現在のruntime、workspace、entrypoint、architecture、data、test、CI、deployment、文書を実態から棚卸しする
2. 動いている境界と暗黙の制約を先に記録し、理想構造へ全面再配置しない
3. 開発を始めるために不足する最小baselineだけを提案する
4. 合意された範囲で環境、test入口、docs索引、architecture記録を追加・修正する
5. repository標準commandでbaselineを検証し、既存failureと今回のfailureを分ける
6. 構造改善候補は自動修正せず、点検なら`inta:check`、挙動不変の手入れなら`inta:maintain`、機能・bug修正なら`inta:dev`へ渡す

既存のpackage、workspace、公開API、deployment単位を「綺麗にする」だけの理由で統合・分割しない。
