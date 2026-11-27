import type { Metadata } from "next"

import Link from "next/link"

import { BarChartDemo } from "@/app/demos/data-display-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Bar chart — Prometheus",
  description:
    "A standard bar chart on a hairline grid, one bar per category, with an optional insight under the title. Pastel fills with a deeper stroke, and a value tag on hover.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "usage", title: "Usage" },
  { id: "color", title: "Color and hover" },
  { id: "scale", title: "Scale and partial values" },
  { id: "accessibility", title: "Accessibility" },
  { id: "api", title: "API" },
]

const usageSample = `import {
  BarChart,
  ChartGrid,
  type BarDatum,
} from "@/components/ui/data-display"

const thisShelf: BarDatum[] = [
  { label: "Gatsby", value: 47094 },
  { label: "Frankenstein", value: 75380 },
  { label: "1984", value: 88942 },
  { label: "Pride & Prejudice", value: 121970 },
  { label: "Jane Eyre", value: 183858 },
  { label: "Moby-Dick", value: 206052 },
]

<ChartGrid>
  <BarChart
    title="Total words in the book"
    caption="Total words in each book on this shelf"
    data={thisShelf}
    totals={
      <>
        <b className="font-medium text-foreground">Moby-Dick</b> runs
        longest — give it the month, not a weekend.
      </>
    }
    categoryLabel="Work"
    valueLabel="Words"
  />
</ChartGrid>`

export default function BarChartPage() {
  const item = getCatalogItem("bar-chart")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="usage" title="Usage">
        <DocsProse>
          Each card plots one measure across categories — one bar each. Pass{" "}
          <code>totals</code> for a short insight under the title.{" "}
          <code>ChartGrid</code> sets two cards side by side once it is 52rem
          wide. Rest anywhere above a bar to read its value.
        </DocsProse>
        <BarChartDemo />
        <CodeBlock>{usageSample}</CodeBlock>
      </DocsSection>
      <DocsSection id="color" title="Color and hover">
        <DocsProse>
          Each bar is a pastel fill with a 1px stroke a step deeper, on a grid
          of hairlines at 7% ink. Resting on a bar — or in the column above it —
          deepens both over 200ms and fades in a tag with its value. Labels and
          ticks are 11.5px in the muted color, and numbers use tabular digits.
          Colors come from the{" "}
          <Link href="/component/data-foundations">Data Foundations</Link>{" "}
          palette in order, or set <code>color</code> on a datum.
        </DocsProse>
      </DocsSection>

      <DocsSection id="scale" title="Scale and partial values">
        <DocsProse>
          The axis steps by 1, 2, or 5 at the size of the tallest bar, and tops
          out one step above it with at most six steps. Pass <code>max</code> to
          share an axis across cards. A value with <code>partial: true</code> is
          hatched in its stroke color, for a run that only partly counts, and
          its <code>note</code> joins the bar title. A missing value leaves a
          gap.
        </DocsProse>
      </DocsSection>

      <DocsSection id="accessibility" title="Accessibility">
        <DocsProse>
          The plot is hidden from screen readers. A visually hidden table
          carries the same numbers, with <code>caption</code> as its caption,{" "}
          <code>categoryLabel</code> over the first column, and{" "}
          <code>valueLabel</code> over the second. Bars fade in one after
          another the first time the chart scrolls into view. Reduced motion
          shows them in place.
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
              "{ label, value: number | { value, partial?, note? } | null, color? }[]",
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
          Bars take the{" "}
          <Link href="/component/data-foundations">palette</Link> in order. Set{" "}
          <code>color</code> on a datum to a palette name, or to any CSS color
          and the stroke, hover, and tag shades mix from it.{" "}
          <code>ChartKey</code> still takes a <code>series</code> list when you
          need a separate legend.
        </DocsProse>
      </DocsSection>
    </DocsArticle>
  )
}
