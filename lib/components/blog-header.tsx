"use client"

import { Search, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"

interface BlogHeaderProps {
  isAdmin?: boolean
  onAdminClick?: () => void
}

export function BlogHeader({ isAdmin = false, onAdminClick }: BlogHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="glass-nav sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-foreground">Pravaha</span>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="search"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-card border-glass-border focus:border-primary/50 focus:shadow-lg transition-all duration-300"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Mobile search button */}
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-accent/50 transition-colors">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>

            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAdminClick}
                className="hidden sm:flex items-center gap-2 glass-card border-glass-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-transparent"
              >
                <User className="h-4 w-4" />
                Admin
              </Button>
            )}

            {/* Mobile menu */}
            <Button variant="ghost" size="icon" className="sm:hidden hover:bg-accent/50 transition-colors">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>

        <div className="md:hidden mt-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="search"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-card border-glass-border focus:border-primary/50 focus:shadow-lg transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
