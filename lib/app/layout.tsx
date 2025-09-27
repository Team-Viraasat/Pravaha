import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pravaha - Modern Blog Platform",
  description: "A clean, modern blog platform for sharing ideas and stories",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense
          fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="glass-card p-8 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-foreground">Loading...</span>
                </div>
              </div>
            </div>
          }
        >
          <div className="min-h-screen bg-background transition-colors duration-300">{children}</div>
        </Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
