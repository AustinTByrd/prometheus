"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"
export type AvatarShape = "circle" | "square"
export type AvatarStatus = "online" | "offline" | "busy" | "away"
export type AvatarLoadingStatus = "idle" | "loading" | "loaded" | "error"
export type AvatarStackTopmost = "right" | "left"
export type AvatarStackHover = "none" | "lift" | "expand"

// Size presets only set `--avatar-size`; every internal dimension derives from it via calc().
const AVATAR_SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: "[--avatar-size:1.5rem]",
  sm: "[--avatar-size:1.75rem]",
  md: "[--avatar-size:2rem]",
  lg: "[--avatar-size:2.5rem]",
  xl: "[--avatar-size:3rem]",
}

const AVATAR_STATUS_COLORS: Record<AvatarStatus, string> = {
  online: "bg-emerald-500",
  away: "bg-amber-500",
  busy: "bg-destructive",
  offline: "bg-muted-foreground/60",
}

const AVATAR_STATUS_LABELS: Record<AvatarStatus, string> = {
  online: "Online",
  away: "Away",
  busy: "Busy",
  offline: "Offline",
}

const FALLBACK_SURFACE_CLASS =
  "bg-[color-mix(in_oklab,var(--muted)_92%,var(--foreground)_8%)]"

type AvatarContextValue = {
  imageStatus: AvatarLoadingStatus
  setImageStatus: (status: AvatarLoadingStatus) => void
  hasAccessibleLabel: boolean
  registerImageAlt: (alt: string | undefined) => void
}

const AvatarContext = React.createContext<AvatarContextValue | null>(null)

function useAvatarContext() {
  return React.useContext(AvatarContext)
}

function isComponentType(
  value: unknown
): value is React.ComponentType<{ className?: string }> {
  return (
    typeof value === "function" ||
    (typeof value === "object" &&
      value !== null &&
      "$$typeof" in value &&
      !React.isValidElement(value))
  )
}

export function getAvatarInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function DefaultAvatarIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="8.5" r="4" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  )
}

export interface AvatarProps extends React.ComponentProps<"span"> {
  src?: string
  alt?: string
  name?: string
  fallback?: React.ReactNode
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode
  size?: AvatarSize
  shape?: AvatarShape
  status?: AvatarStatus
  statusLabel?: string
  delayMs?: number
  onLoadingStatusChange?: (status: AvatarLoadingStatus) => void
  imgProps?: Omit<React.ComponentProps<"img">, "src" | "alt">
}

export function Avatar({
  src,
  alt,
  name,
  fallback,
  icon,
  size,
  shape = "circle",
  status,
  statusLabel,
  delayMs = 0,
  onLoadingStatusChange,
  imgProps,
  children,
  className,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
  role,
  ...props
}: AvatarProps) {
  const [imageStatus, setImageStatusState] =
    React.useState<AvatarLoadingStatus>(src ? "loading" : "idle")
  const [imageAlt, setImageAlt] = React.useState<string | undefined>(undefined)

  const onLoadingStatusChangeRef = React.useRef(onLoadingStatusChange)
  onLoadingStatusChangeRef.current = onLoadingStatusChange

  const setImageStatus = React.useCallback((next: AvatarLoadingStatus) => {
    setImageStatusState((prev) => {
      if (prev === next) return prev
      return next
    })
  }, [])

  React.useEffect(() => {
    onLoadingStatusChangeRef.current?.(imageStatus)
  }, [imageStatus])

  const registerImageAlt = React.useCallback((nextAlt: string | undefined) => {
    setImageAlt(nextAlt)
  }, [])

  const isComposable = children !== undefined
  const resolvedAlt = alt ?? name ?? imageAlt
  const baseAccessibleLabel = ariaLabel ?? resolvedAlt
  const resolvedStatusLabel = status
    ? (statusLabel ?? AVATAR_STATUS_LABELS[status])
    : undefined

  const isImageVisible = imageStatus === "loaded"
  const shouldExposeRootImgRole =
    !ariaHidden && !isImageVisible && Boolean(baseAccessibleLabel)
  const rootAriaLabel = shouldExposeRootImgRole
    ? resolvedStatusLabel
      ? `${baseAccessibleLabel}, ${resolvedStatusLabel}`
      : baseAccessibleLabel
    : ariaLabel

  const contextValue = React.useMemo<AvatarContextValue>(
    () => ({
      imageStatus,
      setImageStatus,
      hasAccessibleLabel: Boolean(baseAccessibleLabel) || Boolean(ariaHidden),
      registerImageAlt,
    }),
    [imageStatus, setImageStatus, baseAccessibleLabel, ariaHidden, registerImageAlt]
  )

  const renderFallbackNode = () => {
    if (fallback !== undefined && fallback !== null) {
      return fallback
    }
    if (name) {
      const initials = getAvatarInitials(name)
      if (initials) return initials
    }
    if (icon) {
      if (React.isValidElement(icon)) return icon
      if (isComponentType(icon)) {
        const IconComponent = icon
        return (
          <IconComponent className="size-[calc(var(--_avatar-size)_*_0.48)] shrink-0" />
        )
      }
      return icon
    }
    if (alt) {
      const initials = getAvatarInitials(alt)
      if (initials) return initials
    }
    return (
      <DefaultAvatarIcon className="size-[calc(var(--_avatar-size)_*_0.48)] shrink-0 text-muted-foreground" />
    )
  }

  return (
    <AvatarContext.Provider value={contextValue}>
      <span
        aria-hidden={ariaHidden}
        aria-label={rootAriaLabel}
        className={cn(
          "[--_avatar-size:var(--avatar-size,2rem)] relative inline-flex shrink-0 select-none items-center justify-center align-middle size-[var(--_avatar-size)] text-[calc(var(--_avatar-size)_*_0.375)] leading-none font-medium",
          shape === "square"
            ? "rounded-[calc(var(--_avatar-size)_*_0.24)]"
            : "rounded-full",
          size && AVATAR_SIZE_CLASSES[size],
          className
        )}
        data-shape={shape}
        data-slot="avatar"
        data-status={status}
        role={role ?? (shouldExposeRootImgRole ? "img" : undefined)}
        {...props}
      >
        {isComposable ? (
          children
        ) : (
          <>
            {src ? (
              <AvatarImage
                alt={resolvedAlt ?? ""}
                src={src}
                {...imgProps}
              />
            ) : null}
            <AvatarFallback delayMs={delayMs}>
              {renderFallbackNode()}
            </AvatarFallback>
            {status ? (
              <AvatarBadge
                label={resolvedStatusLabel}
                status={status}
              />
            ) : null}
          </>
        )}
      </span>
    </AvatarContext.Provider>
  )
}

export interface AvatarImageProps extends React.ComponentProps<"img"> {
  onLoadingStatusChange?: (status: AvatarLoadingStatus) => void
}

export function AvatarImage({
  src,
  alt = "",
  className,
  onLoad,
  onError,
  onLoadingStatusChange,
  ...props
}: AvatarImageProps) {
  const ctx = useAvatarContext()
  const setImageStatus = ctx?.setImageStatus
  const registerImageAlt = ctx?.registerImageAlt
  const imgRef = React.useRef<HTMLImageElement | null>(null)
  const [prevSrc, setPrevSrc] = React.useState(src)
  const [localStatus, setLocalStatus] = React.useState<AvatarLoadingStatus>(
    src ? "loading" : "error"
  )

  if (prevSrc !== src) {
    setPrevSrc(src)
    setLocalStatus(src ? "loading" : "error")
  }

  const onLoadingStatusChangeRef = React.useRef(onLoadingStatusChange)
  onLoadingStatusChangeRef.current = onLoadingStatusChange

  const updateStatus = React.useCallback(
    (next: AvatarLoadingStatus) => {
      setLocalStatus(next)
      setImageStatus?.(next)
      onLoadingStatusChangeRef.current?.(next)
    },
    [setImageStatus]
  )

  React.useEffect(() => {
    registerImageAlt?.(alt || undefined)
    return () => registerImageAlt?.(undefined)
  }, [alt, registerImageAlt])

  React.useEffect(() => {
    return () => {
      setImageStatus?.("idle")
    }
  }, [setImageStatus])

  React.useEffect(() => {
    if (!src) {
      updateStatus("error")
      return
    }

    const img = imgRef.current
    if (img && img.complete) {
      if (img.naturalWidth > 0) {
        updateStatus("loaded")
      } else {
        updateStatus("error")
      }
      return
    }

    updateStatus("loading")
  }, [src, updateStatus])

  if (!src || localStatus === "error") {
    return null
  }

  return (
    <img
      alt={alt}
      className={cn(
        "absolute inset-0 size-full rounded-[inherit] object-cover",
        localStatus === "loaded" ? "opacity-100" : "pointer-events-none opacity-0",
        className
      )}
      data-slot="avatar-image"
      data-status={localStatus}
      onError={(event) => {
        updateStatus("error")
        onError?.(event)
      }}
      onLoad={(event) => {
        updateStatus("loaded")
        onLoad?.(event)
      }}
      ref={imgRef}
      src={src}
      {...props}
    />
  )
}

export interface AvatarFallbackProps extends React.ComponentProps<"span"> {
  delayMs?: number
}

export function AvatarFallback({
  delayMs = 0,
  children,
  className,
  ...props
}: AvatarFallbackProps) {
  const ctx = useAvatarContext()
  const [canRender, setCanRender] = React.useState(delayMs <= 0)

  React.useEffect(() => {
    if (
      delayMs <= 0 ||
      ctx?.imageStatus === "idle" ||
      ctx?.imageStatus === "error"
    ) {
      setCanRender(true)
      return
    }
    setCanRender(false)
    const timer = window.setTimeout(() => setCanRender(true), delayMs)
    return () => window.clearTimeout(timer)
  }, [delayMs, ctx?.imageStatus])

  if (ctx?.imageStatus === "loaded" || !canRender) {
    return null
  }

  return (
    <span
      aria-hidden={ctx?.hasAccessibleLabel ? true : undefined}
      className={cn(
        "flex size-full items-center justify-center overflow-hidden rounded-[inherit] text-foreground",
        FALLBACK_SURFACE_CLASS,
        className
      )}
      data-slot="avatar-fallback"
      {...props}
    >
      <span
        className="inline-flex items-center justify-center leading-none tracking-[-0.02em]"
        data-slot="avatar-fallback-content"
      >
        {children}
      </span>
    </span>
  )
}

export interface AvatarBadgeProps extends React.ComponentProps<"span"> {
  status?: AvatarStatus
  label?: string
}

export function AvatarBadge({
  status = "online",
  label,
  className,
  ...props
}: AvatarBadgeProps) {
  const ctx = useAvatarContext()
  const resolvedLabel = label ?? AVATAR_STATUS_LABELS[status]
  const exposeSrText = ctx?.imageStatus === "loaded"

  return (
    <span
      aria-hidden={exposeSrText ? undefined : true}
      className={cn(
        "pointer-events-none absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full size-[calc(var(--_avatar-size)_*_0.28)] ring-[calc(var(--_avatar-size)_*_0.06)] ring-background",
        AVATAR_STATUS_COLORS[status],
        className
      )}
      data-slot="avatar-badge"
      data-status={status}
      {...props}
    >
      {exposeSrText ? <span className="sr-only">{resolvedLabel}</span> : null}
    </span>
  )
}

export interface AvatarStackCountProps extends React.ComponentProps<"span"> {
  count?: number
  formatLabel?: (count: number) => string
}

export function AvatarStackCount({
  count,
  formatLabel = (n) => `${n} more`,
  children,
  className,
  "aria-label": ariaLabel,
  role,
  ...props
}: AvatarStackCountProps) {
  const displayContent =
    children !== undefined
      ? children
      : count !== undefined
        ? `+${count}`
        : null
  const resolvedLabel =
    ariaLabel ?? (count !== undefined ? formatLabel(count) : undefined)

  return (
    <span
      aria-label={resolvedLabel}
      className={cn(
        "[--_avatar-size:var(--avatar-size,2rem)] relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full align-middle size-[var(--_avatar-size)] text-[calc(var(--_avatar-size)_*_0.34)] leading-none font-medium tabular-nums text-muted-foreground",
        FALLBACK_SURFACE_CLASS,
        className
      )}
      data-slot="avatar"
      data-slot-variant="count"
      role={role ?? (resolvedLabel ? "img" : undefined)}
      {...props}
    >
      <span
        aria-hidden={resolvedLabel ? true : undefined}
        className="inline-flex items-center justify-center leading-none tracking-[-0.02em]"
        data-slot="avatar-fallback-content"
      >
        {displayContent}
      </span>
    </span>
  )
}

// Radial-gradient masks punch a true transparent hole (radius = size/2 + gap) centered on the
// overlapping neighbor, letting any background behind the stack show cleanly through.
const RIGHT_TOPMOST_CLASSES = cn(
  "[&>[data-slot=avatar]:not(:last-child)]:[mask-image:radial-gradient(circle_at_calc(var(--_avatar-size)_*_1.5_-_var(--_avatar-overlap))_50%,transparent_calc(var(--_avatar-cut-r)_-_0.35px),black_calc(var(--_avatar-cut-r)_+_0.35px))]",
  "[&>[data-slot=avatar]:not(:last-child)_[data-slot=avatar-fallback-content]]:translate-x-[calc(var(--_avatar-nudge)_*_-1)]"
)

const LEFT_TOPMOST_CLASSES = cn(
  "[&>[data-slot=avatar]:not(:first-child)]:[mask-image:radial-gradient(circle_at_calc(var(--_avatar-overlap)_-_var(--_avatar-size)_/_2)_50%,transparent_calc(var(--_avatar-cut-r)_-_0.35px),black_calc(var(--_avatar-cut-r)_+_0.35px))]",
  "[&>[data-slot=avatar]:not(:first-child)_[data-slot=avatar-fallback-content]]:translate-x-[var(--_avatar-nudge)]"
)

const HOVER_LIFT_CLASSES = cn(
  "[&>[data-slot=avatar]]:motion-safe:transition-transform [&>[data-slot=avatar]]:motion-safe:duration-200 [&>[data-slot=avatar]]:motion-safe:ease-out",
  "[&>[data-slot=avatar]_[data-slot=avatar-fallback-content]]:motion-safe:transition-transform [&>[data-slot=avatar]_[data-slot=avatar-fallback-content]]:motion-safe:duration-200 [&>[data-slot=avatar]_[data-slot=avatar-fallback-content]]:motion-safe:ease-out",
  "[&>[data-slot=avatar]:hover]:z-10",
  "[&>[data-slot=avatar]:hover]:motion-safe:-translate-y-[calc(var(--_avatar-size)_*_0.12)]",
  "[&>[data-slot=avatar]:not(:last-child):hover]:[mask-image:none]",
  "[&>[data-slot=avatar]:not(:first-child):hover]:[mask-image:none]",
  "[&>[data-slot=avatar]:not(:last-child):hover_[data-slot=avatar-fallback-content]]:translate-x-0",
  "[&>[data-slot=avatar]:not(:first-child):hover_[data-slot=avatar-fallback-content]]:translate-x-0"
)

const HOVER_EXPAND_CLASSES = cn(
  "[&>[data-slot=avatar]]:motion-safe:transition-[margin,transform] [&>[data-slot=avatar]]:motion-safe:duration-200 [&>[data-slot=avatar]]:motion-safe:ease-out",
  "[&>[data-slot=avatar]_[data-slot=avatar-fallback-content]]:motion-safe:transition-transform [&>[data-slot=avatar]_[data-slot=avatar-fallback-content]]:motion-safe:duration-200 [&>[data-slot=avatar]_[data-slot=avatar-fallback-content]]:motion-safe:ease-out",
  "motion-safe:hover:[&>[data-slot=avatar]:not(:first-child)]:ml-[var(--_avatar-gap)]",
  "motion-safe:hover:[&>[data-slot=avatar]:not(:last-child)]:[mask-image:none]",
  "motion-safe:hover:[&>[data-slot=avatar]:not(:first-child)]:[mask-image:none]",
  "motion-safe:hover:[&>[data-slot=avatar]:not(:last-child)_[data-slot=avatar-fallback-content]]:translate-x-0",
  "motion-safe:hover:[&>[data-slot=avatar]:not(:first-child)_[data-slot=avatar-fallback-content]]:translate-x-0"
)

export interface AvatarStackProps extends React.ComponentProps<"div"> {
  topmost?: AvatarStackTopmost
  size?: AvatarSize
  max?: number
  label?: string
  formatOverflowLabel?: (count: number) => string
  hover?: AvatarStackHover
}

export function AvatarStack({
  topmost = "right",
  size,
  max,
  label = "Avatars",
  formatOverflowLabel,
  hover = "none",
  children,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: AvatarStackProps) {
  const items = React.Children.toArray(children)
  const shouldTruncate = typeof max === "number" && max >= 0 && items.length > max
  const visibleItems = shouldTruncate ? items.slice(0, max) : items
  const overflowCount = shouldTruncate ? items.length - max : 0

  return (
    <div
      aria-label={ariaLabelledBy ? undefined : (ariaLabel ?? label)}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        "isolate inline-flex items-center",
        "[--_avatar-size:var(--avatar-size,2rem)]",
        "[--_avatar-overlap:var(--avatar-overlap,calc(var(--_avatar-size)_*_0.3))]",
        "[--_avatar-gap:var(--avatar-gap,calc(var(--_avatar-size)_/_16))]",
        "[--_avatar-nudge:var(--avatar-nudge,calc((var(--_avatar-overlap)_+_var(--_avatar-gap))_*_0.3))]",
        "[--_avatar-cut-r:calc(var(--_avatar-size)_/_2_+_var(--_avatar-gap))]",
        "[&>[data-slot=avatar]:not(:first-child)]:ml-[calc(var(--_avatar-overlap)_*_-1)]",
        topmost === "left" ? LEFT_TOPMOST_CLASSES : RIGHT_TOPMOST_CLASSES,
        hover === "lift" && HOVER_LIFT_CLASSES,
        hover === "expand" && HOVER_EXPAND_CLASSES,
        size && AVATAR_SIZE_CLASSES[size],
        className
      )}
      data-hover={hover}
      data-slot="avatar-stack"
      data-topmost={topmost}
      role="group"
      {...props}
    >
      {visibleItems}
      {overflowCount > 0 ? (
        <AvatarStackCount
          count={overflowCount}
          formatLabel={formatOverflowLabel}
        />
      ) : null}
    </div>
  )
}
