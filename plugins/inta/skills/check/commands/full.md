# full — full product audit

人間が`/inta:check full`を明示実行した場合だけ、コードベース全体を読み取り専用で監査する。長時間になり得ること、対象リポジトリ、検査範囲を開始時に示す。

## Scope

1. 対象リポジトリの規約、保護path、generated code、既知の例外、標準検証commandを確認する
2. [inta:env](../../env/SKILL.md)のchecklistを読み取り専用で全件確認する
3. [readme.md](readme.md)、[docs.md](docs.md)、[code.md](code.md)を全対象へ適用する
4. [trace.md](trace.md)を`all`で実行する
5. 対象リポジトリの標準quality gateと既存dead-code checkerを実行し、baseline failureとfindingを分ける

独立領域は利用可能な並行手段へ分けてよいが、特定のagent数や実行基盤を必須にしない。検査できない領域を明示する。

## Finding categories

- rule violation
- type / boundary lie
- potential bug
- dead code
- specification connection failure
- evidence gap

各findingは現在path、適用規則、利用者影響、証拠、反証結果、推奨する独立作業を持つ。修正、削除、Issue作成、report file作成は行わない。
