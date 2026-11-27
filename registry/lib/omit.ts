// @prometheus 0.2.0

/** Shallow copy of `object` without `keys`. */
export function omit<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[]
): Omit<T, K> {
  const rest = { ...object }
  for (const key of keys) delete rest[key]
  return rest
}
