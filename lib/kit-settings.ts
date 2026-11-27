export const REGISTRY_HOST = "https://prometheus-ui-rust.vercel.app"

export const kitThemes = ["system", "light", "dark"] as const
export const kitAccents = ["umber", "blue", "green", "violet"] as const
export const kitHeadingFonts = ["geist-serif", "geist", "inter"] as const
export const kitRadii = ["sharp", "soft", "rounded"] as const
export const kitSizes = ["default", "compact"] as const
export const kitIcons = ["heroicons", "lucide"] as const
export const kitHovers = ["fluid", "instant"] as const
export const kitPrimitives = ["base-ui"] as const

export type KitTheme = (typeof kitThemes)[number]
export type KitAccent = (typeof kitAccents)[number]
export type KitHeadingFont = (typeof kitHeadingFonts)[number]
export type KitRadius = (typeof kitRadii)[number]
export type KitSize = (typeof kitSizes)[number]
export type KitIcons = (typeof kitIcons)[number]
export type KitHover = (typeof kitHovers)[number]
export type KitPrimitive = (typeof kitPrimitives)[number]

export type KitSettings = {
  theme: KitTheme
  accent: KitAccent
  headingFont: KitHeadingFont
  radius: KitRadius
  size: KitSize
  icons: KitIcons
  hover: KitHover
  primitive: KitPrimitive
}

export const KIT_DEFAULTS: KitSettings = {
  theme: "system",
  accent: "umber",
  headingFont: "geist-serif",
  radius: "soft",
  size: "default",
  icons: "heroicons",
  hover: "fluid",
  primitive: "base-ui",
}

export const KIT_STORAGE_KEY = "prometheus-kit-settings"

export const kitOptionMeta = {
  theme: {
    label: "Theme",
    labels: { system: "System", light: "Light", dark: "Dark" },
  },
  accent: {
    label: "Accent",
    labels: {
      umber: "Umber",
      blue: "Blue",
      green: "Green",
      violet: "Violet",
    },
  },
  headingFont: {
    label: "Heading font",
    labels: {
      "geist-serif": "Geist Serif",
      geist: "Geist",
      inter: "Inter",
    },
  },
  radius: {
    label: "Radius",
    labels: { sharp: "Sharp", soft: "Soft", rounded: "Rounded" },
  },
  size: {
    label: "Size",
    labels: { default: "Default", compact: "Compact" },
  },
  icons: {
    label: "Icons",
    labels: { heroicons: "Heroicons", lucide: "Lucide" },
  },
  hover: {
    label: "Hover",
    labels: { fluid: "Fluid", instant: "Instant" },
  },
  primitive: {
    label: "Primitive",
    labels: { "base-ui": "Base UI" },
  },
} as const

export const kitAccentValues: Record<
  KitAccent,
  { light: string; dark: string; label: string }
> = {
  umber: { light: "#73574A", dark: "#FEF1DF", label: "umber" },
  blue: { light: "#3B6FE0", dark: "#6B97FF", label: "blue" },
  green: { light: "#3F6B3A", dark: "#8FA876", label: "green" },
  violet: { light: "#5B5DDF", dark: "#8B8DE8", label: "violet" },
}

export const kitRadiusValues: Record<KitRadius, string> = {
  sharp: "0.25rem",
  soft: "0.75rem",
  rounded: "1.25rem",
}

/** Map kit radius to ShapeProvider variants. */
export const kitRadiusToShape = {
  sharp: "sharp",
  soft: "rounded",
  rounded: "pill",
} as const

export function cycleKitOption<T extends string>(
  values: readonly T[],
  current: T
): T {
  const index = values.indexOf(current)
  return values[(index + 1) % values.length]!
}

export function starterUrl() {
  return `${REGISTRY_HOST}/r/starter.json`
}

export function setupUrl() {
  return `${REGISTRY_HOST}/r/setup.json`
}

export function settingsSummary(settings: KitSettings) {
  return [
    kitOptionMeta.primitive.labels[settings.primitive],
    kitOptionMeta.radius.labels[settings.radius].toLowerCase(),
    `${kitOptionMeta.size.labels[settings.size].toLowerCase()} size`,
    kitOptionMeta.icons.labels[settings.icons],
    `${kitOptionMeta.theme.labels[settings.theme].toLowerCase()} theme`,
    `${kitOptionMeta.accent.labels[settings.accent].toLowerCase()} accent`,
    kitOptionMeta.headingFont.labels[settings.headingFont],
    `${kitOptionMeta.hover.labels[settings.hover].toLowerCase()} hover`,
  ].join(", ")
}

/** Agent-facing install prompt. Updates with Make them yours settings. */
export function buildInstallPrompt(settings: KitSettings) {
  const summary = settingsSummary(settings)
  const accent = kitAccentValues[settings.accent]
  const radius = kitRadiusValues[settings.radius]
  const heading =
    settings.headingFont === "geist-serif"
      ? "Geist Serif (`font-display`)"
      : settings.headingFont === "geist"
        ? "Geist Sans"
        : "Inter"
  const icons =
    settings.icons === "heroicons"
      ? "@heroicons/react (16/solid in controls, 24/outline for Empty/Error)"
      : "lucide-react (swap Heroicons imports after install)"
  const hover =
    settings.hover === "fluid"
      ? "Fluid Hover (gliding highlight)"
      : "instant hover (no glide)"
  const themeDefault =
    settings.theme === "system"
      ? "system"
      : settings.theme === "light"
        ? "light"
        : "dark"

  return `Start a new React app with Prometheus: every component installed, every system wired, set to ${summary}.

Run (shadcn CLI, Next.js template, asks nothing):
npx shadcn@latest create -n my-app -t next ${starterUrl()}
It creates the app in ./my-app; use the project's name instead. Then run npm run dev in it.

What it sets up:
- Every component in components/ui (Base UI), with shared libs in lib (theme, motion, elevated, fluid-hover, typography, breakpoints, smooth-corners).
- app/layout.tsx loads Geist (+ Geist Serif); headings use ${heading}. Set --radius to ${radius}.
- components/providers.tsx (or PrometheusProvider in the root layout) holds the settings: next-themes (default ${themeDefault}), size="${settings.size}", shape="${kitRadiusToShape[settings.radius]}", and SurfaceProvider. Change a value there and every component follows.
- Accent is ${accent.label} (${accent.light} light / ${accent.dark} dark): set --primary, --ring, and related emphasis tokens so focus rings and accented details read it.
- Control size step: ${settings.size}. Icons: ${icons}. Hover: ${hover}.
- app/page.tsx: an AppShell (sidebar and top bar) around a home screen to replace.
- components.json registers @prometheus, so a later add is short: npx shadcn@latest add @prometheus/<name>

Already in an app with components.json? Install the same components and settings into it instead:
npx shadcn@latest add ${setupUrl()} --overwrite
--overwrite replaces same-named stock shadcn files (button.tsx, dialog.tsx, ...) with this library's versions. Without it the CLI prompts per existing file and exits in a non-interactive shell before any component is written.
Then wrap the root layout's children in PrometheusProvider from @/components/prometheus-provider (inside any existing theme provider, or let it own next-themes) with size="${settings.size}" shape="${kitRadiusToShape[settings.radius]}", apply radius ${radius} and the ${accent.label} accent tokens, and default the theme to ${themeDefault}.

For agent craft and conventions, install the Prometheus skill with the kit (agent pack) or follow AGENTS.md from the registry.
Docs: ${REGISTRY_HOST}
Changelog: npx shadcn@latest view AustinTByrd/prometheus/changelog`
}

export function parseKitSettings(value: unknown): KitSettings | null {
  if (!value || typeof value !== "object") return null
  const raw = value as Partial<KitSettings>
  const next: KitSettings = { ...KIT_DEFAULTS }
  if (kitThemes.includes(raw.theme as KitTheme)) next.theme = raw.theme as KitTheme
  if (kitAccents.includes(raw.accent as KitAccent))
    next.accent = raw.accent as KitAccent
  if (kitHeadingFonts.includes(raw.headingFont as KitHeadingFont))
    next.headingFont = raw.headingFont as KitHeadingFont
  if (kitRadii.includes(raw.radius as KitRadius))
    next.radius = raw.radius as KitRadius
  if (kitSizes.includes(raw.size as KitSize)) next.size = raw.size as KitSize
  if (kitIcons.includes(raw.icons as KitIcons)) next.icons = raw.icons as KitIcons
  if (kitHovers.includes(raw.hover as KitHover)) next.hover = raw.hover as KitHover
  if (kitPrimitives.includes(raw.primitive as KitPrimitive))
    next.primitive = raw.primitive as KitPrimitive
  return next
}
