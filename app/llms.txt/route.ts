import {
  catalog,
  initCommand,
  OWNER_REPO,
  REGISTRY_NAMESPACE,
  SITE_URL,
} from "@/lib/catalog"

export const dynamic = "force-static"

export function GET() {
  const lines = [
    "# Prometheus",
    "",
    "> Personal React source-component registry built on shadcn, Base UI, and Tailwind CSS. Small prop APIs let developers and coding agents write less UI code and reuse consistent desktop/mobile interactions.",
    "",
    "## Philosophy",
    "",
    "Search and install an existing Prometheus component before composing shadcn primitives or inventing a mobile variant. Source is installed into the app with the shadcn CLI on Base UI.",
    `Init: ${initCommand()}`,
    `Add (GitHub): npx shadcn@latest add ${OWNER_REPO}/<item>`,
    `Add (Namespaced): npx shadcn@latest add ${REGISTRY_NAMESPACE}/<item>`,
    `Search: npx shadcn@latest search ${OWNER_REPO}`,
    "Wrap the app in PrometheusProvider. ResponsiveDialog and ResponsivePopover read isMobile from that provider. SimpleDialog and SimplePopover stay desktop-only and do not install drawer dependencies. Pass mobileView=\"keep\" to opt out.",
    "",
    "## Documentation",
    "",
    `- [Usage guide](${SITE_URL}/guide)`,
    `- [Component collection](${SITE_URL}/)`,
    `- [Registry index](${SITE_URL}/r/registry.json)`,
    "",
    "## Setup & Agent Pack",
    "",
    `- [Prometheus Base](${SITE_URL}/r/base.json): Locks Base UI (base-nova), Geist, Lucide, ember tokens, @prometheus namespace, agent pack, and PrometheusProvider. — ${initCommand()}`,
    `- [Prometheus Agent Pack](${SITE_URL}/r/agent.json): Installs AGENTS.md and .cursor/skills/prometheus/SKILL.md so coding agents search Prometheus first. — npx shadcn@latest add ${OWNER_REPO}/agent`,
    "",
    "## Components",
    "",
    ...catalog.map(
      (item) =>
        `- [${item.title}](${SITE_URL}/component/${item.slug}): ${item.description} [JSON](${SITE_URL}/r/${item.slug}.json) — npx shadcn@latest add ${OWNER_REPO}/${item.slug}`
    ),
    "",
  ]

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
