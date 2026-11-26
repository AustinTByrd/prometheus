import type { Metadata } from "next"

import { TypographyScalePreview } from "@/app/demos/typography-scale-preview"
import { CommandBlock } from "@/components/site/command-block"
import {
  formatRatio,
  formatTracking,
  formatTypeScaleCss,
  getLineHeightRatio,
  PROMETHEUS_TYPE_SCALE,
} from "@/lib/type-scale"

export const metadata: Metadata = {
  title: "Typography — Prometheus",
  description:
    "Prometheus typography scale with proportional line-height ratio and letter-spacing curves from 12px to 64px.",
}

const componentUsageSnippet = `import { TypeScaleDoc } from "@/components/typography/type-scale-doc"
import { PROMETHEUS_TYPE_SCALE } from "@/lib/type-scale"

export function TypographySection() {
  return <TypeScaleDoc scale={PROMETHEUS_TYPE_SCALE} />
}`

export default function TypographyPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-4 py-12 sm:py-16">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-primary">Foundations</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Typography scale
        </h1>
        <p className="max-w-2xl text-muted-foreground text-pretty">
          Nine steps from 12px to 64px in Geist Sans. Line-height ratios peak in
          body copy for comfortable reading and compress toward 1.00 at display
          sizes, while tracking opens slightly at 12px and tightens progressively
          as size grows.
        </p>
      </div>

      <TypographyScalePreview />

      <section className="flex flex-col gap-4" id="scale-tokens">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">
            Scale reference
          </h2>
          <p className="text-sm text-muted-foreground">
            Single source of truth defined in{" "}
            <code className="font-mono text-foreground">lib/type-scale.ts</code>{" "}
            and exposed as CSS custom properties in{" "}
            <code className="font-mono text-foreground">app/globals.css</code>.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium" scope="col">
                  Group
                </th>
                <th className="px-4 py-3 font-medium" scope="col">
                  Size
                </th>
                <th className="px-4 py-3 font-medium" scope="col">
                  Line height
                </th>
                <th className="px-4 py-3 font-medium" scope="col">
                  Ratio
                </th>
                <th className="px-4 py-3 font-medium" scope="col">
                  Letter spacing
                </th>
                <th className="px-4 py-3 font-medium" scope="col">
                  Token prefix
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70 tabular-nums">
              {PROMETHEUS_TYPE_SCALE.map((step) => (
                <tr
                  className="transition-colors hover:bg-muted/40"
                  key={step.size}
                >
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {step.group}
                  </td>
                  <td className="px-4 py-2.5 font-medium">{step.size}px</td>
                  <td className="px-4 py-2.5">{step.lineHeight}px</td>
                  <td className="px-4 py-2.5 font-medium">
                    {formatRatio(getLineHeightRatio(step))}
                  </td>
                  <td className="px-4 py-2.5 font-medium">
                    {formatTracking(step.tracking, true)}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                    --{step.token}-*
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2" id="usage">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold tracking-tight">CSS tokens</h2>
          <CommandBlock code={formatTypeScaleCss()} />
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold tracking-tight">
            Component API
          </h2>
          <CommandBlock code={componentUsageSnippet} />
          <p className="text-xs text-muted-foreground">
            Compose{" "}
            <code className="font-mono text-foreground">TypeScaleChart</code>{" "}
            and{" "}
            <code className="font-mono text-foreground">TypeScaleSpecimen</code>{" "}
            directly for custom layouts, or pass{" "}
            <code className="font-mono text-foreground">scale</code> and{" "}
            <code className="font-mono text-foreground">sampleOverride</code> to{" "}
            <code className="font-mono text-foreground">TypeScaleDoc</code>.
          </p>
        </div>
      </section>
    </main>
  )
}
