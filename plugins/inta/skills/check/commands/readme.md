# readme — entry document check

`/inta:check readme [scope]`はREADME.mdとAGENTS.md / CLAUDE.mdなどのagent向け指示を読み取り専用で点検する。

1. rootと各workspaceの入口文書、agent別rulesを列挙する
2. command、path、URL、設定名、runtime versionが現在の実装に存在し、実行可能か確認する。安全に実行できないsetup / deploy手順は未確認として分ける
3. 人間向け情報とagent向け制約が適切な文書に置かれているか確認する
4. 重複、解決済み注意書き、現在と矛盾する記述、保護sectionを分類する
5. 記述を削除・移動せず、source path、根拠、推奨先だけを報告する

READMEが存在しない場合は、人間の入口として必要かをfindingにし、作成するなら`inta:docs readme`へ渡す。

感触だけで古いと判定せず、現在の実装または規則で反証できたものだけをfindingにする。
