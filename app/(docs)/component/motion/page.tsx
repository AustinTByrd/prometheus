import type { Metadata } from "next"
import Link from "next/link"

import { MotionDurationDemo } from "@/app/demos/motion-docs"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"
import { ease, spring } from "@/lib/motion"

export const metadata: Metadata = {
  title: "Motion — Prometheus",
  description:
    "Shared durations, easing, and the height spring. Import these instead of inventing a second curve.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "duration", title: "Duration" },
  { id: "easing", title: "Easing" },
  { id: "springs", title: "Springs" },
  { id: "reduced", title: "Reduced motion" },
]

export default function MotionPage() {
  const item = getCatalogItem("motion")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="duration" title="Duration">
        <DocsProse>
          Durations live in <code>@/lib/motion</code>. The same names are CSS
          variables, such as <code>var(--duration-fast)</code>.
        </DocsProse>
        <MotionDurationDemo />
      </DocsSection>
      <DocsSection id="easing" title="Easing">
        <DocsProse>
          Easing lives in <code>@/lib/motion</code>. The same names are CSS
          variables, such as <code>var(--ease-enter)</code>.
        </DocsProse>
        <DocsTable
          headers={["Token", "Values", "Use it for"]}
          rows={[
            [
              <code key="enter">ease.enter</code>,
              <code key="enter-v">{ease.enter}</code>,
              "Elements arriving on screen.",
            ],
            [
              <code key="standard">ease.standard</code>,
              <code key="standard-v">{ease.standard}</code>,
              "Default for color, opacity, and small fades.",
            ],
            [
              <code key="exit">ease.exit</code>,
              <code key="exit-v">{ease.exit}</code>,
              "Elements leaving. Accelerates away.",
            ],
          ]}
        />
      </DocsSection>

      <DocsSection id="springs" title="Springs">
        <DocsProse>
          Springs live in <code>@/lib/motion</code> and install with Motion.{" "}
          <code>springHeight</code> runs <code>spring.smooth</code> and returns
          the height to auto when it settles.
        </DocsProse>
        <DocsTable
          headers={["Preset", "Values", "Use it for"]}
          rows={[
            [
              <code key="smooth">spring.smooth</code>,
              <span key="smooth-v">
                visualDuration: {spring.smooth.visualDuration}, bounce:{" "}
                {spring.smooth.bounce}
              </span>,
              "Panels, height changes, and layout shifts. Never overshoots.",
            ],
          ]}
        />
      </DocsSection>

      <DocsSection id="reduced" title="Reduced motion">
        <DocsProse>
          <code>prefersReducedMotion()</code> reads the system setting. Keep
          the end state. Drop travel and the height spring, and fade over{" "}
          <code>duration.instant</code>.
        </DocsProse>
      </DocsSection>
    </DocsArticle>
  )
}
