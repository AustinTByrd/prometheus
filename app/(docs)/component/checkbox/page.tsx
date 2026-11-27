import type { Metadata } from "next"
import Link from "next/link"

import { CheckboxDemo } from "@/app/demos/checkbox-docs"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Checkbox — Prometheus",
  description:
    "A hairline square. Checked, it fills with foreground and a surface-colored Heroicons check. Pair with Field.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "usage", title: "Usage" },
  { id: "api", title: "API" },
]

export default function CheckboxPage() {
  const item = getCatalogItem("checkbox")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="usage" title="Usage">
        <DocsProse>
          The square is 16px with a hairline border. Checked, it fills with
          foreground and shows a surface-colored Heroicons check. An{" "}
          <code>indeterminate</code> box fills the same way with a minus, for a
          select-all over a partial set. Clicking it reports{" "}
          <code>true</code>.
        </DocsProse>
        <CheckboxDemo />
      </DocsSection>
      <DocsSection id="api" title="API">
        <DocsProse>
          Accepts every Base UI <code>Checkbox</code> prop, plus:
        </DocsProse>
        <DocsTable
          headers={["Prop", "Values", "Default"]}
          rows={[
            [<code key="p">checked</code>, "boolean", "—"],
            [
              <code key="p">defaultChecked</code>,
              "boolean",
              <code key="d">false</code>,
            ],
            [
              <code key="p">indeterminate</code>,
              "boolean",
              <code key="d">false</code>,
            ],
            [
              <code key="p">onCheckedChange</code>,
              "(checked: boolean) => void",
              "—",
            ],
          ]}
        />
      </DocsSection>
    </DocsArticle>
  )
}
