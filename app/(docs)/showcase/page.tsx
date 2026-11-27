import type { Metadata } from "next"

import { ShowcaseBento } from "@/app/demos/showcase-docs"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
} from "@/components/site/docs-article"

export const metadata: Metadata = {
  title: "Showcase — Prometheus",
  description:
    "A gallery of Prometheus components in short, interactive compositions.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "gallery", title: "Gallery" },
]

export default function ShowcasePage() {
  return (
    <DocsArticle
      lede="Short interactive compositions — open any card to read the full docs."
      title="Showcase"
      toc={toc}
      wide
    >
      <DocsSection id="gallery" title="Gallery">
        <DocsProse>
          Each tile is a live example. Use them to feel density, motion, and
          hierarchy before dropping into a component page.
        </DocsProse>
        <ShowcaseBento />
      </DocsSection>
    </DocsArticle>
  )
}
