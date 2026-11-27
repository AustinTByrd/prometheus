import type { Metadata } from "next"
import Link from "next/link"

import {
  TooltipContentDemo,
  TooltipDelayDemo,
  TooltipPlacementDemo,
  TooltipSizeDemo,
  TooltipSurfaceDemo,
} from "@/app/demos/tooltip-docs"
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
  title: "Tooltip — Prometheus",
  description:
    "Base UI tooltip that lifts two surface steps off its substrate, with Lisse smooth corners, collision-aware positioning, and composable parts for custom layouts.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "usage", title: "Usage" },
  { id: "placement", title: "Placement" },
  { id: "size", title: "Size and arrow" },
  { id: "content", title: "Content" },
  { id: "surfaces", title: "On surfaces" },
  { id: "delay", title: "Delay and grouping" },
  { id: "accessibility", title: "Accessibility" },
  { id: "composition", title: "Composition" },
  { id: "api", title: "API" },
]

const usageSample = `import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

<Tooltip>
  <TooltipTrigger render={<Button aria-label="Archive" size="icon" />}>
    <ArchiveBoxIcon />
  </TooltipTrigger>
  <TooltipContent>Archive</TooltipContent>
</Tooltip>`

const compositionSample = `import {
  Tooltip,
  TooltipArrow,
  TooltipPopup,
  TooltipPortal,
  TooltipPositioner,
  TooltipTrigger,
} from "@/components/ui/tooltip"

<Tooltip>
  <TooltipTrigger render={<Button />}>Status</TooltipTrigger>
  <TooltipPortal container={panelRef}>
    <TooltipPositioner side="bottom" sticky>
      <TooltipPopup size="lg">
        <TooltipArrow />
        Synced 2 minutes ago
      </TooltipPopup>
    </TooltipPositioner>
  </TooltipPortal>
</Tooltip>`

const handleSample = `const handle = createTooltipHandle<{ label: string }>()

<TooltipTrigger handle={handle} payload={{ label: "Bold" }} render={<Button />} />
<TooltipTrigger handle={handle} payload={{ label: "Italic" }} render={<Button />} />

<Tooltip handle={handle}>
  {({ payload }) => <TooltipContent>{payload?.label}</TooltipContent>}
</Tooltip>`

export default function TooltipPage() {
  const item = getCatalogItem("tooltip")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={[...toc, ...statesToc("tooltip")]}>
      <DocsSection id="usage" title="Usage">
        <DocsProse>
          A tooltip names a control or shows a value that is cut off. It opens
          on hover and on keyboard focus, and it never holds anything a person
          needs to press. <code>TooltipTrigger</code> renders a button, so pass
          the control through <code>render</code> instead of nesting one
          button inside another. <code>PrometheusProvider</code> already
          supplies the <code>TooltipProvider</code>.
        </DocsProse>
        <CodeBlock>{usageSample}</CodeBlock>
      </DocsSection>
      <DocsSection id="placement" title="Placement">
        <DocsProse>
          Top is the default. Use <code>right</code> beside a vertical rail,
          as the sidebar does, and <code>bottom</code> under a top bar. The
          side flips and the popup shifts when it would leave the viewport,
          so pick the side that reads best and let collision handling cover
          the edges.
        </DocsProse>
        <TooltipPlacementDemo />
      </DocsSection>

      <DocsSection id="size" title="Size and arrow">
        <DocsProse>
          <code>default</code> fits a label or a short sentence.{" "}
          <code>sm</code> is for dense toolbars where the label is one word.{" "}
          <code>lg</code> moves to the <code>text-sm</code> step and widens to{" "}
          <code>max-w-sm</code> for a sentence or two. The arrow takes the
          popup&apos;s surface color. Drop it when the tooltip sits flush
          against a large trigger and the pointer is unclear anyway.
        </DocsProse>
        <TooltipSizeDemo />
      </DocsSection>

      <DocsSection id="content" title="Content">
        <DocsProse>
          Keep it to plain text. Add a keyboard shortcut with{" "}
          <code>&lt;kbd data-slot=&quot;kbd&quot;&gt;</code>; the popup styles
          it and trims its own end padding to match. For truncated text, make
          the trigger focusable so keyboard users reach the full value too.
        </DocsProse>
        <TooltipContentDemo />
      </DocsSection>

      <DocsSection id="surfaces" title="On surfaces">
        <DocsProse>
          The popup reads its substrate from the{" "}
          <Link href="/component/elevated">surface ladder</Link> and lifts two
          steps, the same as a menu, with a fixed <code>shadow-surface-3</code>.
          Surface context follows the React tree through the portal, so a
          tooltip inside a dialog still lifts above the dialog.
        </DocsProse>
        <TooltipSurfaceDemo />
      </DocsSection>

      <DocsSection id="delay" title="Delay and grouping">
        <DocsProse>
          <code>PrometheusProvider</code> sets the hover delay to 0, so a
          tooltip opens as soon as the pointer arrives. Raise it with a nested{" "}
          <code>TooltipProvider</code> where triggers sit close together and
          pass-through hovers would flicker. Once one tooltip in a provider
          opens, its neighbors open at once until <code>timeout</code> (400ms)
          passes with none open. Keyboard focus skips the delay.
        </DocsProse>
        <TooltipDelayDemo />
      </DocsSection>

      <DocsSection id="accessibility" title="Accessibility">
        <DocsProse>
          A tooltip adds to an accessible name; it does not replace one. Give
          icon-only buttons an <code>aria-label</code> that matches the
          tooltip. Touch devices have no hover, so nothing a person needs
          should live only in a tooltip. Escape closes it, and it never takes
          focus. A disabled button gets no pointer events, so wrap it in a
          focusable <code>span</code> when the tooltip explains why it is
          disabled.
        </DocsProse>
      </DocsSection>

      <DocsSection id="composition" title="Composition">
        <DocsProse>
          <code>TooltipContent</code> bundles the portal, the positioner, the
          popup, and the arrow. When a layout needs a custom portal container,
          a sticky positioner, or a viewport for animated content swaps, build
          it from the parts. They keep the surface lift and smooth corners.
          Put <code>TooltipArrow</code> inside <code>TooltipPopup</code>, before
          the text. The popup keeps the origin-aware transition, and the
          squircle clips an inner surface, so the arrow stays outside that
          clip and above the shadow.
        </DocsProse>
        <CodeBlock>{compositionSample}</CodeBlock>
        <DocsProse>
          One tooltip can serve many triggers through a handle. Each trigger
          passes a <code>payload</code>, and the tooltip renders from it.
        </DocsProse>
        <CodeBlock>{handleSample}</CodeBlock>
      </DocsSection>

      <DocsSection id="api" title="API">
        <DocsProse>
          <code>Tooltip</code>, <code>TooltipTrigger</code>, and{" "}
          <code>TooltipProvider</code> accept every Base UI prop.{" "}
          <code>TooltipContent</code> accepts every <code>Popup</code> prop,
          plus:
        </DocsProse>
        <DocsTable
          headers={["Prop", "Values", "Default"]}
          rows={[
            [
              <code key="p">side</code>,
              "top · right · bottom · left · inline-start · inline-end",
              <code key="d">top</code>,
            ],
            [<code key="p">align</code>, "start · center · end", <code key="d">center</code>],
            [
              <code key="p">sideOffset</code>,
              "number · function",
              <span key="d">
                <code>10</code> with the arrow, <code>6</code> without
              </span>,
            ],
            [<code key="p">alignOffset</code>, "number · function", <code key="d">0</code>],
            [<code key="p">size</code>, "sm · default · lg", <code key="d">default</code>],
            [<code key="p">showArrow</code>, "boolean", <code key="d">true</code>],
            [<code key="p">arrowPadding</code>, "number", <code key="d">8</code>],
            [
              <code key="p">collisionBoundary</code>,
              "Element · Element[] · Rect",
              <code key="d">clipping-ancestors</code>,
            ],
            [<code key="p">collisionPadding</code>, "number · object", <code key="d">5</code>],
            [<code key="p">sticky</code>, "boolean", <code key="d">false</code>],
            [<code key="p">positionMethod</code>, "absolute · fixed", <code key="d">absolute</code>],
            [<code key="p">container</code>, "HTMLElement · ShadowRoot · ref", <code key="d">body</code>],
            [<code key="p">keepMounted</code>, "boolean", <code key="d">false</code>],
          ]}
        />
        <DocsProse>
          <code>TooltipProvider</code> takes <code>delay</code> (0 here),{" "}
          <code>closeDelay</code>, and <code>timeout</code> (400ms). A
          trigger&apos;s own <code>delay</code>, <code>closeDelay</code>, and{" "}
          <code>closeOnClick</code> override the provider.{" "}
          <code>tooltipContentVariants</code> exposes the size classes, and{" "}
          <code>createTooltipHandle</code> creates a handle for detached
          triggers.
        </DocsProse>
      </DocsSection>
      <MachineSections slug="tooltip" />
    </DocsArticle>
  )
}
