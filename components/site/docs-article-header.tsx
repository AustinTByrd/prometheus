import { DocsStickyTitle } from "@/components/site/docs-sticky-title"

export function DocsArticleHeader({
  title,
  lede,
}: {
  title: string
  lede?: string
  /** Kept for call-site compatibility; sticky titles no longer need the toc. */
  toc?: unknown
}) {
  return (
    <header className="flex flex-col gap-3" id="overview">
      <DocsStickyTitle>{title}</DocsStickyTitle>
      {lede ? (
        <p className="text-lg text-muted-foreground italic">{lede}</p>
      ) : null}
    </header>
  )
}
