# Cross-cutting tools

Project shapeを決めた後に必要なtoolだけを選ぶ。既存toolを検出してから、required / optional / migrationへ分ける。installや削除はユーザーの明示承認後だけ行う。

## GitHub

GitHub URL、Issue、PR、release操作には`gh`を優先する。GitHub MCPが既にあり、`gh`へ移行する依頼なら、認証と同等操作を確認してからMCPを削除する。

## Format / lint / test

道具の標準と依存の導入は [stack](../SKILL.md) に従う。ここでは用途に必要な追加道具だけを選ぶ。既存製品の方式を変更するときは移行の範囲を先に決める。

## Browser and E2E

- browser操作が必要なら、対象環境で利用可能なbrowser Skill / CLIを1つ選ぶ
- Playwrightが既に選定されているweb productでは、公式のtest agent生成機能を候補にする
- local dev serverを複数扱う場合はportlessを候補にする。service installや証明書設定は明示承認後に行う

同じ目的のChrome MCP、browser CLI、複数Playwright wrapperを重ねない。対象リポジトリの指定があればそれを正本にする。

## Sentry

Sentry packageやconfigがあり、issue調査、release、source map、alertが必要な場合だけ、stackに合うSentry CLI / Skillを選ぶ。全language / framework Skillをまとめて追加しない。

代表的な対応:

- React / browser / Vite SPA → Reactまたはbrowser SDK guidance
- Cloudflare Workers → Cloudflare SDK guidance
- TanStack Start / Next.js / React Router →該当framework guidance
- Node / Python / Ruby / Go / PHPなど →検出したruntimeだけ

## Agent Skills

追加前にpackageの公開Skill一覧と対象agentを確認し、必要なSkill名だけを明示する。対象リポジトリに既存のSkill installer commandがあればそれに従う。追加後は一覧を再取得し、意図しないSkillが増えていないことを確認する。

## Inspection result

次を短く報告する。

- detected stack and current tools
- required missing tools
- optional improvements
- replacements / removals
- files and dependencies changed if applied
- verification performed and unverified areas
