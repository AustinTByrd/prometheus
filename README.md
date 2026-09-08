# Prometheus

Personal shadcn registry for agentic coding. Built on Base UI. Install the source into every new app.

```bash
npx shadcn@latest init --name my-app --template next --base base AustinTByrd/prometheus/base
npx shadcn@latest add AustinTByrd/prometheus/responsive-dialog
```

- GitHub registry: `AustinTByrd/prometheus/<item>`
- Hosted namespace (after deploy): `@prometheus/<item>`
- Docs and `llms.txt` ship with this Next.js app

## Local

```bash
pnpm install
pnpm registry:validate
pnpm registry:build
pnpm dev
```

## What this is

Not an npm component library. A source registry: your defaults, your wrappers, your agent instructions. Search before writing UI.

```bash
npx shadcn@latest search AustinTByrd/prometheus
```
