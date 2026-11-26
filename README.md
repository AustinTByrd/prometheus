# Prometheus

Personal shadcn registry for agentic coding. Built on Base UI (`base-nova`). Install the source into every new app.

```bash
npx shadcn@latest init --name my-app --template next --base base AustinTByrd/prometheus/base
npx shadcn@latest add AustinTByrd/prometheus/responsive-dialog
```

- GitHub source registry: `AustinTByrd/prometheus/<item>`
- Hosted namespace (configured by `base`): `@prometheus/<item>` via https://prometheus-ui-rust.vercel.app
- Docs and `llms.txt`: https://prometheus-ui-rust.vercel.app/llms.txt

## Registry items (25)

| Group | Items |
| --- | --- |
| **Setup & Agent** | `base`, `agent`, `prometheus-provider` |
| **Actions** | `button`, `copy-button`, `theme-toggle`, `kbd` |
| **Display** | `avatar` |
| **Overlays** | `simple-tooltip`, `conditional-tooltip`, `simple-dialog`, `responsive-dialog`, `confirm-dialog`, `simple-popover`, `responsive-popover` |
| **Forms** | `form-field-wrapper`, `form-field-input`, `form-field-textarea`, `form-field-select`, `form-field-checkbox`, `form-field-switch`, `form-field-radio-group` |
| **Layout** | `conditional-wrap`, `page-header`, `spinner` |

## Local development

```bash
pnpm install
pnpm registry:validate
pnpm registry:build
pnpm dev
```

Or with npm scripts:

```bash
npm run registry:validate
npm run build
npm run lint
```

## What this is

Not an npm component library. A source registry: your defaults, your wrappers, your agent instructions. Search before writing UI.

```bash
npx shadcn@latest search AustinTByrd/prometheus
npx shadcn@latest view AustinTByrd/prometheus/responsive-dialog
npx shadcn@latest add AustinTByrd/prometheus/responsive-dialog --dry-run
```
