# TanStack App

TanStack Start (React) + TanStack Query + Hono + Drizzle.

## Patterns

- hc client で型安全 API 呼び出し
- 更新は refetch（`invalidateQueries` 使わない）
- Suspense + `use()` でデータ取得
- Skeleton で loading
- query は子に渡す

## References

- [Hono API](tanstack/hono-api.md)
- [hc client](tanstack/hc-client.md)
- [Auth](tanstack/auth.md): JWT + Cookie、authMiddleware
- [Session](tanstack/session-context.md): React Context + Query、useSession
- [Suspense + use()](tanstack/suspense-use.md)
- [Cloudflare](tanstack/cloudflare.md): Workers + D1、HonoEnv、databaseMiddleware
- [TanStack Start BASIC auth](tanstack/tanstack-start/basic-auth.md)
- [Storybook + MSW](tanstack/storybook-msw.md): コンポーネント開発の標準。ハンドラを story とテストで共有
- [Storybook 量産の執筆規律](tanstack/storybook-authoring.md): フィクスチャの業務精度、型の詰まりの分岐、smoke ゲートとの整合

## Agent tools

横断ツールは [stack スキル](../SKILL.md) を参照。

### shadcn/ui

`components.json` 利用時。`vpx skills add shadcn/ui --agent <client-id> --skill shadcn -y`。

### react-best-practices

`vpx skills add vercel-labs/agent-skills --agent <client-id> --skill react-best-practices -y`。

### next-best-practices

Next.js 利用時。`vpx skills add vercel-labs/next-skills --agent <client-id> --skill next-best-practices -y`。Optional: `--skill next-upgrade`、`--skill next-cache-components`。

### stitch-skills

DESIGN.md ＋ shadcn 統合。`stitch-design` / `design-md` / `enhance-prompt` を `--global` で。shadcn 利用時は `shadcn-ui` も。

### taste-design

stitch-skills と併用、premium UI 基準。`.agents/skills/taste-design` を symlink。
