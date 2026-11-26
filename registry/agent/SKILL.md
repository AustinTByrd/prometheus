---
name: prometheus
description: Use Prometheus components and conventions in this project. Trigger when building UI, adding shadcn components, writing forms, dialogs, popovers, tooltips, or deciding between official shadcn and Prometheus wrappers.
---

# Prometheus

Reusable source components on shadcn + Base UI. Install with the shadcn CLI. Prefer an existing Prometheus wrapper before composing primitives.

## Search first

```bash
npx shadcn@latest search AustinTByrd/prometheus
npx shadcn@latest view AustinTByrd/prometheus/<item>
npx shadcn@latest add AustinTByrd/prometheus/<item> --dry-run
```

After `AustinTByrd/prometheus/base` is installed, `@prometheus/<item>` resolves to the hosted registry.

Bare names like `button` mean official shadcn. Prometheus items use `AustinTByrd/prometheus/<item>` or `@prometheus/<item>`.

## Reach for this

| Need | Use |
| --- | --- |
| App providers, isMobile | `PrometheusProvider` + `usePrometheus()` |
| Action with loading, icon, or href | `@/components/button` |
| Copy to clipboard with feedback | `CopyButton` |
| Light/dark theme button | `ThemeToggle` |
| Standard tooltip (including disabled triggers) | `SimpleTooltip` |
| Tooltip only sometimes | `ConditionalTooltip` |
| Optional wrapper without duplicating children | `ConditionalWrap` |
| Desktop modal | `SimpleDialog` + `SimpleDialogClose` |
| Modal that becomes a drawer on mobile | `ResponsiveDialog` + `ResponsiveDialogClose` |
| Confirmation / destructive modal with async state | `ConfirmDialog` |
| Desktop popover | `SimplePopover` |
| Popover that becomes a drawer on mobile | `ResponsivePopover` |
| Labeled input / textarea / select / checkbox / switch / radio | `FormFieldInput`, `FormFieldTextarea`, `FormFieldSelect`, `FormFieldCheckbox`, `FormFieldSwitch`, `FormFieldRadioGroup` |
| Custom control with shared label/error shell | `FormFieldWrapper` |
| Page title + actions | `PageHeader` |
| Loading | `Spinner`, `FullPageSpinner`, `FillHeightSpinner` |
| Shortcut hint (display only) | `Kbd` / `KbdShortcut` |

## Do not

- Compose Tooltip/Trigger/Content for a standard hint.
- Rebuild dialog, popover, or confirmation alert anatomy when a Prometheus wrapper already covers it.
- Import drawer into a Simple component.
- Mix Radix `asChild` with these Base UI wrappers. Use `render`.
- Write raw `div` + `space-y-*` form layout. Use `FormField*` / `FormFieldWrapper`.
- Override semantic colors with raw palette classes.

## Provider

```tsx
import { PrometheusProvider } from "@/components/prometheus-provider"

<html lang="en" className="dark" suppressHydrationWarning>
  <body>
    <PrometheusProvider>{children}</PrometheusProvider>
  </body>
</html>
```
