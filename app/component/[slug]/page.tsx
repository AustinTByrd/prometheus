import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { ComponentDemo } from "@/app/demos/component-demo"
import { CopyForAgents } from "@/components/site/copy-for-agents"
import { catalog, getCatalogItem, installCommand } from "@/lib/catalog"

export function generateStaticParams() {
  return catalog.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const item = getCatalogItem(slug)
  if (!item) return {}
  return { title: `${item.title} — Prometheus`, description: item.description }
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const item = getCatalogItem(slug)
  if (!item) notFound()

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">{item.category}</p>
          <h1 className="text-3xl font-semibold tracking-tight">{item.title}</h1>
          <p className="max-w-2xl text-muted-foreground">{item.description}</p>
        </div>
        <CopyForAgents description={item.description} slug={item.slug} />
      </div>

      <pre className="overflow-x-auto rounded-lg border bg-card px-4 py-3 font-mono text-xs">
        {installCommand(item.slug)}
      </pre>

      <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border bg-card p-8">
        <ComponentDemo slug={item.slug} />
      </div>
    </main>
  )
}
