import { catalog, initCommand, OWNER_REPO, registrySlug } from "@/lib/catalog"

function llmsTxt() {
  return [
    "# Prometheus",
    "",
    "> Personal shadcn registry on Base UI. System foundations first: provider, surfaces, and tokens.",
    "",
    "## Philosophy",
    "",
    "Install source into the app with shadcn. Initialize with Base UI. Prefer registry items over inventing defaults.",
    `Install: ${initCommand()}`,
    `Add: npx shadcn@latest add ${OWNER_REPO}/ITEM`,
    "Wrap the app in PrometheusProvider.",
    "Surfaces: eight nested elevation levels. Dialogs lift 4 steps, select menus lift 2, with a fixed shadow so a menu still reads as a menu inside a dialog. Use Elevated for custom panels.",
    "Smooth corners: Lisse squircles on Elevated and overlays. Presets in @/lib/smooth-corners match --radius* tokens (squircle, smoothing 1). Controls use CSS rounded-*; pill and circle stay CSS rounded-full. Use useCornerRef for custom Base UI popups.",
    "Color: shadcn semantic roles, warm umber primary on paper surfaces. text-primary is emphasis, not body copy — use text-foreground.",
    "",
    "## Documentation",
    "",
    "- [Quick start](/)",
    "- [Design guidelines](/guidelines)",
    "- [Foundations](/foundations)",
    "- [Typography](/typography)",
    "- [Registry index](/r/registry.json)",
    "",
    "## System",
    "",
    ...catalog
      .filter((item) => item.category === "System")
      .map(
        (item) =>
          `- [${item.title}](/component/${item.slug}): ${item.description} [Install](/r/${item.slug}.json) — npx shadcn@latest add ${OWNER_REPO}/${item.slug}`
      ),
    "",
    "## Components",
    "",
    ...catalog
      .filter((item) => item.category === "Components")
      .map(
        (item) =>
          `- [${item.title}](/component/${item.slug}): ${item.description} [Install](/r/${registrySlug(item.slug)}.json) — npx shadcn@latest add ${OWNER_REPO}/${registrySlug(item.slug)}`
      ),
    "",
    "## Data display",
    "",
    ...catalog
      .filter((item) => item.category === "Data display")
      .map(
        (item) =>
          `- [${item.title}](/component/${item.slug}): ${item.description} [Install](/r/${registrySlug(item.slug)}.json) — npx shadcn@latest add ${OWNER_REPO}/${registrySlug(item.slug)}`
      ),
    "",
  ].join("\n")
}

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

export function GET(request: Request) {
  const text = llmsTxt()
  const accept = request.headers.get("accept") ?? ""
  const wantsHtml = accept.includes("text/html")

  if (!wantsHtml) {
    return new Response(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="color-scheme" content="light dark" />
  <title>llms.txt — Prometheus</title>
  <style>
    html { color-scheme: light dark; }
    body {
      margin: 0;
      background: Canvas;
      color: CanvasText;
      font: 14px/1.6 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    pre {
      margin: 0;
      padding: 2rem;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <pre>${escapeHtml(text)}</pre>
</body>
</html>
`
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  })
}
