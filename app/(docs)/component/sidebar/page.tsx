import type { Metadata } from "next"
import Link from "next/link"

import { SidebarResizeDemo } from "@/app/demos/sidebar-docs"
import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { MachineSections, statesToc } from "@/components/site/machine-sections"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Sidebar — Prometheus",
  description:
    "Collapsible sidebar that follows usePrometheus().isMobile and becomes a sheet on a narrow viewport. Drag the rail to resize: open to one fixed width, or learn the width you keep choosing and snap to it.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "resize", title: "Resize" },
  { id: "fixed", title: "Fixed" },
  { id: "learn", title: "Learn" },
  { id: "api", title: "API" },
  ...statesToc("sidebar"),
]

export default function SidebarPage() {
  const item = getCatalogItem("sidebar")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="resize" title="Resize">
        <DocsProse>
          Set <code>resize</code> on <code>SidebarProvider</code> and the{" "}
          <code>SidebarRail</code> on the sidebar edge becomes a drag handle. A
          click still toggles the sidebar. A drag past 3px resizes it, and width
          transitions turn off until you let go so the edge stays under the
          pointer. Drag the edge in the demo, let go, and do it again: the chart
          above the content draws every width you settled on.
        </DocsProse>
        <SidebarResizeDemo />
      </DocsSection>
      <DocsSection id="fixed" title="Fixed">
        <DocsProse>
          <code>resize=&quot;fixed&quot;</code> keeps one width. The sidebar
          slides with the pointer and stretches only slightly past its width.
          Let go past the halfway mark and it hides. Let go anywhere else and it
          settles back open. From hidden, drag the rail out to open it at the
          same width.
        </DocsProse>
      </DocsSection>

      <DocsSection id="learn" title="Learn">
        <DocsProse>
          <code>resize=&quot;learn&quot;</code> resizes freely between{" "}
          <code>minWidth</code> and <code>maxWidth</code>, and it learns the
          width you keep coming back to. Every release records the width. After
          three releases, the sidebar draws a smooth curve over those widths and
          takes the highest point as the preferred width. While you drag within
          16px of it, the edge snaps there.
        </DocsProse>
        <DocsProse>
          It is weighted for recency. Each width counts half as much after eight
          newer releases, so the preferred width follows you when your habits
          change. The weights always add up to one, so every release takes a
          share from the widths before it: settle on one width and the others
          fade. Only the last 40 releases are kept.
        </DocsProse>
        <DocsProse>
          The snap unlocks for precise resizing. Slow down inside the snap zone
          and the edge lets go of the preferred width, so you can set any nearby
          value. Move more than 24px away and the snap locks again. Hold Option
          or Alt to skip the snap entirely. Letting go below 60% of{" "}
          <code>minWidth</code> hides the sidebar without recording a width.
        </DocsProse>
        <DocsProse>
          The width and history persist in <code>localStorage</code> under{" "}
          <code>storageKey</code>. Give each resizable sidebar its own key.{" "}
          <code>useSidebar()</code> exposes <code>samples</code>,{" "}
          <code>preferredWidth</code>, and <code>resetResize</code>, and{" "}
          <code>sidebarWidthDensity</code> returns the curve so you can chart it
          the way the demo does.
        </DocsProse>
        <CodeBlock>{`<AppShell resize="learn" nav={nav}>
  {children}
</AppShell>`}</CodeBlock>
      </DocsSection>

      <DocsSection id="api" title="API">
        <DocsProse>
          Props on <code>SidebarProvider</code>. <code>AppShell</code> forwards{" "}
          <code>resize</code> and adds the rail for you.
        </DocsProse>
        <DocsTable
          headers={["Prop", "Type", "Default"]}
          rows={[
            [
              <code key="p">resize</code>,
              <code key="t">
                &quot;none&quot; | &quot;fixed&quot; | &quot;learn&quot;
              </code>,
              <code key="d">&quot;none&quot;</code>,
            ],
            [
              <code key="p">defaultWidth</code>,
              <code key="t">number</code>,
              <code key="d">240</code>,
            ],
            [
              <code key="p">minWidth</code>,
              <code key="t">number</code>,
              <code key="d">200</code>,
            ],
            [
              <code key="p">maxWidth</code>,
              <code key="t">number</code>,
              <code key="d">480</code>,
            ],
            [
              <code key="p">storageKey</code>,
              <code key="t">string</code>,
              <code key="d">&quot;sidebar_resize&quot;</code>,
            ],
          ]}
        />
      </DocsSection>

      <MachineSections slug="sidebar" />
    </DocsArticle>
  )
}
