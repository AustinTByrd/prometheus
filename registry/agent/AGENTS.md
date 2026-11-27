# Prometheus

This project uses Prometheus, a personal shadcn registry built on Base UI.

## Before writing UI

Prefer the full-kit install prompt from the docs (Make them yours → Copy install prompt) over inventing a stack by hand. That prompt creates or updates an app with every component and system lib wired.

```bash
npx shadcn@latest create -n my-app -t next https://prometheus-ui-rust.vercel.app/r/starter.json
npx shadcn@latest add https://prometheus-ui-rust.vercel.app/r/setup.json --overwrite
```

Search before composing primitives. A la carte adds still work after the kit is in place:

```bash
npx shadcn@latest search AustinTByrd/prometheus
npx shadcn@latest add @prometheus/<item>
```

## Rules

- Prefer a Prometheus item over inventing the same default by hand.
- Wrap the app in `PrometheusProvider`. Use `usePrometheus()` for `isMobile`. Overlays use the surface ladder from that provider; wrap custom panels with `Elevated`.
- App screens go inside `AppShell` (`@/components/ui/app-shell`). Leave the root layout to fonts and `PrometheusProvider`. Skip the shell only for a single-task or marketing screen.
- Page loading uses `Skeleton`. Wrap the loaded view and set `loading`, or pass `data` with a `sample`. Empty views use `Empty`. Failed views use `ErrorState`. A submitting button uses `Spinner` and `disabled`.
- Buttons start at the default variant: a white surface with a short shadow. Use `variant="primary"` for the one action a view is about, and the other variants only as fallbacks lower in the hierarchy. Buttons route within the app; `variant="link"` links out to external pages.
- Forms use `usePrometheusForm` and `Form`. Use `FormInput` for single-line fields, `FormTextarea` for multi-line fields, and `FormField` for other controls, show `FormRootError` when submit fails, and keep the entered values.
- Before editing a Prometheus file, compare its `// @prometheus x.y.z` stamp with `npx shadcn@latest view AustinTByrd/prometheus/changelog`. Re-add items that are behind. See `PROMETHEUS.md`.
- Panels and overlays use Lisse smooth corners (`@/lib/smooth-corners`). Prefer `useCornerRef` / `Elevated` on popups and custom panels. Interactive controls use CSS `rounded-*`. Pill and circle stay CSS `rounded-full`.
- Durations, easing, and the height spring live in `@/lib/motion`. Do not invent a second curve.
- Type is the ramp from `text-xs` through `text-5xl`. Titles from `text-xl` use `font-display`. Body text uses two weights: regular (400) and `font-medium` (500). Each step sets its own line height and tracking, so avoid `leading-*` and `tracking-*` overrides unless a component needs them. Long-form copy uses `prose`. Opening letters use `drop-cap` (2 lines), `drop-cap-3`, or `drop-cap-4` on a paragraph or a `prose` root.
- Viewport widths live in `@/lib/breakpoints`. The mobile split is `breakpoints.md`. `usePrometheus().isMobile` follows it.
- Base UI uses `render`, not Radix `asChild`.
- Use semantic tokens (`bg-background`, `text-muted-foreground`, `bg-hover`). `text-primary` is ember emphasis, not body copy. Use `size-*` when width and height match. Use `gap-*`, not `space-y-*`.
- Components must stay portable: tokens ship via registry `cssVars` (see `theme`, `motion`, `elevated`), not via a copied `globals.css`. New UI depends on `AustinTByrd/prometheus/theme`.
- Icons come from Heroicons. Use `@heroicons/react/16/solid` inside controls and `@heroicons/react/24/outline` for the larger Empty and Error icons. shadcn components added from upstream still import Lucide; swap their icons for Heroicons.
- Do not present official shadcn icons, loaders, or primitives as Prometheus features.

## Install defaults

```bash
npx shadcn@latest init --name my-app --template next --base base AustinTByrd/prometheus/base
```
