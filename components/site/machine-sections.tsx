import Link from "next/link"

import { MachineDemo } from "@/app/demos/state-machine-docs"
import { DocsProse, DocsSection, DocsSubsection } from "@/components/site/docs-article"
import { machinesFor } from "@/lib/state-machines"

export function statesToc(slug: string) {
  return machinesFor(slug).length ? [{ id: "states", title: "States" }] : []
}

export function MachineSections({ slug }: { slug: string }) {
  const found = machinesFor(slug)
  if (!found.length) return null

  return (
    <DocsSection id="states" title="States">
      <DocsProse>
        The states this component moves through, and the events that move it.
        The full set is on <Link href="/state-machines">State machines</Link>.
      </DocsProse>
      {found.map((machine) =>
        found.length > 1 ? (
          <DocsSubsection id={`states-${machine.id}`} key={machine.id} title={machine.title}>
            <DocsProse>{machine.summary}</DocsProse>
            <MachineDemo id={machine.id} slug={slug} />
          </DocsSubsection>
        ) : (
          <div className="flex flex-col gap-4" key={machine.id}>
            <DocsProse>{machine.summary}</DocsProse>
            <MachineDemo id={machine.id} slug={slug} />
          </div>
        )
      )}
    </DocsSection>
  )
}
