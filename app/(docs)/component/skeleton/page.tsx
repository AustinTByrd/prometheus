import type { Metadata } from "next"
import Link from "next/link"

import {
  SkeletonAnimationDemo,
  SkeletonDataDemo,
  SkeletonRevealDemo,
  SkeletonRevealModeDemo,
  SkeletonTextDemo,
} from "@/app/demos/skeleton-docs"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { MachineSections, statesToc } from "@/components/site/machine-sections"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Skeleton — Prometheus",
  description:
    "Skullet skeletons in Prometheus tokens. Wrap the loaded view; the skeleton is measured from it, so nothing moves when the data lands.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "reveal", title: "Reveal" },
  { id: "data", title: "Data and samples" },
  { id: "reveal-mode", title: "Reveal mode" },
  { id: "animation", title: "Animation" },
  { id: "text", title: "Text lines" },
  { id: "tokens", title: "Tokens" },
  { id: "api", title: "API" },
]

export default function SkeletonPage() {
  const item = getCatalogItem("skeleton")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={[...toc, ...statesToc("skeleton")]}>
      <DocsSection id="reveal" title="Reveal">
        <DocsProse>
          Wrap the view you render once the data arrives and drive{" "}
          <code>loading</code>. While it loads, Skeleton lays that view out
          unseen and draws a bar for every line of text and a block for every
          image and control. The skeleton takes exactly the space the content
          will, so the reveal moves nothing.
        </DocsProse>
        <SkeletonRevealDemo />
      </DocsSection>
      <DocsSection id="data" title="Data and samples">
        <DocsProse>
          Pass <code>data</code> and render from it. It is loading while{" "}
          <code>data</code> is null, and <code>sample</code> stands in to draw
          the first skeleton. A skeleton is held back 150ms, so a fast load
          shows the content straight away with no flash.
        </DocsProse>
        <SkeletonDataDemo />
      </DocsSection>

      <DocsSection id="reveal-mode" title="Reveal mode">
        <DocsProse>
          <code>SkulletProvider</code> sets how content replaces its skeleton.{" "}
          <code>smart</code>, the default, picks per reveal: at once for a fast
          load or mid-gesture, whole for something small, otherwise in
          sequence, top to bottom.
        </DocsProse>
        <SkeletonRevealModeDemo />
      </DocsSection>

      <DocsSection id="animation" title="Animation">
        <DocsProse>
          <code>shimmer</code> sweeps one highlight across the page.{" "}
          <code>group-shimmer</code> sweeps each skeleton on its own.{" "}
          <code>pulse</code> fades. All of them hold still under reduced motion.
        </DocsProse>
        <SkeletonAnimationDemo />
      </DocsSection>

      <DocsSection id="text" title="Text lines">
        <DocsProse>
          Each line of text gets a bar between two of the font&apos;s own
          lines. The default runs ascender to descender. x-height to baseline
          draws a tighter bar for dense type.
        </DocsProse>
        <SkeletonTextDemo />
      </DocsSection>

      <DocsSection id="tokens" title="Tokens">
        <DocsProse>
          Skullet reads custom properties, so the skeleton follows the theme
          and dark mode with no provider. Any section can set its own.
        </DocsProse>
        <DocsTable
          headers={["Property", "Prometheus value"]}
          rows={[
            [<code key="p">--skullet-base</code>, <code key="v">var(--muted)</code>],
            [
              <code key="p">--skullet-highlight</code>,
              "background at 70% in light, foreground at 8% in dark",
            ],
            [<code key="p">--skullet-radius</code>, <code key="v">var(--radius-sm)</code>],
            [<code key="p">--skullet-animation</code>, <code key="v">shimmer</code>],
          ]}
        />
      </DocsSection>

      <DocsSection id="api" title="API">
        <DocsTable
          headers={["Prop", "Type", "Description"]}
          rows={[
            [<code key="p">loading</code>, "boolean", "Shows the skeleton, even over data, as for a refetch."],
            [<code key="p">data</code>, "T | null", "Loading while null. Passed to children once set."],
            [<code key="p">sample</code>, "T", "Draws the first skeleton before any data has loaded."],
            [<code key="p">id</code>, "string", "Remembers the shape across visits under this key."],
            [<code key="p">label</code>, "string", "Read to screen readers while loading."],
            [<code key="p">error</code>, "ReactNode", "Shown in place of the content. Pass an ErrorState."],
            [<code key="p">empty</code>, "boolean", "Shows emptyMessage instead of the content."],
            [<code key="p">emptyMessage</code>, "ReactNode", "Pass an Empty."],
            [<code key="p">onReveal</code>, "() => void", "Called once content lands over a skeleton."],
          ]}
        />
        <DocsProse>
          <code>SkeletonBox</code> draws one block with <code>width</code>,{" "}
          <code>height</code>, and <code>radius</code>, for shapes with no
          content to measure. <code>SkeletonSuspense</code> is a Suspense
          boundary with a measured fallback. Add <code>skullet-block</code> to
          draw an element as one block, or <code>skullet-ignore</code> to skip
          it. A submitting button uses Spinner and stays disabled.
        </DocsProse>
      </DocsSection>
      <MachineSections slug="skeleton" />
    </DocsArticle>
  )
}
