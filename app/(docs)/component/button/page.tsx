import type { Metadata } from "next"
import Link from "next/link"

import {
  ButtonIconDemo,
  ButtonLinkDemo,
  ButtonPillDemo,
  ButtonSizeDemo,
  ButtonStateDemo,
  ButtonVariantDemo,
} from "@/app/demos/button-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Button — Prometheus",
  description:
    "Base UI button on Prometheus tokens: an elevated default plus five fallback variants, control-height sizes, inline icons, and the shared focus ring.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "variant", title: "Variant" },
  { id: "size", title: "Size" },
  { id: "pill", title: "Pill" },
  { id: "icon", title: "Icon" },
  { id: "state", title: "State" },
  { id: "link", title: "Buttons and links" },
  { id: "api", title: "API" },
]

export default function ButtonPage() {
  const item = getCatalogItem("button")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="variant" title="Variant">
        <DocsProse>
          Reach for Default first. It is a white surface one short shadow above
          the page, and most actions belong in it. The other variants are
          fallbacks for the hierarchy: Primary is a dark brown gradient for the
          one action a view is about, brightening a touch on hover and dimming
          as it presses in. Outlined draws a border with no fill for actions
          beside a Default, and ghost carries quiet actions in toolbars and
          rows. Destructive is only for actions that remove something. Link
          points outside the app.
        </DocsProse>
        <ButtonVariantDemo />
      </DocsSection>
      <DocsSection id="size" title="Size">
        <DocsProse>
          Heights follow the{" "}
          <Link href="/foundations#controls">control sizes</Link>, so a button
          lines up with an input of the same size. Each size has a square icon
          counterpart. Keep adjacent controls on the same size.
        </DocsProse>
        <ButtonSizeDemo />
      </DocsSection>

      <DocsSection id="pill" title="Pill">
        <DocsProse>
          <code>pill</code> rounds any variant and size fully. Text buttons gain
          a little padding on each side, so the label sits clear of the curve
          instead of crowding it. Icon-only sizes become circles.
        </DocsProse>
        <ButtonPillDemo />
      </DocsSection>

      <DocsSection id="icon" title="Icon">
        <DocsProse>
          Mark an icon with <code>data-icon=&quot;inline-start&quot;</code> or{" "}
          <code>&quot;inline-end&quot;</code> and the button trims its padding
          on that side to keep the label optically centered. Icon-only buttons
          need an <code>aria-label</code>. Icons come from Heroicons&apos; 16px
          solid set, <code>@heroicons/react/16/solid</code>, which is drawn for
          control sizes.
        </DocsProse>
        <ButtonIconDemo />
      </DocsSection>

      <DocsSection id="state" title="State">
        <DocsProse>
          Disabled buttons fade to half opacity and stop taking pointer events.
          For pending work, disable the button and swap in a{" "}
          <code>Spinner</code> as the start icon so the width barely moves.
        </DocsProse>
        <DocsProse>
          When the content changes, whether the text, an icon, or a loading
          state, the old content slides down, fades, and blurs out while the new
          content drops in from above, and the width eases to fit. The swap
          takes 220ms on <code>cubic-bezier(0.23, 1, 0.32, 1)</code>, after{" "}
          <a href="https://microinteractions.dev/text-swap/">
            microinteractions.dev&apos;s text swap
          </a>
          . Under reduced motion the content crossfades in 150ms without
          sliding, blurring, or resizing. Nothing animates on first render.
        </DocsProse>
        <ButtonStateDemo />
      </DocsSection>

      <DocsSection id="link" title="Buttons and links">
        <DocsProse>
          Buttons route within the app: they take an action or move to another
          screen of the same product. Links leave it. The <code>link</code>{" "}
          variant is for external destinations, opens in a new tab, and ends
          with an arrow so the exit reads before the click.
        </DocsProse>
        <DocsProse>
          For an internal route, render a Next <code>Link</code> through{" "}
          <code>Button</code> with <code>nativeButton=&#123;false&#125;</code>{" "}
          so it keeps the elevated default surface, link semantics, and
          prefetching. Reach for <code>buttonVariants</code> only when you are
          styling something that is not a <code>Button</code>.
        </DocsProse>
        <ButtonLinkDemo />
        <CodeBlock>{`<Button nativeButton={false} render={<Link href="/foundations" />}>
  Read the foundations
  <ArrowRightIcon data-icon="inline-end" />
</Button>
<Button
  nativeButton={false}
  render={<a href="https://base-ui.com" rel="noreferrer" target="_blank" />}
  variant="link"
>
  Base UI docs
  <ArrowUpRightIcon data-icon="inline-end" />
</Button>`}</CodeBlock>
      </DocsSection>

      <DocsSection id="api" title="API">
        <DocsProse>
          Accepts every Base UI <code>Button</code> prop, plus:
        </DocsProse>
        <DocsTable
          headers={["Prop", "Values", "Default"]}
          rows={[
            [
              <code key="p">variant</code>,
              "default · primary · outlined · ghost · destructive · link",
              <code key="d">default</code>,
            ],
            [
              <code key="p">size</code>,
              "xs · sm · default · lg · icon-xs · icon-sm · icon · icon-lg",
              <code key="d">default</code>,
            ],
            [<code key="p">pill</code>, "boolean", <code key="d">false</code>],
          ]}
        />
        <DocsProse>
          Prefer <code>render</code> with <code>nativeButton=&#123;false&#125;</code>{" "}
          when the control should be a link. <code>buttonVariants</code> takes
          the same <code>variant</code>, <code>size</code>, and{" "}
          <code>pill</code> for one-off styling, but the default elevated
          surface only lands when you go through <code>Button</code>.
        </DocsProse>
      </DocsSection>
    </DocsArticle>
  )
}
