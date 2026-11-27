---
name: prometheus
description: Use Prometheus system foundations and conventions in this project. Trigger when building UI, adding shadcn components, working with surfaces/elevation, or deciding between official shadcn and Prometheus items.
---

# Prometheus

Personal shadcn registry on Base UI. System foundations first — provider, surfaces, tokens — then wrappers once those defaults are settled. Read the kit guidelines and foundations before wrapping a primitive.

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
| App providers, isMobile, surfaces | `PrometheusProvider` + `usePrometheus()` |
| App frame (sidebar, top bar, main, footer) | `AppShell` from `@/components/ui/app-shell` |
| Page loading | `Skeleton` from `@/components/ui/skeleton` (Skullet) |
| Empty view | `Empty` from `@/components/ui/empty` |
| Failed view | `ErrorState` from `@/components/ui/error` |
| Form submit, field errors, root error | `usePrometheusForm`, `Form`, `FormInput`, `FormTextarea`, `FormField`, `FormSubmit` |
| Nested panels / elevation | `Elevated` (`offset={2}` menus, `offset={4}` dialogs) |
| Smooth / continuous corners | Built into Elevated and overlays. Custom: `useCornerRef` / `CORNERS` / `OVERLAY_CORNERS` from `@/lib/smooth-corners` (Lisse). Interactive controls use CSS `rounded-*`. Pill and circle stay CSS `rounded-full`. |
| Durations, easing, height spring | `@/lib/motion` (`duration`, `ease`, `springHeight`) |
| Hover that glides between items | `useFluidHover`, `FluidHoverHighlight` from `@/lib/fluid-hover` |
| Rows of links (roles, posts) | `List`, `ListItem` from `@/components/ui/list` |
| Type ramp, prose | `text-xs` through `text-5xl`. `font-display` from `text-xl`. Long-form uses `prose`. Drop caps use `drop-cap` |
| Viewport widths | `breakpoints` from `@/lib/breakpoints`. The mobile split is `breakpoints.md` |
| Charts | `@/components/ui/data-display` (`BarChart`, `LineChart`, `ChartKey`, `ChartGrid`) |
| Soft pastel labels | `Badge` from `@/components/ui/badge` (Data Foundations colors) |
| User avatars and overlapping stacks | `Avatar`, `AvatarStack` from `@/components/ui/avatar` (`--avatar-size` scales everything) |
| Chart / badge colors | `chartPalette` from `@/lib/chart-palette` |
| Centered modal | `@/components/ui/dialog` |
| Menu that lifts inside a dialog | `@/components/ui/select` |
| Swipeable panel | `@/components/ui/drawer` |
| Side panel | `@/components/ui/sheet` |

## Do not

- Hand-roll a nav, sidebar, or footer. App screens go inside `AppShell`. Skip it only for a single-task or marketing screen.
- Add a second mobile breakpoint hook. Use `usePrometheus().isMobile`, which follows `breakpoints.md`.
- Invent a font size or letter-spacing. Pick a step on the type ramp. Long-form copy uses `prose`.
- Invent a viewport width. Use `breakpoints` from `@/lib/breakpoints`.
- Use `Spinner` as a page-level loading state. Page loading is `Skeleton`: wrap the loaded view and pass `loading`, or `data` with a `sample`. The skeleton is measured from the view, so nothing moves on reveal. A submitting button uses `Spinner` and `disabled`.
- Invent a custom empty or error layout. Use `Empty` and `ErrorState`: icon slot, title, one sentence, actions.
- Track form fields in local state. Use `usePrometheusForm` with a zod schema, `FormInput` for single-line fields, `FormTextarea` for multi-line fields, `FormField` for other controls, `FormRootError` for a failed submit, and `FormSubmit` for the pending button. Keep entered values when submit fails.
- Reach past the default `Button`. Most actions are the elevated default. `variant="primary"` is for the one action a view is about; `variant="outlined"` and ghost are fallbacks lower in the hierarchy. Buttons route within the app; `variant="link"` is for external destinations.
- Import Lucide or draw inline SVG icons. Use Heroicons: `@heroicons/react/16/solid` inside controls, `@heroicons/react/24/outline` for the Empty and Error icon slot.
- Mix Radix `asChild` with Base UI. Use `render`.
- Override semantic colors with raw palette classes. `text-primary` is ember emphasis, not body copy.
- Hardcode `bg-popover` on a dialog, select, or drawer. Overlays already lift from surface context.
- Reinvent squircles with CSS `border-radius`. Prefer Prometheus smooth corners (Lisse).

## Provider

```tsx
import { PrometheusProvider } from "@/components/prometheus-provider"

<html lang="en" className="dark">
  <body>
    <PrometheusProvider>{children}</PrometheusProvider>
  </body>
</html>
```

PrometheusProvider starts the surface ladder at level 1. Dialogs lift 4 steps, select menus lift 2, with a fixed shadow so a menu still reads as a menu inside a dialog. Wrap custom panels with `Elevated`. Panels and overlays use Lisse smooth corners by default (`CORNERS.xl` / squircle / smoothing 1).

## Version

Registry source files start with `// @prometheus x.y.z`. `PROMETHEUS.md` records the version this project copied.

Before editing a Prometheus file, compare that stamp with the registry changelog:

```bash
npx shadcn@latest view AustinTByrd/prometheus/changelog
```

If the registry version is newer, re-add the stale items:

```bash
npx shadcn@latest add AustinTByrd/prometheus/<item>
```
