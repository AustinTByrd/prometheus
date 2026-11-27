import type { Metadata } from "next"
import Link from "next/link"

import { EmptyDemo } from "@/app/demos/states-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
} from "@/components/site/docs-article"
import { MachineSections, statesToc } from "@/components/site/machine-sections"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Empty — Prometheus",
  description: "Empty state with an icon slot, a title, one sentence, and actions.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "structure", title: "Structure" },
]

const sample = `<Empty
  icon={<InboxIcon />}
  title="No orders yet"
  description="Orders you create will show up here."
  actions={<Button>New order</Button>}
/>`

export default function EmptyPage() {
  const item = getCatalogItem("empty")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={[...toc, ...statesToc("empty")]}>
      <DocsSection id="structure" title="Structure">
        <DocsProse>
          Icon, title, one sentence, and actions. The icon is a slot; leave
          sizing to the component. Use the 24px outline set,{" "}
          <code>@heroicons/react/24/outline</code>, since the slot renders at
          32px.
        </DocsProse>
        <EmptyDemo />
        <CodeBlock>{sample}</CodeBlock>
      </DocsSection>
      <MachineSections slug="empty" />
    </DocsArticle>
  )
}
