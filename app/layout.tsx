import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import localFont from "next/font/local"

import { PrometheusProvider } from "@/components/prometheus-provider"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const geistSerif = localFont({
  src: "../node_modules/geist/dist/fonts/geist-serif/GeistSerifVF.woff2",
  variable: "--font-geist-serif",
  weight: "100 900",
  fallback: ["Times New Roman", "Times", "serif"],
  adjustFontFallback: "Times New Roman",
})

export const metadata: Metadata = {
  title: "Prometheus",
  description:
    "A personal design system as a shadcn registry. Your components. Your defaults. Every project.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} ${geistSerif.variable} ${inter.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-svh antialiased">
        <PrometheusProvider defaultTheme="system" enableSystem>
          {children}
        </PrometheusProvider>
      </body>
    </html>
  )
}
