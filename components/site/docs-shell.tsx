"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Bars3Icon } from "@heroicons/react/16/solid"

import { DocsNav } from "@/components/site/docs-nav"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function DocsMobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="flex h-12 items-center gap-2 px-4 lg:hidden">
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger render={<Button size="icon-sm" variant="ghost" />}>
          <Bars3Icon />
          <span className="sr-only">Open navigation</span>
        </SheetTrigger>
        <SheetContent className="w-[240px] p-6 sm:max-w-[240px]" side="left">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <DocsNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <span className="text-sm font-medium">Prometheus</span>
    </header>
  )
}

export function DocsSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-[240px] overflow-y-auto py-10 pr-4 pl-8 lg:block">
      <DocsNav />
    </aside>
  )
}
