import type { Metadata } from "next"

import {
  TabsActiveLabelDemo,
  TabsDefaultDemo,
  TabsIconsDemo,
  TabsSizeDemo,
} from "@/app/demos/tabs-docs"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Tabs — Prometheus",
  description:
    "Horizontal pill tabs with a raised default-button selection indicator, gliding hover wash, optional active-label collapse, and manual keyboard activation.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "default", title: "Default" },
  { id: "icons", title: "With icons" },
  { id: "active-label", title: "Active label" },
  { id: "size", title: "Size" },
  { id: "api", title: "API" },
]

export default function TabsPage() {
  const item = getCatalogItem("tabs")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="default" title="Default">
        <DocsProse>
          The selected tab wears the default Button surface and tactile shadow
          in a full pill, springing across tabs on <code>spring.moderate</code>.
          Hovering an unselected tab brings in a soft wash that glides between
          neighbors on the same side and fades in fresh past the selected pill
          rather than crossing over it. Keyboard arrows move focus while Enter
          or Space selects.
        </DocsProse>
        <TabsDefaultDemo />
      </DocsSection>

      <DocsSection id="icons" title="With icons">
        <DocsProse>
          Pass a Heroicons component (<code>@heroicons/react/16/solid</code>) or
          element to <code>icon</code>. Active and inactive tabs share the same{" "}
          <code>font-medium</code> weight and transition only in color.
        </DocsProse>
        <TabsIconsDemo />
      </DocsSection>

      <DocsSection id="active-label" title="Active label">
        <DocsProse>
          Set <code>activeLabel</code> when every tab has an icon. Inactive tabs
          collapse to circular icon targets while keeping their accessible name
          via <code>aria-label</code>, and the selected tab expands smoothly to
          its measured width.
        </DocsProse>
        <TabsActiveLabelDemo />
      </DocsSection>

      <DocsSection id="size" title="Size">
        <DocsProse>
          Sizes match Button and Input (<code>sm</code> 28px,{" "}
          <code>default</code> 32px, <code>lg</code> 36px), so a tab bar lines
          up cleanly beside controls of the same height.
        </DocsProse>
        <TabsSizeDemo />
      </DocsSection>

      <DocsSection id="api" title="API">
        <DocsProse>
          <code>Tabs</code> wraps Base UI <code>Tabs.Root</code> and{" "}
          <code>Tabs.List</code> with manual activation (
          <code>activateOnFocus=&#123;false&#125;</code>), roving tabindex, and
          Arrow/Home/End navigation.
        </DocsProse>
        <DocsTable
          headers={["Component / Prop", "Type", "Default"]}
          rows={[
            [<code key="si">Tabs · selectedIndex</code>, "number", "—"],
            [
              <code key="os">Tabs · onSelect</code>,
              "(index: number) => void",
              "—",
            ],
            [<code key="ip">Tabs · idPrefix</code>, "string", "—"],
            [<code key="al">Tabs · activeLabel</code>, "boolean", "false"],
            [
              <code key="sz">Tabs · size</code>,
              '"sm" | "default" | "lg"',
              '"default"',
            ],
            [
              <code key="ic">TabsItem · icon</code>,
              "ComponentType<SVGProps> | ReactNode",
              "—",
            ],
            [<code key="lb">TabsItem · label</code>, "string", "—"],
            [<code key="ix">TabsItem · index</code>, "number", "—"],
            [
              <code key="tp">TabsPanel · index / selectedIndex / idPrefix</code>,
              "number / number / string",
              "—",
            ],
          ]}
        />
      </DocsSection>
    </DocsArticle>
  )
}
