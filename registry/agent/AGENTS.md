# Prometheus

This project uses Prometheus, a personal shadcn registry built on Base UI.

## Before writing UI

Search the registry before composing primitives or inventing a mobile variant.

```bash
npx shadcn@latest search AustinTByrd/prometheus
npx shadcn@latest add AustinTByrd/prometheus/<item> --dry-run
```

After init, namespaced adds also work:

```bash
npx shadcn@latest add @prometheus/<item>
```

## Rules

- Prefer a Prometheus wrapper over assembling shadcn primitives.
- Simple Dialog is desktop-only. Responsive Dialog is the same API plus a mobile drawer. Do not pull drawer dependencies into Simple components.
- Wrap the app in `PrometheusProvider`. Use `usePrometheus()` for `isMobile`.
- Forms use `FormField*` wrappers (label, description, error together). Do not rebuild Field + Label by hand for standard inputs.
- Buttons that need a spinner, icon, or link: use `@/components/button`, not a one-off composition.
- Base UI uses `render`, not Radix `asChild`.
- Use semantic tokens (`bg-background`, `text-muted-foreground`). Use `size-*` when width and height match. Use `gap-*`, not `space-y-*`.
- Do not present official shadcn icons, loaders, or primitives as Prometheus features.

## Install defaults

```bash
npx shadcn@latest init --name my-app --template next --base base AustinTByrd/prometheus/base
```
