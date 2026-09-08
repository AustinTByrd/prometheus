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
  children,
  disabled,
  className,
  ...props
}: UiButtonProps & {
  loading?: boolean
  icon?: LucideIcon
  iconPosition?: "start" | "end"
  href?: string
}) {
  const content = (
    <>
      {loading ? (
        <Spinner data-icon="inline-start" />
      ) : Icon && iconPosition === "start" ? (
        <Icon data-icon="inline-start" />
      ) : null}
      {children}
      {Icon && iconPosition === "end" && !loading ? (
        <Icon data-icon="inline-end" />
      ) : null}
    </>
  )

  if (href) {
    return (
      <UiButton
        className={cn(className)}
        disabled={disabled || loading}
        nativeButton={false}
        render={<a href={href} />}
        {...props}
      >
        {content}
      </UiButton>
    )
  }

  return (
    <UiButton className={cn(className)} disabled={disabled || loading} {...props}>
      {content}
    </UiButton>
  )
}

export { Button, buttonVariants }
