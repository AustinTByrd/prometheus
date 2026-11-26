"use client"

import type * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/button"
import { SimpleTooltip } from "@/components/simple-tooltip"
import { cn } from "@/lib/utils"

export function ThemeToggle({
  tooltip = "Toggle theme",
  variant = "ghost",
  size = "icon-sm",
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children" | "icon" | "onClick"> & {
  tooltip?: string
}) {
  const { resolvedTheme, setTheme } = useTheme()

  function toggle() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <SimpleTooltip content={tooltip}>
      <Button
        aria-label={tooltip}
        className={cn("relative", className)}
        onClick={toggle}
        size={size}
        variant={variant}
        {...props}
      >
        <SunIcon className="scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
        <MoonIcon className="absolute scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
        <span className="sr-only">{tooltip}</span>
      </Button>
    </SimpleTooltip>
  )
}
