# default — periodic product examination

`/inta:check`は対象全体を読み取り専用で定期検診する。開始時に対象repository、比較基点、除外対象、利用可能なcheckerを示す。

次を独立categoryとして順に実行する。

1. [specs.md](specs.md)
2. [architecture.md](architecture.md)
3. [duplication.md](duplication.md)
4. [tests.md](tests.md)
5. [docs.md](docs.md)
6. [runtime.md](runtime.md)
7. [security.md](security.md)

安全に検査できないcategoryは省略せず`未検査`として理由を残す。findingがないcategoryも明記し、最後に優先度、影響、根拠、推奨する独立した`inta:dev`作業をまとめる。

修正、削除、Issue作成、report保存、依存追加、設定変更は行わない。
