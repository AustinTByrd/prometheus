import type { TocItem } from "@/lib/catalog"
import { MakeThemYours } from "@/components/site/make-them-yours"
import { cn } from "@/lib/utils"

function TocList({ items, nested }: { items: TocItem[]; nested?: boolean }) {
  return (
    <ul className={cn("flex flex-col", nested && "ml-3")}>
      {items.map((item) => (
        <li key={item.id}>
          <a
            className="block rounded-sm px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            href={`#${item.id}`}
          >
            {item.title}
          </a>
          {item.items?.length ? <TocList items={item.items} nested /> : null}
        </li>
      ))}
    </ul>
  )
}

export function DocsToc({ items }: { items: TocItem[] }) {
  return (
    <div className="fixed inset-y-0 right-0 z-20 hidden w-[280px] overflow-y-auto py-10 pr-6 pl-3 xl:block">
      <div className="flex flex-col gap-8">
        <MakeThemYours />
        {items.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">On this page</p>
            <TocList items={items} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
