import type { ReactNode } from "react"
import Link from "next/link"

import type { TocItem } from "@/lib/catalog"
import { Elevated } from "@/lib/elevated"
import { DocsArticleHeader } from "@/components/site/docs-article-header"
import { DocsStickyTitle } from "@/components/site/docs-sticky-title"
import { DocsToc } from "@/components/site/docs-toc"
import { cn } from "@/lib/utils"

function ArticleRails() {
  return (
    <>
      <div
        aria-hidden="true"
        className="article-rail pointer-events-none absolute -top-10 -bottom-10 left-0 -z-30 hidden w-px lg:-top-16 lg:-bottom-16 lg:block"
      />
      <div
        aria-hidden="true"
        className="article-rail pointer-events-none absolute -top-10 -bottom-10 right-0 -z-30 hidden w-px lg:-top-16 lg:-bottom-16 lg:block"
      />
    </>
  )
}

export function DocsArticle({
  title,
  lede,
  toc,
  wide = false,
  children,
}: {
  title: string
  lede?: string
  toc: TocItem[]
  /** Wider column for galleries and dense layouts. */
  wide?: boolean
  children: ReactNode
}) {
  return (
    <>
      <article
        className={cn(
          "relative isolate mx-auto flex min-h-[calc(100svh-5rem)] min-w-0 flex-col gap-12 px-8 lg:min-h-[calc(100svh-8rem)] lg:px-10",
          wide ? "max-w-4xl" : "max-w-2xl",
        )}
      >
        <ArticleRails />
        <DocsArticleHeader lede={lede} title={title} toc={toc} />
        {children}
      </article>
      <DocsToc items={toc} />
    </>
  )
}

export function DocsSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section
      className="flex flex-col gap-4 scroll-mt-28 lg:scroll-mt-24"
      id={id}
    >
      <DocsStickyTitle as="h2">{title}</DocsStickyTitle>
      {children}
    </section>
  )
}

export function DocsSubsection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section
      className="flex flex-col gap-4 scroll-mt-28 lg:scroll-mt-24"
      id={id}
    >
      <h3 className="font-display text-xl">{title}</h3>
      {children}
    </section>
  )
}

export function DocsExample({
  children,
  caption,
}: {
  children: ReactNode
  caption?: string
}) {
  return (
    <figure className="flex flex-col gap-3">
      <Elevated
        className="flex min-h-80 items-center justify-center rounded-2xl px-8 py-12"
        offset={2}
        shadowLevel={2}
      >
        {children}
      </Elevated>
      {caption ? (
        <figcaption className="text-center text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

export function DocsProse({ children }: { children: ReactNode }) {
  return (
    <p className="text-base text-foreground/80">{children}</p>
  )
}

export function DocsLinkList({
  items,
}: {
  items: { href: string; title: string; description?: string }[]
}) {
  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            className="flex flex-col gap-1 py-3"
            href={item.href}
          >
            <span className="text-sm font-medium">{item.title}</span>
            {item.description ? (
              <span className="text-sm text-muted-foreground">
                {item.description}
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function DocsTable({
  headers,
  rows,
}: {
  headers: string[]
  rows: ReactNode[][]
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            {headers.map((header) => (
              <th className="py-2 pr-4 font-medium" key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr className="border-b border-border/60" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  className="py-2.5 pr-4 align-top text-foreground/80"
                  key={cellIndex}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
