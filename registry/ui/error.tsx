// @prometheus 0.2.0
import { cn } from "@/lib/utils"

function ErrorState({
  icon,
  title,
  description,
  actions,
  className,
}: {
  icon?: React.ReactNode
  title: string
  description: string
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-16 text-center",
        className
      )}
    >
      {icon ? (
        <div className="text-destructive [&_svg]:size-8">{icon}</div>
      ) : null}
      <div className="flex max-w-sm flex-col gap-1">
        <h2 className="font-display text-xl text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  )
}

export { ErrorState }
