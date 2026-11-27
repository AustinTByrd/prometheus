import type { Metadata } from "next"

import {
  SurfacesElevatedDemo,
  SurfacesInviteDemo,
  SurfacesLevelsDemo,
  SurfacesProblemDemo,
  SurfacesSubstrateDemo,
  SurfacesTokensDemo,
} from "@/app/demos/surfaces-docs"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsSubsection,
} from "@/components/site/docs-article"
import { getCatalogItem } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Surfaces — Prometheus",
  description:
    "Eight nested surface levels. Overlays read their substrate and lift so dialogs and menus stay visible in light and dark mode.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "problem", title: "The problem" },
  { id: "solution", title: "The solution" },
  { id: "tokens", title: "Tokens" },
  { id: "substrate", title: "Substrate" },
  { id: "elevated", title: "Elevated" },
  { id: "levels", title: "Move through levels" },
  { id: "examples", title: "Examples" },
  { id: "invite-dialog", title: "Invite dialog" },
]

export default function SurfacesPage() {
  const item = getCatalogItem("elevated")
  if (!item) return null

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <DocsSection id="problem" title="The problem">
        <DocsProse>
          Light mode uses shadow behind white surfaces to show elevation. Dark
          mode uses progressively lighter backgrounds instead.
        </DocsProse>
        <DocsProse>
          Traditional components ship a fixed background. A dropdown often lands
          on the same color as the dialog it sits in. That makes your interface
          look like this:
        </DocsProse>
        <SurfacesProblemDemo />
      </DocsSection>
      <DocsSection id="solution" title="The solution">
        <DocsProse>
          Three pieces: tokens, substrate context, and the primitive.
        </DocsProse>

        <div className="flex flex-col gap-10">
          <DocsSubsection id="tokens" title="Tokens">
            <DocsProse>
              Eight bg/shadow pairs. Light mode flattens to white after step 2
              (shadow alone carries elevation). Dark mode keeps adding lighter
              fills plus a layered shadow recipe.
            </DocsProse>
            <SurfacesTokensDemo />
          </DocsSubsection>

          <DocsSubsection id="substrate" title="Substrate">
            <DocsProse>
              Each container knows its own level and tells whatever opens inside.
              A menu on the page and the same menu inside a dialog both end up at
              the right depth, without anything passed between them.
            </DocsProse>
            <SurfacesSubstrateDemo />
          </DocsSubsection>

          <DocsSubsection id="elevated" title="Elevated">
            <DocsProse>
              Wrap a panel and the background settles at the level it belongs to.
              The shadow doesn&apos;t change, so a popover still reads as a
              popover three layers down.
            </DocsProse>
            <SurfacesElevatedDemo />
          </DocsSubsection>

          <DocsSubsection id="levels" title="Move through levels">
            <DocsProse>
              Drag both knobs to choose which slice of the ladder to nest. Each
              layer lifts a single step off the one it sits in — whether you span
              two levels or all eight.
            </DocsProse>
            <SurfacesLevelsDemo />
          </DocsSubsection>
        </div>
      </DocsSection>

      <DocsSection id="examples" title="Examples">
        <DocsSubsection id="invite-dialog" title="Invite dialog">
          <DocsProse>
            Dialog at surface 5, role picker at surface 7 — no props passed
            between them.
          </DocsProse>
          <SurfacesInviteDemo />
        </DocsSubsection>
      </DocsSection>
    </DocsArticle>
  )
}
