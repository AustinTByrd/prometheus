import type { Metadata } from "next"

import Link from "next/link"

import { LineChartDemo } from "@/app/demos/data-display-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Line chart — Prometheus",
  description:
    "A monochrome line chart on the same hairline grid and Elevated card as the bar chart, with an optional insight under the title. Solid markers, a soft area wash, and a value tag on hover.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "usage", title: "Usage" },
  { id: "hover", title: "Hover" },
  { id: "scale", title: "Scale and gaps" },
  { id: "accessibility", title: "Accessibility" },
  { id: "api", title: "API" },
]

const usageSample = `import {
  ChartGrid,
  LineChart,
  type LineDatum,
} from "@/components/ui/data-display"

const odysseyBooks: LineDatum[] = [
  { label: "I", value: 4200 },
  { label: "II", value: 3800 },
  { label: "III", value: 5100 },
  { label: "IV", value: 6400 },
  { label: "V", value: { value: 7200, note: "Calypso" } },
  { label: "VI", value: 3900 },
  // …
]

<ChartGrid>
  <LineChart
    title="Words per book"
    detail="· Odyssey"
    caption="Approximate word counts by book in the Odyssey, books I–VIII"
    data={odysseyBooks}
    format={(value) => \`\${(value / 1000).toFixed(1)}k\`}
    totals={
      <>
        <b className="font-medium text-foreground">Book V</b> peaks — put
        the seminar discussion on Calypso there.
      </>
    }
    categoryLabel="Book"
    valueLabel="Words"
  />
</ChartGrid>`

export default function LineChartPage() {
  const item = getCatalogItem("line-chart")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="usage" title="Usage">
        <DocsProse>
          Same card shell as the{" "}
          <Link href="/component/bar-chart">bar chart</Link>: Elevated surface,
          title, optional insight, hairline grid. The line itself stays
          monochrome — foreground ink, no palette color. Pass{" "}
          <code>totals</code> for a short insight under the title. Rest anywhere
          in a point&apos;s column to read its value.
        </DocsProse>
        <LineChartDemo />
        <CodeBlock>{usageSample}</CodeBlock>
      </DocsSection>
      <DocsSection id="hover" title="Hover">
        <DocsProse>
          Solid foreground markers sit on the line. Hover scales a marker and
          fades in a solid value tag. Unlike bars, the line chart does not use
          the{" "}
          <Link href="/component/data-foundations">Data Foundations</Link>{" "}
          pastels — those stay for multi-category color encoding.
        </DocsProse>
      </DocsSection>

      <DocsSection id="scale" title="Scale and gaps">
        <DocsProse>
          The axis steps by 1, 2, or 5 at the size of the peak, and tops out one
          step above it with at most six steps — the same scale helper as bars.
          Pass <code>max</code> to share an axis across cards. A missing value
          breaks the line so the path does not bridge the gap; its{" "}
          <code>note</code> still joins the point title when present.
        </DocsProse>
      </DocsSection>

      <DocsSection id="accessibility" title="Accessibility">
        <DocsProse>
          The plot is hidden from screen readers. A visually hidden table
          carries the same numbers, with <code>caption</code> as its caption,{" "}
          <code>categoryLabel</code> over the first column, and{" "}
          <code>valueLabel</code> over the second. The line and points fade in
          the first time the chart scrolls into view. Reduced motion shows them
          in place.
        </DocsProse>
      </DocsSection>

      <DocsSection id="api" title="API">
        <DocsTable
          headers={["Prop", "Values", "Default"]}
          rows={[
            [<code key="p">title</code>, "ReactNode", "—"],
            [
              <code key="p">detail</code>,
              "ReactNode, muted after the title",
              "—",
            ],
            [
              <code key="p">data</code>,
              "{ label, value: number | { value, note? } | null }[]",
              "—",
            ],
            [<code key="p">caption</code>, "string", "—"],
            [
              <code key="p">totals</code>,
              "ReactNode insight under the title",
              "hidden",
            ],
            [<code key="p">format</code>, "(value) => string", "compact"],
            [<code key="p">formatTick</code>, "(value) => string", "compact"],
            [<code key="p">max</code>, "number", "one step over the peak"],
            [
              <code key="p">categoryLabel</code>,
              "string",
              <code key="d">Category</code>,
            ],
            [
              <code key="p">valueLabel</code>,
              "string",
              <code key="d">Value</code>,
            ],
          ]}
        />
        <DocsProse>
          Shares <code>ChartGrid</code> with the bar chart. Prefer a line when
          the categories are ordered in time or sequence; prefer bars when each
          category stands alone.
        </DocsProse>
      </DocsSection>
    </DocsArticle>
  )
}
