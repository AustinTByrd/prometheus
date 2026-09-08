import type * as React from "react"

import { Spinner as UiSpinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export function Spinner({ className, ...props }: React.ComponentProps<typeof UiSpinner>) {
  return <UiSpinner className={className} {...props} />
}

export function FullPageSpinner({
  label = "Loading",
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-svh flex-col items-center justify-center gap-3",
        className
      )}
    >
      <Spinner className="size-6" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export function FillHeightSpinner({
  label,
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex size-full min-h-40 flex-col items-center justify-center gap-3",
        className
      )}
    >
      <Spinner />
      {label ? <p className="text-sm text-muted-foreground">{label}</p> : null}
    </div>
  )
}
