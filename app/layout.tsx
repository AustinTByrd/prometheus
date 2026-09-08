import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Geist, Geist_Mono } from "next/font/google"

import { PrometheusProvider } from "@/components/prometheus-provider"
import { SiteHeader } from "@/components/site/site-header"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Prometheus",
  description:
    "A personal shadcn registry. Your components. Your defaults. Every project.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      className={`dark ${geistSans.variable} ${geistMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-svh antialiased">
        <PrometheusProvider>
          <SiteHeader />
          {children}
        </PrometheusProvider>
      </body>
    </html>
  )
}
