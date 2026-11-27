import type { Metadata } from "next"
import Link from "next/link"

import { ChartPaletteDemo } from "@/app/demos/data-display-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Data Foundations — Prometheus",
  description:
    "Six pastels for charts, in an order that keeps neighbouring series apart under protanopia, deuteranopia, and tritanopia, with the pairs to keep apart.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "palette", title: "Palette" },
  { id: "order", title: "Order" },
  { id: "pairing", title: "Pairing" },
  { id: "beyond-six", title: "Beyond six series" },
  { id: "usage", title: "Usage" },
]

const usageSample = `import { chartPalette } from "@/lib/chart-palette"
import { Badge } from "@/components/ui/badge"
import { type ChartSeries } from "@/components/ui/data-display"

// Defaults follow chartPalette: blue, sand, terracotta, …
const series: ChartSeries[] = [
  { key: "ardia", label: "Ardia" },
  { key: "aside", label: "Aside" },
]

// Pin a color by name, keeping pairs from "Keep apart from" off neighbours.
const pinned: ChartSeries[] = [
  { key: "revenue", label: "Revenue", color: "blue" },
  { key: "cost", label: "Cost", color: "terracotta" },
]

// Badges share the same soft tags.
<Badge color="blue">Live</Badge>
{chartPalette.map((color) => (
  <Badge color={color} key={color}>{color}</Badge>
))}`

export default function DataFoundationsPage() {
  const item = getCatalogItem("data-foundations")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="palette" title="Palette">
        <DocsProse>
          Six pastels, built for data rather than brand. Each has a fill, a
          stroke a step deeper, hover shades for both, and a soft tag with text
          that clears 7:1. Tags are a translucent wash of the fill over the
          local surface, in light and dark. Switch the simulation to see the
          palette the way people with each common color vision type do.
        </DocsProse>
        <ChartPaletteDemo />
      </DocsSection>
      <DocsSection id="order" title="Order">
        <DocsProse>
          Series take the colors in order: blue, sand, terracotta, plum, sage,
          amber. The order is the accessibility work. Each color was checked
          against simulated protanopia, deuteranopia, and tritanopia, and any
          three neighbours stay clearly apart under all of them. Lightness also
          alternates from one to the next, so bars still differ when hue
          collapses. The first two, blue and sand, sit on the blue–yellow axis
          that every common color vision type keeps, so a two-series chart is
          the safest chart.
        </DocsProse>
      </DocsSection>

      <DocsSection id="pairing" title="Pairing">
        <DocsProse>
          When you pick colors by hand, keep pairs from the last column off
          neighbouring bars.
        </DocsProse>
        <DocsTable
          headers={["Color", "Fill", "Pairs well with", "Keep apart from"]}
          rows={[
            ["Blue", <code key="f">#9ec0ea</code>, "sand, terracotta, amber", "sage, plum"],
            ["Sand", <code key="f">#ece2a0</code>, "blue, terracotta, plum", "sage, amber"],
            ["Terracotta", <code key="f">#e39a79</code>, "blue, sand, sage", "amber"],
            ["Plum", <code key="f">#b393cf</code>, "sand, sage, amber", "blue"],
            ["Sage", <code key="f">#b2e3cc</code>, "plum, terracotta, amber", "sand, blue"],
            ["Amber", <code key="f">#f4bf73</code>, "blue, plum, sage", "sand, terracotta"],
          ]}
        />
      </DocsSection>

      <DocsSection id="beyond-six" title="Beyond six series">
        <DocsProse>
          Past six series, color alone stops working for anyone. Group the
          extras into “Other”, split the chart, or label bars directly. Values
          never rely on color alone: the key names every series, and each
          bar's title and the screen reader table carry its name.
        </DocsProse>
      </DocsSection>

      <DocsSection id="usage" title="Usage">
        <DocsProse>
          Leave <code>color</code> unset to follow the order. Set it to a
          palette name to pin a series, or to any CSS color and the stroke,
          hover, and tag shades mix from it. <code>chartPalette</code> exports
          the order. Soft labels elsewhere use the same tags via{" "}
          <Link href="/component/badge">Badge</Link>.
        </DocsProse>
        <CodeBlock>{usageSample}</CodeBlock>
      </DocsSection>
    </DocsArticle>
  )
}
