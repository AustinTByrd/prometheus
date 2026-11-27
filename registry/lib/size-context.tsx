// @prometheus 0.2.0
"use client"

import * as React from "react"

export type SizeVariant = "default" | "compact"

/** iOS Safari zooms inputs under 16px on coarse pointers. */
export const fieldTouchClass = "pointer-coarse:text-[16px]"

type SizeContextValue = {
  size: SizeVariant
  setSize: (size: SizeVariant) => void
}

const SizeContext = React.createContext<SizeContextValue | null>(null)

/** Resolve size: explicit prop → provider → default. */
export function useSizeVariant(override?: SizeVariant | null): SizeVariant {
  const ctx = React.useContext(SizeContext)
  return override ?? ctx?.size ?? "default"
}

export function useSizeContext() {
  const ctx = React.useContext(SizeContext)
  if (!ctx) throw new Error("useSizeContext must be used within a SizeProvider")
  return ctx
}

export function SizeProvider({
  children,
  size,
  defaultSize = "default",
}: {
  children: React.ReactNode
  size?: SizeVariant
  defaultSize?: SizeVariant
}) {
  const [internalSize, setInternalSize] = React.useState<SizeVariant>(defaultSize)
  const isControlled = size !== undefined
  const resolved = size ?? internalSize

  const setSize = React.useCallback(
    (next: SizeVariant) => {
      if (isControlled) return
      setInternalSize(next)
    },
    [isControlled]
  )

  const value = React.useMemo(
    () => ({ size: resolved, setSize }),
    [resolved, setSize]
  )

  return <SizeContext.Provider value={value}>{children}</SizeContext.Provider>
}
