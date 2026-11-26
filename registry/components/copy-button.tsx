"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/button"

export function CopyButton({
  value,
  label,
  copiedLabel = "Copied",
  timeout = 1600,
  onCopied,
  variant = "outline",
  size,
  onClick,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "children" | "icon"> & {
  value: string
  label?: string
  copiedLabel?: string
  timeout?: number
  onCopied?: (value: string) => void
}) {
  const [copied, setCopied] = React.useState(false)
  const timerRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleClick: NonNullable<React.ComponentProps<typeof Button>["onClick"]> =
    async (event) => {
      onClick?.(event)
      if (event.defaultPrevented) return

      try {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        onCopied?.(value)
        if (timerRef.current !== null) {
          window.clearTimeout(timerRef.current)
        }
        timerRef.current = window.setTimeout(() => {
          setCopied(false)
          timerRef.current = null
        }, timeout)
      } catch {
        setCopied(false)
      }
    }

  const isIconOnly = !label
  const resolvedSize = size ?? (isIconOnly ? "icon-sm" : "sm")

  return (
    <Button
      aria-label={
        props["aria-label"] ?? (isIconOnly ? (copied ? copiedLabel : "Copy") : undefined)
      }
      icon={copied ? CheckIcon : CopyIcon}
      onClick={handleClick}
      size={resolvedSize}
      variant={variant}
      {...props}
    >
      {label ? (copied ? copiedLabel : label) : null}
    </Button>
  )
}
