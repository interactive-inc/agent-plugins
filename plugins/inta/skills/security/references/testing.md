# Security testing

## Reconnaissance

- route、API、WebSocket、upload、header、cookie を含む入力点を列挙する
- session / JWT / OAuth、role 境界、認証なし route を確認する
- database、cache、外部 fetch、template / HTML 出力まで data flow を追う

## Hypotheses

次を優先し、汎用 checklist の全消化を目的にしない。

- 認証・認可 bypass と水平 / 垂直権限昇格
- injection、XSS、unsafe deserialization、path traversal
- upload、SSRF、open redirect、CORS / CSP / cookie の不備
- secret、stack trace、内部識別子の漏洩

各仮説にコード根拠、具体的対象、最小手順、成功条件を付ける。

## Verification

- 静的解析で validation と authorization の実 boundary を確認する
- runtime test は少数の明示 request に限定し、status、header、body、server error を記録する
- browser が必要な XSS や client storage だけ実ブラウザで確認する
- 防御された仮説も、どの boundary が機能したか記録する

## Report

vulnerability ごとに severity、影響、根拠 path / line、再現手順、修正方針を示す。未確認の可能性と再現済みの問題を分け、最後に優先順位と有効だった防御をまとめる。
