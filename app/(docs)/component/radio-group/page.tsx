import type { Metadata } from "next"
import Link from "next/link"

import { RadioGroupDemo } from "@/app/demos/radio-group-docs"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Radio group — Prometheus",
  description:
    "Radio rows styled like Checkbox group: Fluid Hover, a muted selection fill, and a filled control with a surface-colored dot. One option at a time.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "usage", title: "Usage" },
  { id: "api", title: "API" },
]

export default function RadioGroupPage() {
  const item = getCatalogItem("radio-group")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="usage" title="Usage">
        <DocsProse>
          A muted fill glides to the selected row. The control fills with
          foreground and a surface-colored center; hover previews a dim dot
          inside the burn border. Arrow keys move focus and select in one
          step; Home and End jump to the ends.
        </DocsProse>
        <RadioGroupDemo />
      </DocsSection>
      <DocsSection id="api" title="API">
        <DocsTable
          headers={["Prop", "Values", "Default"]}
          rows={[
            [<code key="p">selectedIndex</code>, "number", "—"],
            [<code key="p">value</code>, "string", "—"],
            [
              <code key="p">onValueChange</code>,
              "(value: string) =&gt; void",
              "—",
            ],
          ]}
        />
        <DocsProse>
          <code>RadioItem</code> takes <code>label</code>, <code>index</code>,
          and either <code>selected</code> with <code>onSelect</code>, or a{" "}
          <code>value</code> when the group is value-controlled.
        </DocsProse>
      </DocsSection>
    </DocsArticle>
  )
}
