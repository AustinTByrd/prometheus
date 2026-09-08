export const OWNER_REPO = "AustinTByrd/prometheus"

export type CatalogItem = {
  slug: string
  title: string
  description: string
  category: "Setup" | "Actions" | "Overlays" | "Forms" | "Layout"
}

export const catalog: CatalogItem[] = [
  {
    slug: "prometheus-provider",
    title: "Prometheus Provider",
    description:
      "App provider for isMobile, theme, and tooltips. Wrap the root instead of adding a breakpoint hook beside every overlay.",
    category: "Setup",
  },
  {
    slug: "button",
    title: "Button",
    description:
      "Loading, icons, and href on one button. Use this instead of wrapping the primitive with a spinner on every action.",
    category: "Actions",
  },
  {
    slug: "simple-tooltip",
    title: "Simple Tooltip",
    description:
      "One child, one content prop. Use this instead of assembling Tooltip, Trigger, and Content.",
    category: "Overlays",
  },
  {
    slug: "conditional-tooltip",
    title: "Conditional Tooltip",
    description:
      "Tooltip only when a condition and content exist. Avoid duplicating the trigger in two branches.",
    category: "Overlays",
  },
  {
    slug: "conditional-wrap",
    title: "Conditional Wrap",
    description:
      "Optionally wrap children so links or providers do not duplicate the child tree.",
    category: "Layout",
  },
  {
    slug: "simple-dialog",
    title: "Simple Dialog",
    description:
      "Centered desktop dialog with title, description, trigger, and footer. Does not install mobile drawer behavior.",
    category: "Overlays",
  },
  {
    slug: "responsive-dialog",
    title: "Responsive Dialog",
    description:
      "Same API as Simple Dialog, as a swipeable drawer on mobile. Requires PrometheusProvider.",
    category: "Overlays",
  },
  {
    slug: "form-field-wrapper",
    title: "Form Field Wrapper",
    description:
      "Shared label, description, and error shell for custom controls.",
    category: "Forms",
  },
  {
    slug: "form-field-input",
    title: "Form Field Input",
    description:
      "Labeled text input with validation wiring. Works with register() or value/onChange.",
    category: "Forms",
  },
  {
    slug: "form-field-textarea",
    title: "Form Field Textarea",
    description: "Labeled multiline field using the shared field shell.",
    category: "Forms",
  },
  {
    slug: "form-field-select",
    title: "Form Field Select",
    description: "Labeled select from an options array. No Select anatomy to reassemble.",
    category: "Forms",
  },
  {
    slug: "form-field-checkbox",
    title: "Form Field Checkbox",
    description: "Checkbox paired with its label and error message.",
    category: "Forms",
  },
  {
    slug: "page-header",
    title: "Page Header",
    description: "Title, description, and action slot. Optional sticky positioning.",
    category: "Layout",
  },
  {
    slug: "spinner",
    title: "Spinner",
    description:
      "Spinner plus full-page and fill-height layouts. Do not recenter a loader at each boundary.",
    category: "Layout",
  },
  {
    slug: "kbd",
    title: "Keyboard Shortcut",
    description:
      "Keycap display for shortcut hints. Bind the actual keys in your app.",
    category: "Actions",
  },
]

export function getCatalogItem(slug: string) {
  return catalog.find((item) => item.slug === slug)
}

export function installCommand(slug: string) {
  return `npx shadcn@latest add ${OWNER_REPO}/${slug}`
}

export function initCommand() {
  return `npx shadcn@latest init --name my-app --template next --base base ${OWNER_REPO}/base`
}
