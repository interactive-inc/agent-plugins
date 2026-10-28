# 開発環境

環境の点検・修復・初期化を依頼されたときに読む。調査だけなら読み取り専用。変更まで依頼されていれば合意した範囲で適用し、開発中に無関係な環境移行を始めない。追加スキルが必要な場合だけ [導入手順](skills.md) を使う。

## 確認するもの

- 対象製品の指示・既存構成と [stack](../stack/index.md) の標準。
- 起動、依存導入、format / lint / typecheck / test の実行定義と CI。採用済み Git hook は通常の commit 経路でも動くか。
- [worktree 初期化](worktree.md)、unit と E2E の探索境界、秘密値・生成物の ignore。

変更には既存の独自設定を保持し、必要な差分だけ適用する。全体整形や基盤移行を今回の環境修正へ混ぜない。依存やサービスの追加は、対象リポジトリの承認範囲に従う。

## 必要時の参照

- [lint / format の移行](migrate-linters.md)、[Vite 設定](vite-config.md)
- [Playwright](playwright.md)、[portless](portless.md)

適用後は変更した経路を実行し、試験が0件の偽成功にならないことと、不要な生成物が残らないことを確認する。結果・差分・不足する依存・未確認を短く返す。
