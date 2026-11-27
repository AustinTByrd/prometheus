import type { Metadata } from "next"

import { AppShellDemo } from "@/app/demos/app-shell-docs"

export const metadata: Metadata = {
  title: "App shell preview — Prometheus",
}

export default function AppShellPreviewPage() {
  return <AppShellDemo />
}
