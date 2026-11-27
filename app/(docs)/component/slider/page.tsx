import type { Metadata } from "next"

import {
  SliderCompactDemo,
  SliderDefaultDemo,
  SliderDefaultDisabledDemo,
  SliderDefaultFormatDemo,
  SliderDisabledDemo,
  SliderFormatDemo,
  SliderNonUniformDemo,
  SliderRangeDemo,
  SliderScrubberDemo,
  SliderStepsDemo,
  SliderValueDisplayDemo,
} from "@/app/demos/slider-docs"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Slider — Prometheus",
  description:
    "One slider, two ladder steps: the default step's pip/scrubber design, and the compact step's dense design with track fill, range mode, and value display.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "compact", title: "Compact" },
  { id: "range", title: "Range" },
  { id: "steps", title: "Steps" },
  { id: "non-uniform", title: "Non-uniform steps" },
  { id: "value-display", title: "Value display" },
  { id: "format", title: "Format" },
  { id: "disabled", title: "Disabled" },
  { id: "default", title: "Default" },
  { id: "scrubber", title: "Default — Scrubber" },
  { id: "default-format", title: "Default — Format" },
  { id: "default-disabled", title: "Default — Disabled" },
  { id: "api", title: "API" },
]

export default function SliderPage() {
  const item = getCatalogItem("slider")
  if (!item) return null

  return (
    <DocsArticle
      lede="One slider, two ladder steps: the default step's pip/scrubber design, and the compact step's dense design with track fill, range mode, and value display."
      title={item.title}
      toc={toc}
    >
      <DocsSection id="compact" title="Compact">
        <DocsProse>
          Dense thumb on a pill track. Value sits beside the track and is
          click-to-edit.
        </DocsProse>
        <SliderCompactDemo />
      </DocsSection>
      <DocsSection id="range" title="Range">
        <DocsProse>
          Pass a two-number array for two thumbs that cannot cross. Always
          uses the compact engine.
        </DocsProse>
        <SliderRangeDemo />
      </DocsSection>

      <DocsSection id="steps" title="Steps">
        <DocsProse>
          Uniform step with optional track dots. Masked on the filled side.
        </DocsProse>
        <SliderStepsDemo />
      </DocsSection>

      <DocsSection id="non-uniform" title="Non-uniform steps">
        <DocsProse>
          A discrete <code>steps</code> list snaps the thumb and walks on
          arrow keys.
        </DocsProse>
        <SliderNonUniformDemo />
      </DocsSection>

      <DocsSection id="value-display" title="Value display">
        <DocsProse>
          Left, right, or a tooltip that appears while interacting.
        </DocsProse>
        <SliderValueDisplayDemo />
      </DocsSection>

      <DocsSection id="format" title="Format">
        <DocsProse>
          <code>formatValue</code> shapes every label and tooltip.
        </DocsProse>
        <SliderFormatDemo />
      </DocsSection>

      <DocsSection id="disabled" title="Disabled">
        <SliderDisabledDemo />
      </DocsSection>

      <DocsSection id="default" title="Default">
        <DocsProse>
          Pip row: label and value in a bordered 32px control, one dot per
          step, springing fill.
        </DocsProse>
        <SliderDefaultDemo />
      </DocsSection>

      <DocsSection id="scrubber" title="Default — Scrubber">
        <DocsProse>
          Continuous drag across the row; fill sticks to the pointer.
        </DocsProse>
        <SliderScrubberDemo />
      </DocsSection>

      <DocsSection id="default-format" title="Default — Format">
        <SliderDefaultFormatDemo />
      </DocsSection>

      <DocsSection id="default-disabled" title="Default — Disabled">
        <SliderDefaultDisabledDemo />
      </DocsSection>

      <DocsSection id="api" title="API">
        <DocsProse>
          One component: the default step renders the pip/scrubber design, the
          compact step the dense one. Compact-only props (an array value,{" "}
          <code>steps</code>, <code>showSteps</code>, <code>showValue</code>,{" "}
          <code>valuePosition</code>, track styling) always render the compact
          design so no capability is lost.
        </DocsProse>
        <DocsTable
          headers={["Prop", "Type", "Default"]}
          rows={[
            [
              <code key="s">size</code>,
              '"default" | "compact"',
              "from SizeProvider",
            ],
            [
              <code key="v">variant</code>,
              '"pips" | "scrubber"',
              '"pips"',
            ],
            [
              <code key="val">value</code>,
              "number | [number, number]",
              "—",
            ],
            [
              <code key="oc">onChange</code>,
              "(value) => void",
              "—",
            ],
            [<code key="min">min / max / step</code>, "number", "0 / 100 / 1"],
            [
              <code key="st">steps / showSteps</code>,
              "number[] / boolean",
              "— / false",
            ],
            [
              <code key="sv">showValue / valuePosition</code>,
              'boolean / "left" | "right" | "top" | "bottom" | "tooltip"',
              'true / "left"',
            ],
            [
              <code key="fv">formatValue</code>,
              "(v: number) => string",
              "String",
            ],
            [<code key="l">label</code>, "string", "—"],
            [<code key="d">disabled</code>, "boolean", "false"],
          ]}
        />
      </DocsSection>
    </DocsArticle>
  )
}
