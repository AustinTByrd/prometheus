import type { Metadata } from "next"
import Link from "next/link"

import { FluidHoverDemo } from "@/app/demos/fluid-hover-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Fluid Hover — Prometheus",
  description:
    "One highlight that glides from item to item under the pointer instead of blinking between them. List and Sidebar already use it.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "usage", title: "Usage" },
  { id: "behavior", title: "Behavior" },
  { id: "when", title: "When to use it" },
  { id: "api", title: "API" },
]

const usageSample = `import { FluidHoverHighlight, useFluidHover } from "@/lib/fluid-hover"

function Actions() {
  const hover = useFluidHover<HTMLDivElement>({ nearest: true })

  return (
    <div ref={hover.ref} className="relative isolate flex flex-col gap-1 p-1" {...hover.handlers}>
      <FluidHoverHighlight hover={hover} />
      {actions.map((action) => (
        <button
          data-fluid-hover-item=""
          className="h-8 rounded-md px-2 text-muted-foreground data-fluid-hover-active:text-foreground"
          key={action}
        >
          {action}
        </button>
      ))}
    </div>
  )
}`

export default function FluidHoverPage() {
  const item = getCatalogItem("fluid-hover")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="usage" title="Usage">
        <DocsProse>
          Mark each click target with <code>data-fluid-hover-item</code>, spread{" "}
          <code>handlers</code> on their container, and give the container{" "}
          <code>relative isolate</code>. Render <code>FluidHoverHighlight</code>{" "}
          first inside it. The lit item gets{" "}
          <code>data-fluid-hover-active</code>, so its label can lift to the
          foreground color.
        </DocsProse>
        <FluidHoverDemo />
        <CodeBlock>{usageSample}</CodeBlock>
      </DocsSection>
      <DocsSection id="behavior" title="Behavior">
        <DocsProse>
          A fresh entry fades in at the item it lands on instead of sliding over
          from where it last was. From there it glides between items and fades
          out when the pointer leaves. Touch never lights it. Keyboard focus
          lights the focused item when the focus is visible. Reduced motion
          keeps the fade and drops the travel.
        </DocsProse>
        <DocsTable
          headers={["Part", "Value"]}
          rows={[
            [
              "Travel",
              <>
                <code key="d">--duration-fast</code> ·{" "}
                <code key="e">--ease-standard</code>
              </>,
            ],
            [
              "Fade in and out",
              <code key="f">--duration-fast</code>,
            ],
            ["Fill", <code key="fill">bg-hover</code>],
            ["Radius", <code key="radius">rounded-sm</code>],
          ]}
        />
      </DocsSection>

      <DocsSection id="when" title="When to use it">
        <DocsProse>
          Use one highlight per group of alternatives: a menu, a nav, a{" "}
          <Link href="/component/list">List</Link>. Only click targets join it,
          since lighting a static row promises a click with nowhere to land.
          Skip it when a wrong click would hurt, when only some rows are
          clickable, or when rows move as the page scrolls.
        </DocsProse>
      </DocsSection>

      <DocsSection id="api" title="API">
        <DocsTable
          headers={["Option", "Values", "Default"]}
          rows={[
            [
              <code key="o">nearest</code>,
              "Light the item nearest the pointer, so gaps never go dark",
              "false",
            ],
            [
              <code key="o">axis</code>,
              <code key="v">{'"y" | "x" | "xy"'}</code>,
              <code key="d">y</code>,
            ],
            [
              <code key="o">gapClick</code>,
              "With nearest, a click between items goes to the lit one",
              "true",
            ],
          ]}
        />
        <DocsProse>
          <code>useFluidHover</code> returns <code>ref</code> and{" "}
          <code>handlers</code> for the container, the lit <code>rect</code>,
          and <code>light(element)</code> to light an item yourself.{" "}
          <code>FluidHoverHighlight</code> takes the hook as <code>hover</code>,
          an <code>inset</code> in pixels, and <code>as=&quot;li&quot;</code>{" "}
          inside a list. Color and radius go in <code>className</code>.
        </DocsProse>
      </DocsSection>
    </DocsArticle>
  )
}
