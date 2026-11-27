import type { Metadata } from "next"
import Link from "next/link"

import { CodeBlock } from "@/components/site/code-block"
import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"
import { starterUrl, setupUrl } from "@/lib/kit-settings"

export const metadata: Metadata = {
  title: "Quick start — Prometheus",
  description:
    "A personal design system as a shadcn registry — components, foundations, and agent rules for every new app.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "what-it-is", title: "What it is" },
  { id: "what-it-is-not", title: "What it is not" },
  { id: "use", title: "Use existing components" },
  { id: "build", title: "Build a feature" },
  { id: "agents", title: "Agent reference" },
  { id: "coverage", title: "Coverage" },
]

export default function Home() {
  return (
    <DocsArticle
      lede="A personal design system distributed as a shadcn registry — Base UI, Tailwind, and shared foundations so every new app starts with the same visual and interaction rules."
      title="Quick start"
      toc={toc}
    >
      <DocsProse>
        Install the full kit, then shape it with Make them yours in the right
        panel. The copyable install prompt follows those settings.
      </DocsProse>
      <DocsSection id="what-it-is" title="What it is">
        <DocsProse>
          A source-installed UI kit: when you (or an agent) run the install
          prompt, you get Prometheus components, tokens, motion, surfaces, and
          agent rules copied into the app. The stack is intentional — Base UI +
          Tailwind, with Fluid-Functionalism-style systems (hover, elevation,
          and related patterns) and Prometheus as the opinion layer on top.
        </DocsProse>
        <DocsProse>
          Call the shared rules the system (or foundations): type, color
          semantics, hover washes, the surface ladder, control sizes, focus,
          and icons. Components are how those rules show up; the registry is
          how they ship.
        </DocsProse>
        <ul className="flex flex-col gap-2 text-base text-foreground/80">
          <li>
            <span className="font-medium text-foreground">Product: </span>
            personal design system
          </li>
          <li>
            <span className="font-medium text-foreground">Format: </span>
            shadcn registry (source, not npm)
          </li>
          <li>
            <span className="font-medium text-foreground">Primitives: </span>
            Base UI + Tailwind
          </li>
          <li>
            <span className="font-medium text-foreground">Audience: </span>
            you first; anyone who wants that look and feel second
          </li>
        </ul>
      </DocsSection>

      <DocsSection id="what-it-is-not" title="What it is not">
        <DocsTable
          headers={["Term", "Why it doesn’t quite fit"]}
          rows={[
            [
              "npm component library",
              "No versioned package import; source lands in the consumer repo.",
            ],
            [
              "Theme pack",
              "More than colors — behavior, structure, provider, and agent craft.",
            ],
            [
              "Template only",
              "Components stay installable a la carte after the app exists.",
            ],
            [
              "“Just shadcn”",
              "Your defaults and house style, not stock nova or neutral.",
            ],
          ]}
        />
        <DocsProse>
          In short: component library in substance, design system in intent,
          registry in how it spreads.
        </DocsProse>
      </DocsSection>

      <CodeBlock>{`npx shadcn@latest create -n my-app -t next ${starterUrl()}
npx shadcn@latest add ${setupUrl()} --overwrite`}</CodeBlock>

      <DocsSection id="use" title="Use existing components">
        <DocsProse>
          After the kit is installed, search before composing primitives.
          Overlay wrappers already lift on the surface ladder; wrap custom
          panels with <Link href="/component/elevated">Elevated</Link>. Start
          from a similar item, then adapt the composition to the feature. A la
          carte adds still work:{" "}
          <code>npx shadcn@latest add @prometheus/&lt;item&gt;</code>.
        </DocsProse>
      </DocsSection>

      <DocsSection id="build" title="Build a feature">
        <ol className="flex flex-col gap-3 text-base text-foreground/80">
          <li>
            <span className="font-medium text-foreground">
              Read the guidelines.{" "}
            </span>
            Understand hierarchy, density, and which primitive to reach for —
            see <Link href="/guidelines">Design guidelines</Link> and{" "}
            <Link href="/foundations">Foundations</Link>.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Compose existing components.{" "}
            </span>
            Start with shared defaults. Prefer a Prometheus item over inventing
            the same default by hand.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Check the result.{" "}
            </span>
            Keyboard, mobile, light and dark, and loading, empty, and error
            states. Overlays should still read against their substrate.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Update shared components.{" "}
            </span>
            When a shared pattern needs to change, update its source, example,
            and guidance together.
          </li>
        </ol>
      </DocsSection>

      <DocsSection id="agents" title="Agent reference">
        <DocsProse>
          Fetch <Link href="/llms.txt">/llms.txt</Link> for the kit index. Prefer
          the Copy install prompt over inventing an install path. Copied files
          are stamped <code>// @prometheus 0.2.0</code>. Compare that stamp with{" "}
          <code>npx shadcn@latest view AustinTByrd/prometheus/changelog</code>{" "}
          and re-add items that are behind.
        </DocsProse>
        <CodeBlock>{`npx shadcn@latest search AustinTByrd/prometheus
npx shadcn@latest add @prometheus/<item>`}</CodeBlock>
      </DocsSection>

      <DocsSection id="coverage" title="Coverage">
        <DocsProse>
          System covers the provider, app shell, surface ladder, and smooth
          corners. Page states are Skeleton, Empty, and ErrorState. Forms
          use the Form item. Overlay wrappers — dialog, select, drawer, sheet —
          lock elevation. Button is in the registry. Input, Field, and Spinner
          are official shadcn primitives the Form and Sidebar items install.
        </DocsProse>
      </DocsSection>
    </DocsArticle>
  )
}
