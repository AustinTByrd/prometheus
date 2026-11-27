import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DocsArticle } from "@/components/site/docs-article"
import { MachineSections, statesToc } from "@/components/site/machine-sections"
import { catalog, dedicatedSlugs, getCatalogItem } from "@/lib/catalog"

export function generateStaticParams() {
  return catalog
    .filter((item) => !dedicatedSlugs.has(item.slug))
    .map((item) => ({ slug: item.slug }))
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

  const toc = [
    { id: "overview", title: "Overview" },
    ...statesToc(slug),
  ]

  return (
    <DocsArticle lede={item.description} title={item.title} toc={toc}>
      <MachineSections slug={slug} />
    </DocsArticle>
  )
}
