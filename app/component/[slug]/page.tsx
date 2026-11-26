import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

import { ComponentDemo } from "@/app/demos/component-demo"
import { CommandBlock } from "@/components/site/command-block"
import { CopyForAgents } from "@/components/site/copy-for-agents"
import {
  catalog,
  getAdjacentCatalogItems,
  getCatalogItem,
  installCommand,
  namespaceInstallCommand,
} from "@/lib/catalog"
import { getBuiltRegistryItem } from "@/lib/registry-meta"

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

  const meta = getBuiltRegistryItem(item.slug)
  const { prev, next } = getAdjacentCatalogItems(item.slug)

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-12 sm:py-16">
      <div className="flex flex-col gap-4">
        <Link
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          href="/#components"
        >
          <ArrowLeftIcon className="size-3.5" />
          Components
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">{item.category}</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {item.title}
            </h1>
            <p className="max-w-2xl text-muted-foreground">{item.description}</p>
          </div>
          <CopyForAgents
            description={item.description}
            slug={item.slug}
            usage={item.usage}
          />
        </div>
      </div>

      <section className="flex flex-col gap-2">
        <CommandBlock code={installCommand(item.slug)} />
        <p className="text-xs text-muted-foreground">
          After running <code className="font-mono text-foreground">init</code>{" "}
          with <code className="font-mono text-foreground">base</code>, you can
          also install via{" "}
          <code className="font-mono text-foreground">
            {namespaceInstallCommand(item.slug)}
          </code>
          .
        </p>
      </section>

      <section className="flex min-h-72 flex-col items-center justify-center rounded-xl border bg-card p-8">
        <ComponentDemo slug={item.slug} />
      </section>

      <section className="flex flex-col gap-3" id="usage">
        <h2 className="text-lg font-semibold tracking-tight">Usage</h2>
        <CommandBlock code={item.usage} />
      </section>

      {meta ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight">
              Registry details
            </h2>
            <a
              className="font-mono text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
              href={`/r/${item.slug}.json`}
            >
              /r/{item.slug}.json
            </a>
          </div>
          <div className="grid gap-4 rounded-xl border bg-card p-5 text-sm sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Installs to
              </span>
              <ul className="flex flex-col gap-1 font-mono text-xs">
                {(meta.files ?? []).map((file) => (
                  <li key={file.path}>{file.target ?? file.path}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Dependencies
              </span>
              {meta.registryDependencies?.length || meta.dependencies?.length ? (
                <ul className="flex flex-col gap-1 font-mono text-xs">
                  {(meta.registryDependencies ?? []).map((dep) => (
                    <li key={dep}>{dep}</li>
                  ))}
                  {(meta.dependencies ?? []).map((dep) => (
                    <li className="text-muted-foreground" key={dep}>
                      npm: {dep}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">None</p>
              )}
            </div>
          </div>
        </section>
      ) : null}

      <nav className="flex items-center justify-between gap-4 border-t pt-6 text-sm">
        {prev ? (
          <Link
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            href={`/component/${prev.slug}`}
          >
            <ArrowLeftIcon className="size-4" />
            <span>{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            href={`/component/${next.slug}`}
          >
            <span>{next.title}</span>
            <ArrowRightIcon className="size-4" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  )
}
