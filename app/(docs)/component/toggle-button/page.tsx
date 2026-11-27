import type { Metadata } from "next"
import Link from "next/link"

import {
  ToggleButtonGroupDemo,
  ToggleButtonSizeDemo,
  ToggleButtonStateDemo,
} from "@/app/demos/toggle-button-docs"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Toggle button — Prometheus",
  description:
    "Base UI toggle on the default Button: raised when off, flat on a muted fill when selected. Control-height sizes, inline icons, and a group for single or multiple selection.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "state", title: "Selected state" },
  { id: "size", title: "Size" },
  { id: "group", title: "Group" },
  { id: "api", title: "API" },
]

export default function ToggleButtonPage() {
  const item = getCatalogItem("toggle-button")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="state" title="Selected state">
        <DocsProse>
          Off, it is the default Button: a surface one short shadow above the
          page, with its label in the muted color. Pressing it dips to 95%,
          a little past where it lands, and releasing settles it at 97%, where
          it stays selected. Pressing it again dips back to 95%, and releasing
          lets it back up to full size. The lift and drop shadow give way to a muted fill
          with only its hairline edge, and the label turns to the foreground
          color. Depth and
          label contrast change together, so the state reads without relying
          on color. Base UI sets <code>aria-pressed</code> for assistive tech and{" "}
          <code>data-pressed</code> for styling.
        </DocsProse>
        <ToggleButtonStateDemo />
      </DocsSection>
      <DocsSection id="size" title="Size">
        <DocsProse>
          Sizes match Button&apos;s, so a toggle lines up with buttons and
          inputs of the same size. Mark icons with <code>data-icon</code> to
          trim padding on that side. Icon-only toggles need an{" "}
          <code>aria-label</code>, which should name the setting rather than
          its state, since <code>aria-pressed</code> already says whether it is
          on.
        </DocsProse>
        <ToggleButtonSizeDemo />
      </DocsSection>

      <DocsSection id="group" title="Group">
        <DocsProse>
          <code>ToggleButtonGroup</code> wraps related toggles with arrow key
          navigation between them. By default one can be selected at a time,
          and pressing the selected one again clears it. Pass{" "}
          <code>multiple</code> for independent settings, like text styles.
        </DocsProse>
        <ToggleButtonGroupDemo />
      </DocsSection>

      <DocsSection id="api" title="API">
        <DocsProse>
          <code>ToggleButton</code> accepts every Base UI <code>Toggle</code>{" "}
          prop, including <code>pressed</code>, <code>defaultPressed</code>,{" "}
          <code>onPressedChange</code>, and <code>value</code> inside a group,
          plus:
        </DocsProse>
        <DocsTable
          headers={["Prop", "Values", "Default"]}
          rows={[
            [
              <code key="p">size</code>,
              "xs · sm · default · lg · icon-xs · icon-sm · icon · icon-lg",
              <code key="d">default</code>,
            ],
          ]}
        />
        <DocsProse>
          <code>ToggleButtonGroup</code> accepts every Base UI{" "}
          <code>ToggleGroup</code> prop: <code>value</code>,{" "}
          <code>defaultValue</code>, <code>onValueChange</code>,{" "}
          <code>multiple</code>, and <code>orientation</code>.
        </DocsProse>
      </DocsSection>
    </DocsArticle>
  )
}
