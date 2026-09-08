"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CopyForAgents({
  slug,
  description,
}: {
  slug: string
  description: string
}) {
  const [copied, setCopied] = React.useState(false)

  const text = [
    `Install: npx shadcn@latest add AustinTByrd/prometheus/${slug}`,
    `Purpose: ${description}`,
    `Docs: /component/${slug}`,
  ].join("\n")

  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Button onClick={copy} size="sm" variant="outline">
      {copied ? (
        <CheckIcon data-icon="inline-start" />
      ) : (
        <CopyIcon data-icon="inline-start" />
      )}
      {copied ? "Copied" : "Copy for agents"}
    </Button>
  )
}
