"use client"

import type React from "react"
import { Clock, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PostCardProps {
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  slug: string
  onViewPost?: (slug: string) => void
}

export function PostCard({
  title,
  excerpt,
  category,
  author,
  date,
  readTime,
  slug,
  onViewPost,
}: PostCardProps) {
  return (
    <article className="glass-card rounded-xl p-6 hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 group cursor-pointer">
      <div className="space-y-4">
        {/* Category badge */}
        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary hover:from-primary/30 hover:to-primary/20 transition-all duration-300 border border-primary/20"
          >
            {category}
          </Badge>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-all duration-300 group-hover:translate-x-1">
          {title}
        </h2>

        {/* Excerpt */}
        <p className="text-muted-foreground leading-relaxed line-clamp-2 group-hover:text-foreground/80 transition-colors duration-300">
          {excerpt}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 group-hover:border-primary/30 transition-colors duration-300">
          <div className="flex items-center gap-4 text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{readTime}</span>
            </div>
            <span>{date}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewPost?.(slug)}
            className="text-primary hover:text-primary-foreground hover:bg-primary group-hover:translate-x-2 transition-all duration-300 hover:shadow-lg"
          >
            View
            <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </article>
  )
}
