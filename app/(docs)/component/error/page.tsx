import type { Metadata } from "next"
import Link from "next/link"

import { ErrorDemo } from "@/app/demos/states-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
} from "@/components/site/docs-article"
import { MachineSections, statesToc } from "@/components/site/machine-sections"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Error — Prometheus",
  description: "Error state with an icon slot, a title, one sentence, and actions.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "structure", title: "Structure" },
]

const sample = `<ErrorState
  icon={<ExclamationCircleIcon />}
  title="Orders didn't load"
  description="The orders could not be loaded. Your place in the list is unchanged."
  actions={<Button>Try again</Button>}
/>`

export default function ErrorPage() {
  const item = getCatalogItem("error")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={[...toc, ...statesToc("error")]}>
      <DocsSection id="structure" title="Structure">
        <DocsProse>
          Same frame as Empty: icon, title, one sentence, and a way forward.
          Say what failed and what still holds.
        </DocsProse>
        <ErrorDemo />
        <CodeBlock>{sample}</CodeBlock>
      </DocsSection>
      <MachineSections slug="error" />
    </DocsArticle>
  )
}
