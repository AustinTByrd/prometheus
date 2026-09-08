import type * as React from "react"

import { cn } from "@/lib/utils"

export function PageHeader({
  title,
  description,
  children,
  className,
  sticky = false,
}: {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
  sticky?: boolean
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between",
        sticky && "sticky top-0 z-20 bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? (
        <div className="flex shrink-0 items-center gap-2">{children}</div>
      ) : null}
    </header>
  )
}
