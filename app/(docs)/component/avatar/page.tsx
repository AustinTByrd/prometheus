import type { Metadata } from "next"

import {
  AvatarFallbacksDemo,
  AvatarPlaygroundDemo,
  AvatarShapeStatusDemo,
  AvatarSizesDemo,
  AvatarTopmostDemo,
} from "@/app/demos/avatar-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Avatar — Prometheus",
  description:
    "Image or initials avatar and a see-through AvatarStack. Every dimension derives from --avatar-size, and stacked neighbours are cut with a real CSS mask so any background shows through the gaps.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "usage", title: "Usage" },
  { id: "stack", title: "Avatar stack" },
  { id: "sizes", title: "Sizes" },
  { id: "fallbacks", title: "Fallbacks" },
  { id: "shapes-status", title: "Shapes and status" },
  { id: "topmost", title: "Topmost direction" },
  { id: "api", title: "API" },
]

const usageSample = `import { Avatar, AvatarStack } from "@/components/ui/avatar"

<Avatar src="/avatars/ada.png" name="Ada Lovelace" size="md" status="online" />

<AvatarStack max={4} label="Contributors" topmost="right">
  <Avatar src="/avatars/ada.png" name="Ada Lovelace" />
  <Avatar src="/avatars/grace.png" name="Grace Hopper" />
  <Avatar name="Alan Turing" />
  <Avatar name="Margaret Hamilton" />
  <Avatar name="Donald Knuth" />
</AvatarStack>`

export default function AvatarPage() {
  const item = getCatalogItem("avatar")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="usage" title="Usage">
        <DocsProse>
          Pass <code>src</code> and <code>name</code>. While the image loads, or
          if it fails, the avatar falls back to initials with no broken-image
          icon. Pick a preset with <code>size</code>, or set{" "}
          <code>--avatar-size</code> on any parent.
        </DocsProse>
        <CodeBlock>{usageSample}</CodeBlock>
      </DocsSection>
      <DocsSection id="stack" title="Avatar stack">
        <DocsProse>
          Overlapped avatars are cut with a CSS <code>radial-gradient</code>{" "}
          mask, not a painted ring, so whatever sits behind the stack shows
          through the gap. Change only <code>--avatar-size</code> and the
          boxes, initials, overlap, gap, and cutout all scale together. Override{" "}
          <code>--avatar-overlap</code>, <code>--avatar-gap</code>, or{" "}
          <code>--avatar-nudge</code> to tune one thing.
        </DocsProse>
        <AvatarPlaygroundDemo />
      </DocsSection>
      <DocsSection id="sizes" title="Sizes">
        <DocsProse>
          Presets <code>xs</code> to <code>xl</code> only set{" "}
          <code>--avatar-size</code>. Setting it on a parent sizes every avatar
          inside.
        </DocsProse>
        <AvatarSizesDemo />
      </DocsSection>
      <DocsSection id="fallbacks" title="Fallbacks">
        <DocsProse>
          Fallbacks resolve in order: <code>fallback</code>, initials from{" "}
          <code>name</code>, <code>icon</code>, then a default person glyph.
          Compose <code>AvatarImage</code> and <code>AvatarFallback</code> when
          you need full control.
        </DocsProse>
        <AvatarFallbacksDemo />
      </DocsSection>
      <DocsSection id="shapes-status" title="Shapes and status">
        <DocsProse>
          <code>shape=&quot;square&quot;</code> rounds the corners in proportion
          to the size. <code>status</code> adds a dot on the Data Foundations
          palette that scales with the avatar.
        </DocsProse>
        <AvatarShapeStatusDemo />
      </DocsSection>
      <DocsSection id="topmost" title="Topmost direction">
        <DocsProse>
          <code>topmost=&quot;right&quot;</code> keeps the rightmost avatar whole
          and cuts its neighbours. <code>&quot;left&quot;</code> flips both the
          cuts and the initials nudge, including the overflow count.
        </DocsProse>
        <AvatarTopmostDemo />
      </DocsSection>
      <DocsSection id="api" title="API">
        <DocsTable
          headers={["Avatar prop", "Values"]}
          rows={[
            [<code key="p">src</code>, "Image URL. Falls back on error."],
            [<code key="p">name</code>, "Accessible name and source of initials"],
            [<code key="p">fallback</code>, "Custom fallback node"],
            [<code key="p">icon</code>, "Component or element when there is no name"],
            [<code key="p">size</code>, "xs · sm · md · lg · xl"],
            [<code key="p">shape</code>, "circle · square"],
            [<code key="p">status</code>, "online · away · busy · offline"],
            [<code key="p">delayMs</code>, "Delay before the fallback renders"],
          ]}
        />
        <DocsTable
          headers={["AvatarStack prop", "Values"]}
          rows={[
            [<code key="p">topmost</code>, "right (default) · left"],
            [<code key="p">max</code>, "Shows +N for the rest"],
            [<code key="p">hover</code>, "none · lift · expand"],
            [<code key="p">label</code>, "Accessible name for the group"],
            [<code key="p">size</code>, "xs · sm · md · lg · xl"],
          ]}
        />
        <DocsTable
          headers={["CSS variable", "Default"]}
          rows={[
            [<code key="p">--avatar-size</code>, "2rem. Everything else derives from it."],
            [<code key="p">--avatar-overlap</code>, "30% of size"],
            [<code key="p">--avatar-gap</code>, "1/16 of size"],
            [<code key="p">--avatar-nudge</code>, "Shifts initials toward the visible crescent"],
          ]}
        />
      </DocsSection>
    </DocsArticle>
  )
}
