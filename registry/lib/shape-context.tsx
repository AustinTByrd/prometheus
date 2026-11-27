// @prometheus 0.2.0
"use client"

import * as React from "react"

export type ShapeVariant = "sharp" | "rounded" | "pill"

export type ShapeClasses = {
  variant: ShapeVariant
  item: string
  bg: string
  focusRing: string
  mergedBg: string
  container: string
  button: string
  input: string
  bgRadius: number
  containerRadius: number
  mergedRadius: number
}

export const shapeMap: Record<ShapeVariant, ShapeClasses> = {
  pill: {
    variant: "pill",
    item: "rounded-[20px]",
    bg: "rounded-[20px]",
    focusRing: "rounded-[22px]",
    mergedBg: "rounded-2xl",
    container: "rounded-3xl",
    button: "rounded-[20px]",
    input: "rounded-[20px]",
    bgRadius: 20,
    containerRadius: 24,
    mergedRadius: 16,
  },
  rounded: {
    variant: "rounded",
    item: "rounded-lg",
    bg: "rounded-lg",
    focusRing: "rounded-[10px]",
    mergedBg: "rounded-lg",
    container: "rounded-xl",
    button: "rounded-lg",
    input: "rounded-lg",
    bgRadius: 8,
    containerRadius: 12,
    mergedRadius: 8,
  },
  sharp: {
    variant: "sharp",
    item: "rounded-[1px]",
    bg: "rounded-[1px]",
    focusRing: "rounded-[3px]",
    mergedBg: "rounded-[1px]",
    container: "rounded-[1px]",
    button: "rounded-[1px]",
    input: "rounded-[1px]",
    bgRadius: 1,
    containerRadius: 1,
    mergedRadius: 1,
  },
}

type ShapeContextValue = {
  shape: ShapeVariant
  setShape: (shape: ShapeVariant) => void
  classes: ShapeClasses
}

const ShapeContext = React.createContext<ShapeContextValue | null>(null)

export function useShape(): ShapeClasses {
  const ctx = React.useContext(ShapeContext)
  if (!ctx) return shapeMap.rounded
  return ctx.classes
}

export function useShapeContext() {
  const ctx = React.useContext(ShapeContext)
  if (!ctx) throw new Error("useShapeContext must be used within a ShapeProvider")
  return ctx
}

export function ShapeProvider({
  children,
  shape,
  defaultShape = "rounded",
}: {
  children: React.ReactNode
  shape?: ShapeVariant
  defaultShape?: ShapeVariant
}) {
  const [internal, setInternal] = React.useState<ShapeVariant>(defaultShape)
  const isControlled = shape !== undefined
  const resolved = shape ?? internal

  const setShape = React.useCallback(
    (next: ShapeVariant) => {
      if (isControlled) return
      setInternal(next)
    },
    [isControlled]
  )

  const value = React.useMemo(
    () => ({ shape: resolved, setShape, classes: shapeMap[resolved] }),
    [resolved, setShape]
  )

  return (
    <ShapeContext.Provider value={value}>{children}</ShapeContext.Provider>
  )
}

export function nestedRadius(
  outerRadius: number,
  inset: number,
  borderWidth = 0
) {
  return Math.max(0, outerRadius - inset - borderWidth)
}
