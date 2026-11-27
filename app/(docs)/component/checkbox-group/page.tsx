import type { Metadata } from "next"
import Link from "next/link"

import { CheckboxGroupDemo } from "@/app/demos/checkbox-group-docs"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Checkbox group — Prometheus",
  description:
    "Checkbox rows with Fluid Hover and contiguous selections that merge into one background. Each row uses a filled check.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "usage", title: "Usage" },
  { id: "api", title: "API" },
]

export default function CheckboxGroupPage() {
  const item = getCatalogItem("checkbox-group")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="usage" title="Usage">
        <DocsProse>
          The parent owns the checked set. Pass the whole set as{" "}
          <code>checkedIndices</code> so the group can merge neighbours, and
          each item its own <code>checked</code> and <code>onToggle</code>.
          Arrow keys move between rows; Space or Enter toggles.
        </DocsProse>
        <CheckboxGroupDemo />
      </DocsSection>
      <DocsSection id="api" title="API">
        <DocsTable
          headers={["Prop", "Values", "Default"]}
          rows={[
            [
              <code key="p">checkedIndices</code>,
              "Set&lt;number&gt;",
              "—",
            ],
          ]}
        />
        <DocsProse>
          <code>CheckboxItem</code> takes <code>label</code>,{" "}
          <code>index</code>, <code>checked</code>, and <code>onToggle</code>.
        </DocsProse>
      </DocsSection>
    </DocsArticle>
  )
}
