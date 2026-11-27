import type { Metadata } from "next"
import Link from "next/link"

import {
  FoundationsAccentBoundaries,
  FoundationsBackgrounds,
  FoundationsBreakpoints,
  FoundationsControlSizes,
  FoundationsDropCap,
  FoundationsFocus,
  FoundationsForegrounds,
  FoundationsProse,
  FoundationsRadius,
  FoundationsSpacing,
  FoundationsTypeRamp,
} from "@/app/demos/foundations-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsSubsection,
} from "@/components/site/docs-article"

export const metadata: Metadata = {
  title: "Foundations — Prometheus",
  description:
    "Color, typography, breakpoints, spacing, and shape for Prometheus.",
}

const toc = [
  { id: "overview", title: "Overview" },
  {
    id: "color",
    title: "Color",
    items: [
      { id: "foreground", title: "Foreground" },
      { id: "accent", title: "Accent and boundaries" },
    ],
  },
  {
    id: "typography",
    title: "Typography",
    items: [
      { id: "prose", title: "Prose" },
      { id: "drop-cap", title: "Drop cap" },
    ],
  },
  { id: "breakpoints", title: "Breakpoints" },
  {
    id: "space",
    title: "Space and shape",
    items: [
      { id: "spacing", title: "Spacing" },
      { id: "controls", title: "Control sizes" },
      { id: "radius", title: "Radius" },
      { id: "focus", title: "Focus" },
    ],
  },
]

export default function FoundationsPage() {
  return (
    <DocsArticle
      lede="Color, typography, breakpoints, spacing, and shape."
      title="Foundations"
      toc={toc}
    >
      <DocsSection id="color" title="Color">
        <DocsProse>
          Use semantic utilities for their role. <code>text-foreground</code>{" "}
          marks important text; <code>bg-primary</code> is the umber accent fill
          — not a page surface. Prefer token classes over raw colors. Light and
          dark swap the same names. Nested panels use the{" "}
          <Link href="/component/elevated">surface ladder</Link>.
        </DocsProse>
        <FoundationsBackgrounds />
        <div className="flex flex-col gap-10">
          <DocsSubsection id="foreground" title="Foreground">
            <FoundationsForegrounds />
          </DocsSubsection>

          <DocsSubsection id="accent" title="Accent and boundaries">
            <FoundationsAccentBoundaries />
            <DocsProse>
              Umber <code>--primary</code> is the fixed accent.{" "}
              <code>--ring</code> follows it for focus. <code>--border</code>{" "}
              and <code>--input</code> are subtle divisions. Use neutral fills
              for ordinary actions; reserve primary for emphasis.
            </DocsProse>
          </DocsSubsection>
        </div>
      </DocsSection>

      <DocsSection id="typography" title="Typography">
        <DocsProse>
          Geist for UI and body. Geist Serif, through <code>font-display</code>,
          for titles from <code>text-xl</code> up. The ramp runs from{" "}
          <code>text-xs</code> to <code>text-5xl</code>. Each step sets size,
          line-height, and tracking together. Product UI usually lives on{" "}
          <code>text-sm</code> and <code>text-xs</code>. <code>base</code>{" "}
          installs this as <code>typography</code>.
        </DocsProse>
        <FoundationsTypeRamp />
        <DocsProse>
          The numbers are size and line-height in pixels. Small type opens
          slightly; display type tightens. The tracking is already on the step.
          Body steps come in two weights: regular (400) for reading, and{" "}
          <code>font-medium</code> (500) for labels and emphasis. Display steps
          keep the heading font's weight.
        </DocsProse>

        <DocsSubsection id="prose" title="Prose">
          <DocsProse>
            Long-form copy uses <code>prose</code>. It sets a 65-character
            measure, the base step, and Geist Serif titles. Paragraphs, lists,
            links, and emphasis come with it.
          </DocsProse>
          <FoundationsProse />
        </DocsSubsection>

        <DocsSubsection id="drop-cap" title="Drop cap">
          <DocsProse>
            Put <code>drop-cap</code> on a paragraph, or on a{" "}
            <code>prose</code> root so the first paragraph’s opening letter
            sinks in the display face. Height is at least two lines; use{" "}
            <code>drop-cap-3</code> or <code>drop-cap-4</code>, or set{" "}
            <code>--drop-cap-lines</code> (floored at 2). Ships with{" "}
            <code>typography</code>.
          </DocsProse>
          <FoundationsDropCap />
          <CodeBlock>{`<p className="drop-cap">Two lines (default)…</p>
<p className="drop-cap-3">Three lines…</p>
<p className="drop-cap" style={{ "--drop-cap-lines": 5 } as React.CSSProperties}>
  Custom height…
</p>`}</CodeBlock>
        </DocsSubsection>
      </DocsSection>

      <DocsSection id="breakpoints" title="Breakpoints">
        <DocsProse>
          Four widths, shared by the theme (<code>sm:</code>, <code>md:</code>,{" "}
          <code>lg:</code>, <code>xl:</code>) and by <code>breakpoints</code> in{" "}
          <code>@/lib/breakpoints</code>. <code>base</code> installs them. Below{" "}
          <code>breakpoints.md</code>, <code>usePrometheus().isMobile</code> is
          true and the sidebar becomes a sheet.
        </DocsProse>
        <FoundationsBreakpoints />
      </DocsSection>

      <DocsSection id="space" title="Space and shape">
        <div className="flex flex-col gap-10">
          <DocsSubsection id="spacing" title="Spacing">
            <DocsProse>
              Match the nearest layout, then use the 4px rhythm: 4, 8, 12, 16,
              24, 32. Use <code>gap-*</code> in flex stacks, not{" "}
              <code>space-y-*</code>. Use <code>size-*</code> when width and
              height are the same.
            </DocsProse>
            <FoundationsSpacing />
          </DocsSubsection>

          <DocsSubsection id="controls" title="Control sizes">
            <DocsProse>
              Adjacent controls share a height. sm is 28px, default 32px, lg
              36px.
            </DocsProse>
            <FoundationsControlSizes />
          </DocsSubsection>

          <DocsSubsection id="radius" title="Radius">
            <DocsProse>
              <code>--radius</code> is 0.75rem, so <code>rounded-lg</code> is
              12px. Radius follows height: <code>rounded-xs</code> for 24 and
              28px controls, <code>rounded-sm</code> for 32 and 36px controls
              and rows, <code>rounded-md</code> at 44px, and{" "}
              <code>rounded-lg</code> or <code>rounded-xl</code> for cards. CSS
              radius is the fallback for controls. Panels and overlays use Lisse
              squircles — see{" "}
              <Link href="/component/smooth-corners">Smooth Corners</Link> for
              presets (<code>lg</code> menus, <code>xl</code> dialogs).
            </DocsProse>
            <FoundationsRadius />
          </DocsSubsection>

          <DocsSubsection id="focus" title="Focus">
            <DocsProse>
              Keep the shared keyboard outline: a ring token at{" "}
              <code>ring-3 ring-ring/50</code> with <code>border-ring</code>.
              Nested panels use <code>shadow-surface-*</code> rather than a
              separate control shadow.
            </DocsProse>
            <FoundationsFocus />
            <CodeBlock>{`focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`}</CodeBlock>
          </DocsSubsection>
        </div>
      </DocsSection>
    </DocsArticle>
  )
}
