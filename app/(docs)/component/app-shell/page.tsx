import type { Metadata } from "next"
import Link from "next/link"

import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
} from "@/components/site/docs-article"
import { MachineSections, statesToc } from "@/components/site/machine-sections"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "App Shell — Prometheus",
  description:
    "Sidebar, top bar, scrolling main, and a one-row footer. App screens start here.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "frame", title: "Frame" },
  { id: "placement", title: "Placement" },
]

const sample = `import { AppShell } from "@/components/ui/app-shell"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      brand={<span className="px-2 text-sm font-medium">Northwind</span>}
      title="Orders"
      footer="Northwind"
      nav={/* SidebarMenu */}
    >
      {children}
    </AppShell>
  )
}`

export default function AppShellPage() {
  const item = getCatalogItem("app-shell")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={[...toc, ...statesToc("app-shell")]}>
      <DocsSection id="frame" title="Frame">
        <DocsProse>
          Collapsible sidebar, top bar with the sidebar trigger, a scrolling
          main, and a one-row footer. Below <code>breakpoints.md</code> the
          sidebar becomes a sheet. Pass navigation through <code>nav</code>.
          Set <code>resize</code> to make the sidebar edge draggable; the
          frame below uses <code>resize=&quot;learn&quot;</code>, described on{" "}
          <Link href="/component/sidebar#resize">Sidebar</Link>.
        </DocsProse>
        <div className="overflow-x-auto rounded-xl border border-border">
          <iframe
            className="h-[36rem] w-[960px] max-w-none bg-background"
            src="/preview/app-shell"
            title="App shell"
          />
        </div>
      </DocsSection>
      <DocsSection id="placement" title="Placement">
        <DocsProse>
          Put <code>AppShell</code> on an app route layout. Leave the root
          layout to fonts and <code>PrometheusProvider</code>. Skip the shell
          only for a single-task or marketing screen.
        </DocsProse>
        <CodeBlock>{sample}</CodeBlock>
        <DocsProse>
          The live frame above is also at{" "}
          <Link href="/preview/app-shell">/preview/app-shell</Link>.
        </DocsProse>
      </DocsSection>
      <MachineSections slug="app-shell" />
    </DocsArticle>
  )
}
