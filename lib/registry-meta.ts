import fs from "node:fs"
import path from "node:path"

export type BuiltRegistryFile = {
  path: string
  type: string
  target?: string
  content?: string
}

export type BuiltRegistryItem = {
  name: string
  type: string
  title?: string
  description?: string
  dependencies?: string[]
  devDependencies?: string[]
  registryDependencies?: string[]
  files?: BuiltRegistryFile[]
}

export function getBuiltRegistryItem(slug: string): BuiltRegistryItem | null {
  const filePath = path.join(process.cwd(), "public", "r", `${slug}.json`)
  if (!fs.existsSync(filePath)) return null

  try {
    const raw = fs.readFileSync(filePath, "utf8")
    return JSON.parse(raw) as BuiltRegistryItem
  } catch {
    return null
  }
}
