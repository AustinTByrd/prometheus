"use client"

import { CopyButton } from "@/components/copy-button"
import {
  installCommand,
  namespaceInstallCommand,
  SITE_URL,
} from "@/lib/catalog"

export function CopyForAgents({
  slug,
  description,
  usage,
}: {
  slug: string
  description: string
  usage?: string
}) {
  const lines = [
    `Install: ${installCommand(slug)}`,
    `Namespaced: ${namespaceInstallCommand(slug)}`,
    `Purpose: ${description}`,
    `Docs: ${SITE_URL}/component/${slug}`,
    `Registry JSON: ${SITE_URL}/r/${slug}.json`,
  ]

  if (usage) {
    lines.push("", "Usage:", "```tsx", usage, "```")
  }

  return (
    <CopyButton
      copiedLabel="Copied"
      label="Copy for agents"
      size="sm"
      value={lines.join("\n")}
      variant="outline"
    />
  )
}
