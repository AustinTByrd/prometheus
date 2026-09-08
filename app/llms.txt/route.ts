import { catalog, initCommand, OWNER_REPO } from "@/lib/catalog"

export function GET() {
  const lines = [
    "# Prometheus",
    "",
    "> React source components built on shadcn, Base UI and Tailwind CSS. Small prop APIs let developers and LLMs write less UI code and reuse consistent desktop/mobile interactions.",
    "",
    "## Philosophy",
    "",
    "Use an existing Prometheus component before composing primitives or inventing a mobile variant. Install source into the app with shadcn. Initialize with Base UI.",
    `Install: ${initCommand()}`,
    `Add: npx shadcn@latest add ${OWNER_REPO}/COMPONENT`,
    "Wrap the app in PrometheusProvider. ResponsiveDialog uses isMobile from that provider. SimpleDialog stays a centered dialog. mobileView=keep opts out.",
    "Simple vs Responsive is an installation boundary. Responsive may depend on Simple. Simple must not install drawer/mobile dependencies.",
    "",
    "## Documentation",
    "",
    "- [Usage guide](/guide)",
    "- [Component collection](/)",
    "- [Registry index](/r/registry.json)",
    "",
    "## Components",
    "",
    ...catalog.map(
      (item) =>
        `- [${item.title}](/component/${item.slug}): ${item.description} [Install](/r/${item.slug}.json) — npx shadcn@latest add ${OWNER_REPO}/${item.slug}`
    ),
    "",
  ]

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
