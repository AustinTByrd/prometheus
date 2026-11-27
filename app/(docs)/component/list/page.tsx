import type { Metadata } from "next"
import Link from "next/link"

import { ListDemo } from "@/app/demos/fluid-hover-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "List — Prometheus",
  description:
    "Rows of links between hairline rules, with a title on the left and a detail on the right. One Fluid Hover fill glides from row to row.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "usage", title: "Usage" },
  { id: "anatomy", title: "Anatomy" },
  { id: "api", title: "API" },
]

const usageSample = `import Link from "next/link"
import { List, ListItem } from "@/components/ui/list"

<List label="Open roles">
  {roles.map((role) => (
    <ListItem href={role.url} key={role.url} meta={role.team} target="_blank">
      {role.title}
    </ListItem>
  ))}
</List>

// An internal route keeps Next Link prefetching:
<ListItem meta="Legal" render={<Link href="/careers/counsel" />}>
  Commercial Counsel
</ListItem>`

export default function ListPage() {
  const item = getCatalogItem("list")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="usage" title="Usage">
        <DocsProse>
          Use a list for a short set of destinations of the same kind, like open
          roles or posts. Every row is a link, so the whole row is the click
          target. Rest on a row and the fill follows the pointer down the list.
        </DocsProse>
        <ListDemo />
        <CodeBlock>{usageSample}</CodeBlock>
      </DocsSection>
      <DocsSection id="anatomy" title="Anatomy">
        <DocsTable
          headers={["Part", "Value"]}
          rows={[
            ["Label", "14px, muted at 70%, 12px above the rows"],
            [
              "Row",
              "44px tall, 5px side padding, a 1px border rule below, and one above the first",
            ],
            [
              "Title and detail",
              "16px muted, tracking −0.01em. Below 28rem the title drops to 15px and the detail hides",
            ],
            ["Fill", "bg-muted, 34px tall, 5px inside the row, rounded-lg"],
          ]}
        />
      </DocsSection>

      <DocsSection id="api" title="API">
        <DocsTable
          headers={["Part", "Prop", "Values"]}
          rows={[
            ["List", <code key="p">label</code>, "ReactNode, names the group"],
            ["ListItem", <code key="p">meta</code>, "ReactNode on the right"],
            [
              "ListItem",
              <code key="p">render</code>,
              "Element to render as, like a Next Link",
            ],
          ]}
        />
        <DocsProse>
          <code>ListItem</code> renders an <code>a</code> and takes every anchor
          prop.
        </DocsProse>
      </DocsSection>
    </DocsArticle>
  )
}
