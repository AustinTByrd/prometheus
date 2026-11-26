"use client"

import { CopyButton } from "@/components/copy-button"
import { cn } from "@/lib/utils"

export function CommandBlock({
  code,
  className,
}: {
  code: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative flex items-start justify-between gap-3 rounded-lg border bg-card px-4 py-3 text-card-foreground",
        className
      )}
    >
      <pre className="min-w-0 flex-1 overflow-x-auto font-mono text-xs leading-relaxed">
        <code>{code}</code>
      </pre>
      <CopyButton
        aria-label="Copy snippet"
        className="shrink-0"
        size="icon-xs"
        value={code}
        variant="ghost"
      />
    </div>
  )
}
