import type { Metadata } from "next"

import { MenuDemo } from "@/app/demos/menu-docs"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Menu — Prometheus",
  description:
    "Base UI menu that lifts two surface steps off its substrate, with Lisse smooth corners, radio and checkbox items, and nested submenus.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "usage", title: "Usage" },
  { id: "api", title: "API" },
]

export default function MenuPage() {
  const item = getCatalogItem("menu")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="usage" title="Usage">
        <DocsProse>
          The popup lifts two surface steps and uses Lisse corners. Prefer{" "}
          <code>MenuRadioGroup</code> for a single choice (theme, size) and{" "}
          <code>MenuCheckboxItem</code> for toggles. Nest with{" "}
          <code>MenuSub</code>. Base UI uses <code>render</code> on the trigger
          when you want a Button.
        </DocsProse>
        <MenuDemo />
      </DocsSection>
      <DocsSection id="api" title="API">
        <DocsTable
          headers={["Export", "Role"]}
          rows={[
            [<code key="r">Menu</code>, "Root. Owns open state."],
            [<code key="t">MenuTrigger</code>, "Opens the menu. Use render for Button."],
            [<code key="c">MenuContent</code>, "Positioned popup on the surface ladder."],
            [<code key="i">MenuItem</code>, "Action row. variant destructive for danger."],
            [
              <code key="rg">MenuRadioGroup</code>,
              "Single selection among MenuRadioItem.",
            ],
            [
              <code key="cb">MenuCheckboxItem</code>,
              "Independent on/off row with a check.",
            ],
            [<code key="s">MenuSub</code>, "Nested menu with SubTrigger and SubContent."],
          ]}
        />
      </DocsSection>
    </DocsArticle>
  )
}
