"use client"

import { demos } from "@/app/demos/component-demos"

export function ComponentDemo({ slug }: { slug: string }) {
  const Demo = demos[slug]

  if (!Demo) {
    return (
      <p className="text-sm text-muted-foreground">Setup component — see the guide.</p>
    )
  }

  return <Demo />
}
