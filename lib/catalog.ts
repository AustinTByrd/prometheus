export const OWNER_REPO = "AustinTByrd/prometheus"

export const categories = ["System", "Components", "Data display"] as const

export type CatalogCategory = (typeof categories)[number]

export type CatalogItem = {
  slug: string
  title: string
  description: string
  category: CatalogCategory
  /** Registry item to install when the docs slug is a page, not a package. */
  registry?: string
}

export type DocsNavItem = {
  title: string
  url: string
  items?: { title: string; url: string; external?: boolean }[]
}

export type TocItem = {
  id: string
  title: string
  items?: TocItem[]
}

/** Registry items that have a dedicated docs page instead of `/component/[slug]`. */
export const dedicatedSlugs = new Set([
  "elevated",
  "smooth-corners",
  "motion",
  "fluid-hover",
  "list",
  "button",
  "toggle-button",
  "checkbox",
  "checkbox-group",
  "switch",
  "radio-group",
  "input",
  "textarea",
  "table",
  "app-shell",
  "skeleton",
  "empty",
  "error",
  "form",
  "tooltip",
  "lightbox",
  "menu",
  "slider",
  "tabs",
  "bar-chart",
  "line-chart",
  "badge",
  "avatar",
  "data-foundations",
  "sidebar",
])

export const catalog: CatalogItem[] = [
  {
    slug: "app-shell",
    title: "App Shell",
    description:
      "Sidebar, top bar, scrolling main, and a one-row footer. App screens start here. The root layout stays fonts and PrometheusProvider.",
    category: "System",
  },
  {
    slug: "fluid-hover",
    title: "Fluid Hover",
    description:
      "One highlight that glides from item to item under the pointer instead of blinking between them. List, Sidebar, Checkbox group, and Radio group already use it.",
    category: "System",
  },
  {
    slug: "motion",
    title: "Motion",
    description:
      "Shared durations, easing, and the height spring. Import these instead of inventing a second curve.",
    category: "System",
  },
  {
    slug: "prometheus-provider",
    title: "Prometheus Provider",
    description:
      "App provider for isMobile, theme, tooltips, and the surface ladder. Wrap the root instead of adding a breakpoint hook beside every overlay.",
    category: "System",
  },
  {
    slug: "smooth-corners",
    title: "Smooth Corners",
    description:
      "Lisse squircles aligned to Prometheus radius tokens (smoothing 1). Elevated and overlays already use them; reach for useCornerRef on custom panels and Base UI popups. Pill and circle stay CSS rounded-full.",
    category: "System",
  },
  {
    slug: "elevated",
    title: "Surfaces",
    description:
      "Eight nested surface levels. Overlays read their substrate and lift so dialogs and menus stay visible in light and dark mode. Panels use Lisse smooth corners by default.",
    category: "System",
  },
  {
    slug: "theme",
    title: "Theme",
    description:
      "Portable extension tokens derived from the host theme. Ships hover washes and Tailwind bridges so components work without this app’s globals.css.",
    category: "System",
  },
  {
    slug: "button",
    title: "Button",
    description:
      "Base UI button on Prometheus tokens: an elevated default plus five fallback variants, control-height sizes, inline icons, and the shared focus ring.",
    category: "Components",
  },
  {
    slug: "checkbox",
    title: "Checkbox",
    description:
      "A hairline square. Checked, it fills with foreground and a surface-colored Heroicons check. Pair with Field.",
    category: "Components",
  },
  {
    slug: "checkbox-group",
    title: "Checkbox group",
    description:
      "Checkbox rows with Fluid Hover and contiguous selections that merge into one background. Each row uses a filled check.",
    category: "Components",
  },
  {
    slug: "dialog",
    title: "Dialog",
    description:
      "Base UI dialog that lifts four surface steps off its substrate and uses Lisse smooth corners.",
    category: "Components",
  },
  {
    slug: "drawer",
    title: "Drawer",
    description:
      "Base UI drawer that lifts on the same surface ladder as Dialog, with smooth corners on the free edge.",
    category: "Components",
  },
  {
    slug: "empty",
    title: "Empty",
    description:
      "Empty state with an icon slot, a title, one sentence, and actions.",
    category: "Components",
  },
  {
    slug: "error",
    title: "Error",
    description:
      "Error state with an icon slot, a title, one sentence, and actions.",
    category: "Components",
  },
  {
    slug: "form",
    title: "Form",
    description:
      "react-hook-form and zod. Field errors, a root error, and a submit button that shows Spinner while pending.",
    category: "Components",
  },
  {
    slug: "input",
    title: "Input",
    description:
      "Base UI text input on Prometheus tokens: a bordered default or a filled muted wash, control-height sizes, start and end slots, a pending check, and invalid, read-only, and disabled states. Form wires it up as FormInput.",
    category: "Components",
  },
  {
    slug: "lightbox",
    title: "Lightbox",
    description:
      "ramka lightbox on Prometheus tokens: a morph from the thumbnail, swipe, pinch to zoom, pull to dismiss, and Button controls, plus a gallery that builds the whole viewer from an array of images.",
    category: "Components",
  },
  {
    slug: "list",
    title: "List",
    description:
      "Rows of links between hairline rules, with a title on the left and a detail on the right. One Fluid Hover fill glides from row to row.",
    category: "Components",
  },
  {
    slug: "menu",
    title: "Menu",
    description:
      "Base UI menu that lifts two surface steps off its substrate, with Lisse smooth corners, radio and checkbox items, and nested submenus.",
    category: "Components",
  },
  {
    slug: "radio-group",
    title: "Radio group",
    description:
      "Radio rows styled like Checkbox group: Fluid Hover, a muted selection fill, and a filled control with a surface-colored dot. One option at a time.",
    category: "Components",
  },
  {
    slug: "select",
    title: "Select",
    description:
      "Base UI select whose menu lifts two surface steps off its substrate, so it stays visible inside a dialog.",
    category: "Components",
  },
  {
    slug: "sheet",
    title: "Sheet",
    description:
      "Base UI sheet that lifts four surface steps off its substrate, inset 8px from the window edge with smooth corners all round.",
    category: "Components",
  },
  {
    slug: "sidebar",
    title: "Sidebar",
    description:
      "Collapsible sidebar that follows usePrometheus().isMobile and becomes a sheet on a narrow viewport. Drag the rail to resize: open to one fixed width, or learn the width you keep choosing and snap to it. Prefer App Shell for the app frame.",
    category: "Components",
  },
  {
    slug: "skeleton",
    title: "Skeleton",
    description:
      "Skullet skeletons in Prometheus tokens. Wrap the loaded view; the skeleton is measured from it, so nothing moves when the data lands.",
    category: "Components",
  },
  {
    slug: "slider",
    title: "Slider",
    description:
      "One slider, two ladder steps: the default step's pip/scrubber design, and the compact step's dense design with track fill, range mode, and value display.",
    category: "Components",
  },
  {
    slug: "switch",
    title: "Switch",
    description:
      "A labeled toggle. The thumb stretches on hover and press, springs across the track, and can be dragged past the midpoint to flip.",
    category: "Components",
  },
  {
    slug: "table",
    title: "Table",
    description:
      "TanStack Table and Virtual, with cells that split, stretch, and snap as the container widens. Merged values strain toward their column, then click into place.",
    category: "Components",
  },
  {
    slug: "tabs",
    title: "Tabs",
    description:
      "Horizontal pill tabs with a raised default-button selection indicator, gliding hover wash, optional active-label collapse, and manual keyboard activation.",
    category: "Components",
  },
  {
    slug: "textarea",
    title: "Textarea",
    description:
      "Multi-line text field on the Input tokens: grows with the text between rows and maxRows, a character or word count, an optional grab handle, and invalid, read-only, and disabled states. Form wires it up as FormTextarea.",
    category: "Components",
  },
  {
    slug: "toggle-button",
    title: "Toggle button",
    description:
      "Base UI toggle on the default Button: raised when off, flat on a muted fill when selected. Control-height sizes, inline icons, and a group for single or multiple selection.",
    category: "Components",
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    description:
      "Base UI tooltip that lifts two surface steps off its substrate, with Lisse smooth corners, collision-aware positioning, and composable parts for custom layouts.",
    category: "Components",
  },
  {
    slug: "avatar",
    title: "Avatar",
    description:
      "Image or initials avatar and a see-through AvatarStack. Every dimension derives from --avatar-size, and stacked neighbours are cut with a real CSS mask so any background shows through the gaps.",
    category: "Components",
  },
  {
    slug: "data-foundations",
    title: "Data Foundations",
    description:
      "Six pastels for charts, in an order that keeps neighbouring series apart under protanopia, deuteranopia, and tritanopia, with the pairs to keep apart.",
    category: "Data display",
    registry: "chart-palette",
  },
  {
    slug: "badge",
    title: "Badge",
    description:
      "Soft pill labels on the Data Foundations pastel palette, plus a neutral muted default. A translucent tint sits over the local surface so the wash stays stable on any parent.",
    category: "Data display",
  },
  {
    slug: "bar-chart",
    title: "Bar chart",
    description:
      "A standard bar chart on a hairline grid, one bar per category, with an optional insight under the title. Cards use Elevated (Lisse corners and surface shadow). Pastel fills with a deeper stroke, and a value tag on hover.",
    category: "Data display",
    registry: "data-display",
  },
  {
    slug: "line-chart",
    title: "Line chart",
    description:
      "A monochrome line chart on the same hairline grid and Elevated card as the bar chart, with an optional insight under the title. Solid markers, a soft area wash, and a value tag on hover.",
    category: "Data display",
    registry: "data-display",
  },
]

function navItemsFor(category: CatalogCategory) {
  return catalog
    .filter((item) => item.category === category)
    .map((item) => ({
      title: item.title,
      url: `/component/${item.slug}`,
    }))
}

export function getDocsNav(): DocsNavItem[] {
  const firstUrl = (category: CatalogCategory) =>
    navItemsFor(category)[0]?.url ?? "/"

  return [
    {
      title: "Overview",
      url: "/",
      items: [
        { title: "Quick start", url: "/" },
        { title: "Showcase", url: "/showcase" },
        { title: "Design guidelines", url: "/guidelines" },
        { title: "Foundations", url: "/foundations" },
        { title: "Typography", url: "/typography" },
        { title: "State machines", url: "/state-machines" },
      ],
    },
    {
      title: "System",
      url: firstUrl("System"),
      items: navItemsFor("System"),
    },
    {
      title: "Components",
      url: firstUrl("Components"),
      items: navItemsFor("Components"),
    },
    {
      title: "Data display",
      url: firstUrl("Data display"),
      items: navItemsFor("Data display"),
    },
  ]
}

export function getCatalogItem(slug: string) {
  return catalog.find((item) => item.slug === slug)
}

export function registrySlug(slug: string) {
  return getCatalogItem(slug)?.registry ?? slug
}

export function installCommand(slug: string) {
  return `npx shadcn@latest add ${OWNER_REPO}/${registrySlug(slug)}`
}

export function initCommand() {
  return `npx shadcn@latest create -n my-app -t next https://prometheus-ui-rust.vercel.app/r/starter.json`
}
