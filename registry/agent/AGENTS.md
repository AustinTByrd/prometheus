# Prometheus

This project uses Prometheus, a personal shadcn registry built on Base UI.

## Before writing UI

Search the registry before composing primitives or inventing a mobile variant.

```bash
npx shadcn@latest search AustinTByrd/prometheus
npx shadcn@latest view AustinTByrd/prometheus/<item>
npx shadcn@latest add AustinTByrd/prometheus/<item> --dry-run
```

After init, namespaced adds also work:

```bash
npx shadcn@latest add @prometheus/<item>
```

## Rules

- Prefer a Prometheus wrapper over assembling shadcn primitives.
- Simple vs Responsive is an installation boundary: `SimpleDialog` and `SimplePopover` are desktop-only; `ResponsiveDialog` and `ResponsivePopover` add a mobile drawer via `PrometheusProvider`. Do not pull drawer dependencies into Simple components.
- For destructive or async confirmations, use `ConfirmDialog` instead of wiring `AlertDialog` and loading state by hand.
- Wrap the app in `PrometheusProvider`. Use `usePrometheus()` for `isMobile`. Pair with `ThemeToggle` for light/dark switching.
- Forms use `FormField*` wrappers (`FormFieldInput`, `FormFieldTextarea`, `FormFieldSelect`, `FormFieldCheckbox`, `FormFieldSwitch`, `FormFieldRadioGroup`, or `FormFieldWrapper` for custom controls). Do not rebuild `Field` + `Label` by hand.
- Buttons that need a spinner, icon, or link: use `@/components/button`. For clipboard copy actions, use `CopyButton`.
- Base UI uses `render`, not Radix `asChild`. For Base UI `Select`, always pass `items` (already handled by `FormFieldSelect`).
- Use semantic tokens (`bg-background`, `text-muted-foreground`). Use `size-*` when width and height match. Use `gap-*`, not `space-y-*`.
- Do not present official shadcn icons, loaders, or primitives as Prometheus features.

## Install defaults

```bash
npx shadcn@latest init --name my-app --template next --base base AustinTByrd/prometheus/base
```
