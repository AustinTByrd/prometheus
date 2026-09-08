import type * as React from "react"

export function ConditionalWrap({
  condition,
  wrap,
  elseWrap,
  children,
}: {
  condition: boolean
  wrap: (children: React.ReactNode) => React.ReactElement
  elseWrap?: (children: React.ReactNode) => React.ReactElement
  children: React.ReactNode
}) {
  if (condition) {
    return wrap(children)
  }

  if (elseWrap) {
    return elseWrap(children)
  }

  return children
}
