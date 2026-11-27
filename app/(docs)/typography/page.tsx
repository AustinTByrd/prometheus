import type { Metadata } from "next"
import Link from "next/link"

import { TypeScalePlayground } from "@/app/demos/typography-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import {
  formatRatio,
  formatTracking,
  formatTypeScaleCss,
  getLineHeightRatio,
  TYPE_SCALE,
} from "@/components/site/typography/type-scale-data"

export const metadata: Metadata = {
  title: "Typography — Prometheus",
  description:
    "The type ramp as curves: line-height ratio and letter spacing across nine steps, beside live specimens set at their exact size, leading, and tracking.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "scale", title: "Scale" },
  { id: "reference", title: "Reference" },
  { id: "fonts", title: "Fonts" },
  { id: "tokens", title: "Tokens" },
]

const first = TYPE_SCALE[0]
const last = TYPE_SCALE[TYPE_SCALE.length - 1]

export default function TypographyPage() {
  return (
    <DocsArticle
      lede={`Nine steps from ${first.size}px to ${last.size}px. Line height is loosest in body copy and tightens toward display sizes, while tracking opens slightly at the smallest step and closes as the size grows.`}
      title="Typography"
      toc={toc}
    >
      <DocsSection id="scale" title="Scale">
        <DocsProse>
          Each row is set at its real size, line height, and tracking, and the
          band behind it is exactly one line tall. Hover a row or a point to
          link them. Type your own sample to see every step with your text. The
          ramp lives in <Link href="/foundations#typography">Foundations</Link>;
          this page shows its shape.
        </DocsProse>
        <TypeScalePlayground />
      </DocsSection>
      <DocsSection id="reference" title="Reference">
        <DocsTable
          headers={["Step", "Size / line height", "Ratio", "Tracking", "Role"]}
          rows={TYPE_SCALE.map((step) => [
            <code key="s">{step.className}</code>,
            `${step.size}px / ${step.lineHeight}px`,
            formatRatio(getLineHeightRatio(step)),
            formatTracking(step.tracking, true),
            step.role,
          ])}
        />
      </DocsSection>
      <DocsSection id="fonts" title="Fonts">
        <DocsProse>
          Steps from <code>text-xl</code> up are display steps. They are set in
          the heading font through <code>font-display</code>, Geist Serif by
          default, and follow the Heading font setting. The smaller steps
          inherit the body font, so the specimens above change with the site,
          not with this page. Body text comes in two weights: regular (400) for
          reading and medium (500) for labels and emphasis. Use the Weight
          option above to compare them.
        </DocsProse>
      </DocsSection>
      <DocsSection id="tokens" title="Tokens">
        <DocsProse>
          The chart reads the same ramp that defines these theme variables, so
          the two cannot drift. They ship with the{" "}
          <code>typography</code> item.
        </DocsProse>
        <CodeBlock>{formatTypeScaleCss()}</CodeBlock>
      </DocsSection>
    </DocsArticle>
  )
}
