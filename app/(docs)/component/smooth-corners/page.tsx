import type { Metadata } from "next"

import {
  SmoothCornersCompareDemo,
  SmoothCornersElevatedDemo,
  SmoothCornersHookDemo,
  SmoothCornersSizesDemo,
} from "@/app/demos/smooth-corners-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Smooth Corners — Prometheus",
  description:
    "Lisse squircles aligned to Prometheus radius tokens. Elevated and overlays already use them.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "compare", title: "Why squircles" },
  { id: "presets", title: "Presets" },
  { id: "elevated", title: "Elevated" },
  { id: "hook", title: "useCornerRef" },
]

export default function SmoothCornersPage() {
  const item = getCatalogItem("smooth-corners")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="compare" title="Why squircles">
        <DocsProse>
          CSS <code>border-radius</code> is a quarter circle. Designers — and
          Apple, and Figma — prefer continuous corners that ease into the
          straight edges. Prometheus uses{" "}
          <a href="https://github.com/JaceThings/Lisse">Lisse</a> for that
          curve, with full squircle smoothing (<code>1</code>) as the default.
        </DocsProse>
        <SmoothCornersCompareDemo />
      </DocsSection>
      <DocsSection id="presets" title="Presets">
        <DocsProse>
          <code>CORNERS</code> matches the theme radius ladder (
          <code>--radius</code> = 0.75rem → <code>lg</code> = 12px). Every
          preset is a Lisse squircle at smoothing <code>1</code>.
        </DocsProse>
        <SmoothCornersSizesDemo />
        <CodeBlock>{`import { CORNERS, OVERLAY_CORNERS } from "@/lib/smooth-corners"

CORNERS.xs   // 6
CORNERS.sm   // 8
CORNERS.md   // 10
CORNERS.lg   // 12  — menus
CORNERS.xl   // 14  — dialogs / panels
CORNERS["2xl"] // 18

OVERLAY_CORNERS.menu    // lg
OVERLAY_CORNERS.tooltip // sm
OVERLAY_CORNERS.dialog  // xl
OVERLAY_CORNERS.panel   // xl`}</CodeBlock>
      </DocsSection>

      <DocsSection id="elevated" title="Elevated">
        <DocsProse>
          <code>Elevated</code> applies panel corners by default. Pass a preset
          key or a full Lisse options object.
        </DocsProse>
        <SmoothCornersElevatedDemo />
        <CodeBlock>{`<Elevated offset={2} shadowLevel={3}>
  Menu
</Elevated>

<Elevated offset={4} corners="lg">
  Tighter panel
</Elevated>

<Elevated offset={4} corners={{ radius: 24 }}>
  Custom radius (still squircle / smoothing 1)
</Elevated>`}</CodeBlock>
      </DocsSection>

      <DocsSection id="hook" title="useCornerRef">
        <DocsProse>
          Prefer the hook for Base UI popups and any element that must stay the
          direct layout or focus target. Dialog, select, drawer, sheet, and
          tooltip popups already do this. Interactive controls use CSS{" "}
          <code>rounded-*</code> instead.
        </DocsProse>
        <SmoothCornersHookDemo />
        <CodeBlock>{`const ref = useCornerRef("xl")

return <div ref={ref} className="bg-surface-3 shadow-surface-4">…</div>`}</CodeBlock>
        <DocsProse>
          Edge-docked panels use <code>edgeCorners(side)</code> so only the free
          edge is rounded. Pill buttons, Switch, Radio circles, and Slider
          thumbs stay CSS <code>rounded-full</code>.
        </DocsProse>
        <CodeBlock>{`const ref = useCornerRef(edgeCorners("right"))`}</CodeBlock>
      </DocsSection>
    </DocsArticle>
  )
}