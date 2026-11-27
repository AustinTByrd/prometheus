import type { Metadata } from "next"
import Link from "next/link"

import { BadgeDemo } from "@/app/demos/badge-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Badge — Prometheus",
  description:
    "Soft pill labels on the Data Foundations pastel palette, plus a neutral muted default. A translucent tint sits over the local surface so the wash stays stable on any parent.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "usage", title: "Usage" },
  { id: "color", title: "Color" },
  { id: "api", title: "API" },
]

const usageSample = `import { Badge } from "@/components/ui/badge"

<Badge>Draft</Badge>
<Badge color="blue">Live</Badge>
<Badge color="sage" size="lg">Healthy</Badge>`

export default function BadgePage() {
  const item = getCatalogItem("badge")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="usage" title="Usage">
        <DocsProse>
          Soft tags on the Data Foundations palette. Leave <code>color</code>{" "}
          off for a muted neutral. <code>size=&quot;lg&quot;</code> is one step
          up for denser labels and titles.
        </DocsProse>
        <BadgeDemo />
        <CodeBlock>{usageSample}</CodeBlock>
      </DocsSection>
      <DocsSection id="color" title="Color">
        <DocsProse>
          Colors are the{" "}
          <Link href="/component/data-foundations">Data Foundations</Link>{" "}
          six: blue, sand, terracotta, plum, sage, amber. Soft tags clear 7:1
          in light and dark. Pass any CSS color and the tag shades mix from it.
        </DocsProse>
      </DocsSection>
      <DocsSection id="api" title="API">
        <DocsTable
          headers={["Prop", "Values"]}
          rows={[
            [
              <code key="p">color</code>,
              "blue · sand · terracotta · plum · sage · amber · CSS color",
            ],
            [<code key="p">size</code>, "default · lg"],
          ]}
        />
      </DocsSection>
    </DocsArticle>
  )
}
