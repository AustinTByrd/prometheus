import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import localFont from "next/font/local"

import { Providers } from "@/components/providers"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
  title: "My app",
  description: "Built with Prometheus.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className={`${geistSans.variable} ${geistMono.variable} ${geistSerif.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-svh antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
