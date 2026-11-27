import type { Metadata } from "next"

import { SwitchDemo } from "@/app/demos/switch-docs"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Switch — Prometheus",
  description:
    "A labeled toggle. The thumb stretches on hover and press, springs across the track, and can be dragged past the midpoint to flip.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "usage", title: "Usage" },
  { id: "api", title: "API" },
]

export default function SwitchPage() {
  const item = getCatalogItem("switch")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="usage" title="Usage">
        <DocsProse>
          Off, the track is the accent surface. On, it fills with primary. The
          thumb grows into a pill on hover, stretches further on press, and
          the label lifts from muted to foreground with the state.
        </DocsProse>
        <SwitchDemo />
      </DocsSection>
      <DocsSection id="api" title="API">
        <DocsTable
          headers={["Prop", "Values", "Default"]}
          rows={[
            [<code key="p">label</code>, "string", "—"],
            [<code key="p">checked</code>, "boolean", "—"],
            [<code key="p">onToggle</code>, "() =&gt; void", "—"],
            [
              <code key="p">disabled</code>,
              "boolean",
              <code key="d">false</code>,
            ],
          ]}
        />
      </DocsSection>
    </DocsArticle>
  )
}
