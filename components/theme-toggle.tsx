"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const current =
    theme === "system" ? (resolvedTheme as "light" | "dark" | undefined) : (theme as "light" | "dark" | undefined)

  const toggleTheme = () => {
    const next = current === "light" ? "dark" : "light"
    setTheme(next)
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="relative overflow-hidden group">
      <Sun
        className={`h-4 w-4 transition-all duration-300 ${current === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"}`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-300 ${current === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
