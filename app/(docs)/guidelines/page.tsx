import type { Metadata } from "next"
import Link from "next/link"

import {
  DocsArticle,
  DocsProse,
  DocsSection,
  DocsTable,
} from "@/components/site/docs-article"

export const metadata: Metadata = {
  title: "Design guidelines — Prometheus",
  description:
    "Principles and patterns for designing with Prometheus.",
}

const toc = [
  { id: "overview", title: "Overview" },
  { id: "start", title: "Start from the kit" },
  { id: "principles", title: "Principles" },
  { id: "defaults", title: "Component defaults" },
  { id: "color", title: "Color and themes" },
  { id: "type", title: "Type and spacing" },
  { id: "sources", title: "System sources" },
  { id: "states", title: "States and copy" },
  { id: "review", title: "Review in context" },
]

export default function GuidelinesPage() {
  return (
    <DocsArticle
      lede="Principles and patterns for designing with Prometheus."
      title="Design guidelines"
      toc={toc}
    >
      <DocsSection id="start" title="Start from the kit">
        <DocsProse>
          Browse the registry and find a shipped item with a similar purpose.
          Use its hierarchy, density, and interactions as a starting point.
          Import Prometheus items after they are installed; use Base UI{" "}
          <code>render</code>, not Radix <code>asChild</code>.
        </DocsProse>
        <DocsProse>
          The kit provides defaults, not a fixed set of layouts. Explore
          compositions when the feature calls for them. Keep what helps people
          understand and use the feature; improve a shared pattern when the new
          approach works better across its callers.
        </DocsProse>
      </DocsSection>
      <DocsSection id="principles" title="Principles">
        <ul className="flex flex-col gap-3 text-base text-foreground/80">
          <li>
            <span className="font-medium text-foreground">Content first. </span>
            Titles, body, and data should lead. Controls support them.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Clear hierarchy.{" "}
            </span>
            Use placement, spacing, and typography to establish importance.
            Reserve strong color for emphasis and meaningful states.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Purposeful density.{" "}
            </span>
            Keep toolbars and lists compact; give reading and complex tasks
            room. Group related information and align its edges.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Familiar behavior.{" "}
            </span>
            Choose components by what the interaction does: links navigate,
            buttons act, selects choose values, menus offer commands, and tabs
            switch panels. Prefer a shipped Prometheus item before wrapping a
            new primitive.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Accessible by default.{" "}
            </span>
            Give controls clear names, preserve keyboard focus and navigation,
            and make essential actions available to touch and keyboard users.
            Respect reduced motion.
          </li>
        </ul>
      </DocsSection>

      <DocsSection id="defaults" title="Component defaults">
        <DocsProse>
          Start with shared styles and match sizes on adjacent controls. Neutral
          actions suit most cases; use the umber primary when an action needs
          an accent. Destructive variants belong to destructive actions.
        </DocsProse>
        <DocsProse>
          Compose existing components before adding variants. Native elements
          and other Base UI primitives are useful when they fit the behavior
          better. Keep overlay dismissal, focus, and surface lift in the
          primitive rather than rebuilding them in a feature.
        </DocsProse>
        <DocsProse>
          Exact props and examples will live on the component pages. When
          changing a shared component, check its callers and update its example
          and guidance together.
        </DocsProse>
      </DocsSection>

      <DocsSection id="color" title="Color and themes">
        <DocsProse>
          Use semantic roles so layouts work in light and dark:
        </DocsProse>
        <ul className="flex flex-col gap-2 text-base text-foreground/80">
          <li>
            <code>text-foreground</code> for important text,{" "}
            <code>text-muted-foreground</code> for supporting text.{" "}
            <code>text-primary</code> is umber emphasis — not body copy.
          </li>
          <li>
            <code>bg-background</code> for the page,{" "}
            <code>bg-muted</code> / <code>bg-secondary</code> for grouping,{" "}
            <code>bg-hover</code> for hover so it reads on any surface, and
            the{" "}
            <Link href="/component/elevated">surface ladder</Link> for
            overlays.
          </li>
          <li>
            <code>border-border</code> for subtle divisions;{" "}
            <code>shadow-surface-*</code> for nested panels.
          </li>
        </ul>
        <DocsProse>
          Color should reinforce meaning rather than carry it alone. The{" "}
          <Link href="/foundations">foundations</Link> page shows the tokens in
          context.
        </DocsProse>
      </DocsSection>

      <DocsSection id="type" title="Type and spacing">
        <DocsProse>
          Use Geist for UI and body, Geist Serif (<code>font-display</code>) for
          titles from <code>text-xl</code> up, and the type ramp from{" "}
          <code>text-xs</code> to <code>text-5xl</code>. Each step sets size,
          line-height, and tracking. Body text is regular (400) or{" "}
          <code>font-medium</code> (500). Long-form copy uses <code>prose</code>.
          Opening letters use <code>drop-cap</code>.
          Lay the viewport out with <code>breakpoints</code> (<code>sm</code>{" "}
          through <code>xl</code>); the app frame splits at{" "}
          <code>breakpoints.md</code>. Use <code>gap-*</code>, not{" "}
          <code>space-y-*</code>. Use <code>size-*</code> when width and height
          match.
        </DocsProse>
        <DocsProse>
          Consider long titles, wrapped descriptions, and narrow screens as part
          of the composition. Compact rows often benefit from truncation;
          reading and explanatory content need room to wrap.
        </DocsProse>
      </DocsSection>

      <DocsSection id="sources" title="System sources">
        <DocsProse>
          Use these as references for composition, not templates for every
          feature.
        </DocsProse>
        <DocsTable
          headers={["Pattern", "Starting point", "What to carry forward"]}
          rows={[
            [
              "App root",
              <Link href="/component/prometheus-provider" key="provider">
                Prometheus Provider
              </Link>,
              "Theme, tooltips, isMobile, surface 1.",
            ],
            [
              "App frame",
              <Link href="/component/app-shell" key="shell">
                App Shell
              </Link>,
              "Sidebar, top bar, scrolling main, one-row footer. Root layout stays the provider.",
            ],
            [
              "Form",
              <Link href="/component/form" key="form">
                Form
              </Link>,
              "Zod schema, field errors, root error, pending submit. Values stay on failure.",
            ],
            [
              "Nested panel",
              <Link href="/component/elevated" key="elevated">
                Surfaces
              </Link>,
              "Read the substrate and lift. Fixed shadow so a menu still reads as a menu.",
            ],
            [
              "Panel corners",
              <Link href="/component/smooth-corners" key="corners">
                Smooth Corners
              </Link>,
              "Lisse squircles on Elevated and overlays. Prefer useCornerRef on popups; controls use CSS rounded-*. Pill and circle stay rounded-full.",
            ],
            [
              "Focused task",
              <Link href="/component/dialog" key="dialog">
                Dialog
              </Link>,
              "A clear purpose, explicit actions, and predictable dismissal.",
            ],
          ]}
        />
      </DocsSection>

      <DocsSection id="states" title="States and copy">
        <DocsProse>
          Make loading, success, empty, and error states understandable.
          Page loading uses <Link href="/component/skeleton">Skeleton</Link>.
          An empty view uses <Link href="/component/empty">Empty</Link>. A
          failed view uses <Link href="/component/error">ErrorState</Link>.
          A submitting button uses Spinner and stays disabled. Preserve entered
          work on failure and provide a way forward. Show success only after
          the action succeeds.
        </DocsProse>
        <DocsProse>
          Write short, concrete labels. Explain decisions or consequences when
          needed. Omit slogans, ornamental labels, and text that merely
          describes the interface.
        </DocsProse>
      </DocsSection>

      <DocsSection id="review" title="Review in context">
        <DocsProse>
          Compare the result with nearby screens: does the hierarchy feel
          clear, and do the controls and spacing belong together? Check the
          feature’s relevant states, keyboard interactions, mobile layout, and
          themes.
        </DocsProse>
        <DocsProse>
          Treat feedback as evidence. Refine the feature when the issue is
          local; improve the shared component or guidance when the lesson
          applies more broadly.
        </DocsProse>
      </DocsSection>
    </DocsArticle>
  )
}
