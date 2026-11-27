import type { Metadata } from "next"

import { TableResizeDemo } from "@/app/demos/table-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { MachineSections, statesToc } from "@/components/site/machine-sections"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Table — Prometheus",
  description:
    "TanStack Table and Virtual, with cells that split, stretch, and snap as the container widens.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "resize", title: "Resize" },
  { id: "splits", title: "Splits" },
  { id: "motion", title: "Motion" },
  { id: "api", title: "API" },
]

const splitsExample = `const splits = [
  { host: "name", guest: "amount", breakpoint: 400, width: 112 },
  { host: "close", guest: "team", breakpoint: 520, width: 96, merged: "hidden" },
]`

export default function TablePage() {
  const item = getCatalogItem("table")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={[...toc, ...statesToc("table")]}>
      <DocsSection id="resize" title="Resize">
        <DocsProse>
          Drag the right edge, or focus it and use the arrow keys. The table
          starts with the amount still on the deal name. Past 400px the amount
          takes its own column, and the label switches from <code>$24k</code>{" "}
          to <code>USD 24k</code>. Past 520px the team column opens. Close
          date and owner stay put.
        </DocsProse>
        <TableResizeDemo />
      </DocsSection>
      <DocsSection id="splits" title="Splits">
        <DocsProse>
          A split pairs a host column with a guest. An inline guest draws
          inside the host until the breakpoint, and the host truncates instead
          of widening the table. A hidden guest stays out of the host and
          fades in as its column opens. Empty values travel as a dash.
        </DocsProse>
        <CodeBlock>{splitsExample}</CodeBlock>
      </DocsSection>

      <DocsSection id="motion" title="Motion">
        <DocsProse>
          Near a breakpoint the guest leans toward the column it is about to
          join, and the host gives a few pixels. Crossing the breakpoint eases
          the rest of the way and puts the host back immediately. Narrowing
          pulls them together, then clicks them into one cell. There is no
          overshoot. Reduced motion skips the lean and switches at the
          breakpoint.
        </DocsProse>
      </DocsSection>

      <DocsSection id="api" title="API">
        <DocsTable
          headers={["Prop", "Type", "Default"]}
          rows={[
            [
              <code key="p">data</code>,
              "TData[]",
              "—",
            ],
            [
              <code key="p">columns</code>,
              "ColumnDef[] from createTableColumnHelper",
              "—",
            ],
            [
              <code key="p">splits</code>,
              '{ host, guest, breakpoint, width, merged? }[]',
              "[]",
            ],
            [
              <code key="p">estimateSize</code>,
              "row height in px",
              <code key="d">36</code>,
            ],
            [
              <code key="p">showHeader</code>,
              "boolean",
              <code key="d">true</code>,
            ],
          ]}
        />
        <DocsProse>
          Column <code>meta</code> accepts <code>icon</code> (a Heroicons
          component),{" "}
          <code>align</code> (<code>start</code> or <code>end</code>), and{" "}
          <code>width</code> for columns that stay a fixed size.
        </DocsProse>
      </DocsSection>
      <MachineSections slug="table" />
    </DocsArticle>
  )
}
