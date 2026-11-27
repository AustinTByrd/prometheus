import type { Metadata } from "next"
import Link from "next/link"

import { MachineDemo } from "@/app/demos/state-machine-docs"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"
import { machines } from "@/lib/state-machines"

const lede =
  "Every component that changes over time is a state machine, whether or not its code says so. These are the ones in Prometheus, each drawn from its source."

export const metadata: Metadata = {
  title: "State machines — Prometheus",
  description: lede,
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "inventory", title: "Inventory" },
  ...machines.map((machine) => ({ id: machine.id, title: machine.title })),
]

export default function StateMachinesPage() {
  return (
    <DocsArticle lede={lede} title="State machines" toc={toc}>
      <DocsSection id="inventory" title="Inventory">
        <DocsProse>
          Each machine below runs the same transitions as the component. Where
          a preview sits above the diagram, the real component drives it, and
          the events move the real component. The rest step through by hand.
        </DocsProse>
        <DocsTable
          headers={["Machine", "Used by", "States", "Driven by"]}
          rows={machines.map((machine) => [
            <a href={`#${machine.id}`} key="m">
              {machine.title}
            </a>,
            <span className="flex flex-wrap gap-x-2" key="u">
              {machine.slugs.map((slug) => (
                <Link href={`/component/${slug}`} key={slug}>
                  {getCatalogItem(slug)?.title ?? slug}
                </Link>
              ))}
            </span>,
            machine.states.length,
            machine.drivenBy,
          ])}
        />
      </DocsSection>

      {machines.map((machine) => (
        <DocsSection id={machine.id} key={machine.id} title={machine.title}>
          <DocsProse>{machine.summary}</DocsProse>
          <MachineDemo id={machine.id} slug={machine.slugs[0]} />
          <p className="text-xs text-muted-foreground">
            Source: <code>{machine.source}</code>
          </p>
        </DocsSection>
      ))}
    </DocsArticle>
  )
}
