"use client"

import { BlogHeader } from "@/components/blog-header"
import { CommentSection } from "@/components/comment-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, User, Share2, Bookmark, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

// Mock post data
const mockPost = {
  title: "Building Modern Web Applications with Next.js",
  content: `
# Introduction

Next.js has revolutionized the way we build React applications by providing a comprehensive framework that handles routing, server-side rendering, and optimization out of the box. In this comprehensive guide, we'll explore the latest features and best practices for creating scalable web applications.

## Getting Started with Next.js 14

The latest version of Next.js introduces several groundbreaking features that make development faster and more efficient:

### App Router
The new App Router provides a more intuitive way to structure your application with file-based routing that supports layouts, loading states, and error boundaries.

### Server Components
React Server Components allow you to render components on the server, reducing the JavaScript bundle size and improving performance.

## Best Practices

Here are some essential best practices to follow when building with Next.js:

1. **Use TypeScript** - Type safety helps catch errors early and improves developer experience
2. **Optimize Images** - Use the built-in Image component for automatic optimization
3. **Implement Proper SEO** - Leverage metadata API for better search engine optimization
4. **Code Splitting** - Take advantage of automatic code splitting for better performance

## Performance Optimization

Performance is crucial for user experience. Here are key optimization strategies:

- Use dynamic imports for code splitting
- Implement proper caching strategies
- Optimize your bundle size
- Use the built-in analytics to monitor performance

## Conclusion

Next.js continues to evolve and provide developers with powerful tools to build modern web applications. By following these best practices and leveraging the framework's capabilities, you can create fast, scalable, and maintainable applications.
  `,
  category: "Development",
  author: "Sarah Chen",
  date: "Dec 15, 2024",
  readTime: "8 min read",
  tags: ["Next.js", "React", "Web Development", "JavaScript", "TypeScript"],
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [isAdmin] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(42)

  const handleBack = () => {
    router.back()
  }

  const handleAdminClick = () => {
    router.push("/admin")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockPost.title,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  return (
    <div className="min-h-screen page-transition">
      <BlogHeader isAdmin={isAdmin} onAdminClick={handleAdminClick} />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300 hover:translate-x-1 animate-in slide-in-from-left-4 duration-500"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to posts
        </Button>

        <article className="glass-card rounded-xl p-8 mb-8 animate-in slide-in-from-bottom-6 duration-700 delay-200">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4 animate-in slide-in-from-left-4 duration-500 delay-400">
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/20 hover:from-primary/30 hover:to-primary/20 transition-all duration-300"
              >
                {mockPost.category}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight text-balance animate-in slide-in-from-bottom-4 duration-700 delay-500">
              {mockPost.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4 animate-in fade-in duration-700 delay-700">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <User className="h-4 w-4" />
                  <span>{mockPost.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{mockPost.readTime}</span>
                </div>
                <span>{mockPost.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`transition-all duration-300 hover:scale-110 ${
                    isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""} transition-all duration-300`} />
                  <span className="ml-1 text-xs">{likeCount}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`transition-all duration-300 hover:scale-110 ${
                    isBookmarked ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""} transition-all duration-300`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          <div className="prose prose-invert prose-lg max-w-none animate-in slide-in-from-bottom-4 duration-700 delay-900">
            <div className="text-foreground leading-relaxed space-y-6 blog-content">
              {mockPost.content.split("\n").map((paragraph, index) => {
                if (paragraph.startsWith("# ")) {
                  return (
                    <h1
                      key={index}
                      className="text-2xl font-bold text-foreground mt-8 mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                    >
                      {paragraph.slice(2)}
                    </h1>
                  )
                }
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">
                      {paragraph.slice(3)}
                    </h2>
                  )
                }
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={index} className="text-lg font-medium text-foreground mt-4 mb-2">
                      {paragraph.slice(4)}
                    </h3>
                  )
                }
                if (paragraph.trim() === "") {
                  return <br key={index} />
                }
                return (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                )
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border/50 animate-in slide-in-from-bottom-4 duration-700 delay-1100">
            {mockPost.tags.map((tag, index) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </article>

        <div className="animate-in slide-in-from-bottom-6 duration-700 delay-1300">
          <CommentSection />
        </div>
      </main>
    </div>
  )
}
