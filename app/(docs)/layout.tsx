import type { ReactNode } from "react"
import { Suspense } from "react"

import { KitSettingsProvider } from "@/components/site/kit-settings-provider"
import { DocsMobileNav, DocsSidebar } from "@/components/site/docs-shell"

export default function DocsLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <KitSettingsProvider>
      <div className="min-h-svh">
        <Suspense fallback={null}>
          <DocsMobileNav />
        </Suspense>
        <Suspense fallback={null}>
          <DocsSidebar />
        </Suspense>
        <div className="min-w-0 px-6 py-10 lg:px-[288px] lg:py-16 xl:pr-[300px]">
          {children}
        </div>
      </div>
    </KitSettingsProvider>
  )
}
