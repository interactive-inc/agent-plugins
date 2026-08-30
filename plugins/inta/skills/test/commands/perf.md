# perf — web performance regressionを測定する

`/inta:test perf [URL|scope]`は、同じ条件で複数回計測し、現在値、ばらつき、baselineとの差を報告する。単発のLighthouse scoreだけで回帰を断定しない。

## 手順

1. URL、build mode、account / state、device profile、network / CPU条件、比較baselineを固定する
2. 対象リポジトリの既存Lighthouse CI、Web Vitals、performance budgetがあればそれを使う。無ければ利用可能なbrowserまたはLighthouse CLIを選ぶ
3. cold / warm条件を混ぜず、原則3回以上計測して中央値と範囲を記録する
4. LCP、CLS、INPまたは代替のinteraction metric、TTFB、script / asset sizeなど、変更と関係する指標だけを評価する
5. 既存budgetまたは明示baselineと比較する。一般的な目安をproject固有の合否基準に置き換えない
6. 回帰がある場合、request waterfall、bundle、render、layout shift、long taskなど原因候補を追加計測で絞る

## 成果物

- raw reportとscreenshotは`/tmp/product-test/perf/<run>/`へ置く
- baselineを継続保存するのは、対象リポジトリが保存先と更新条件を定めている場合だけ
- URL、commit、計測条件、各run、中央値、baseline差、環境要因、未検査を報告する

browser runtimeやLighthouse packageが無ければ勝手に追加しない。local dev modeとproduction buildのscoreを直接比較しない。
