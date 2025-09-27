import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

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
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense
            fallback={
              <div className="min-h-screen bg-background flex items-center justify-center">
                {/* Pravaha typing loader */}
                <div className="blogspace-loader">Loading Pravaha...</div>
              </div>
            }
          >
            <div className="min-h-screen bg-background transition-colors duration-300">{children}</div>
          </Suspense>
        </ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
