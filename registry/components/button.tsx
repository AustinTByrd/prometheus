import type * as React from "react"
import type { LucideIcon } from "lucide-react"

import { Button as UiButton, buttonVariants } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type UiButtonProps = React.ComponentProps<typeof UiButton>

function Button({
  loading = false,
  icon: Icon,
  iconPosition = "start",
  href,
  target,
  rel,
  children,
  disabled,
  className,
  ...props
}: UiButtonProps & {
  loading?: boolean
  icon?: LucideIcon
  iconPosition?: "start" | "end"
  href?: string
  target?: React.HTMLAttributeAnchorTarget
  rel?: string
}) {
  const isDisabled = disabled || loading
  const content = (
    <>
      {loading ? (
        <Spinner data-icon={children ? "inline-start" : undefined} />
      ) : Icon && iconPosition === "start" ? (
        <Icon data-icon={children ? "inline-start" : undefined} />
      ) : null}
      {children}
      {Icon && iconPosition === "end" && !loading ? (
        <Icon data-icon={children ? "inline-end" : undefined} />
      ) : null}
    </>
  )

  if (href) {
    return (
      <UiButton
        aria-busy={loading || undefined}
        className={cn(isDisabled && "pointer-events-none opacity-50", className)}
        disabled={isDisabled}
        nativeButton={false}
        render={<a href={href} rel={rel} target={target} />}
        {...props}
      >
        {content}
      </UiButton>
    )
  }

  return (
    <UiButton
      aria-busy={loading || undefined}
      className={cn(className)}
      disabled={isDisabled}
      {...props}
    >
      {content}
    </UiButton>
  )
}

export { Button, buttonVariants }
