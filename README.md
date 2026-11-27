# Prometheus

Personal shadcn registry for agentic coding. Built on Base UI. Install the source into every new app.

```bash
npx shadcn@latest create -n my-app -t next https://prometheus-ui-rust.vercel.app/r/starter.json
# existing app:
npx shadcn@latest add https://prometheus-ui-rust.vercel.app/r/setup.json --overwrite
```

Or copy the install prompt from any docs page (Make them yours).

- GitHub registry: `AustinTByrd/prometheus/<item>`
- Hosted namespace: `@prometheus/<item>` via https://prometheus-ui-rust.vercel.app
- Docs and `llms.txt`: https://prometheus-ui-rust.vercel.app
- Smooth corners: [Lisse](https://github.com/JaceThings/Lisse) squircles on Elevated and overlays (`@prometheus/smooth-corners`)

## Local

```bash
pnpm install
pnpm registry:validate
pnpm registry:build
pnpm dev
```

## Portability

Items install with their tokens via `cssVars` (see `theme`, `motion`, `elevated`). Consumers keep their own palette; Prometheus extensions like `bg-hover` derive from the host `--foreground`. Do not rely on this repo’s `app/globals.css` for installed components.

## What this is

Not an npm component library. A source registry: your defaults, your foundations, your agent instructions. Search before writing UI.

```bash
npx shadcn@latest search AustinTByrd/prometheus
```
