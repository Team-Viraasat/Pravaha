"use client"

import { BlogHeader } from "@/components/blog-header"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Mock data for demonstration
const mockPosts = [
  {
    id: "1",
    title: "Building Modern Web Applications with Next.js",
    excerpt:
      "Explore the latest features and best practices for creating scalable web applications using Next.js 14 and React Server Components.",
    category: "Development",
    author: "Sarah Chen",
    date: "Dec 15, 2024",
    readTime: "8 min read",
    slug: "building-modern-web-apps-nextjs",
  },
  {
    id: "2",
    title: "The Future of AI in Web Development",
    excerpt:
      "How artificial intelligence is transforming the way we build, test, and deploy web applications in 2024 and beyond.",
    category: "AI & Tech",
    author: "Marcus Johnson",
    date: "Dec 12, 2024",
    readTime: "6 min read",
    slug: "future-ai-web-development",
  },
  {
    id: "3",
    title: "Mastering CSS Grid and Flexbox",
    excerpt: "A comprehensive guide to modern CSS layout techniques that every frontend developer should know.",
    category: "CSS",
    author: "Elena Rodriguez",
    date: "Dec 10, 2024",
    readTime: "12 min read",
    slug: "mastering-css-grid-flexbox",
  },
  {
    id: "4",
    title: "Database Design Patterns for Scale",
    excerpt:
      "Learn essential database design patterns and optimization techniques for building applications that can handle millions of users.",
    category: "Backend",
    author: "David Kim",
    date: "Dec 8, 2024",
    readTime: "15 min read",
    slug: "database-design-patterns-scale",
  },
  {
    id: "5",
    title: "TypeScript Best Practices in 2024",
    excerpt: "Advanced TypeScript techniques and patterns that will make your code more maintainable and type-safe.",
    category: "TypeScript",
    author: "Alex Thompson",
    date: "Dec 5, 2024",
    readTime: "10 min read",
    slug: "typescript-best-practices-2024",
  },
  {
    id: "6",
    title: "Building Accessible User Interfaces",
    excerpt:
      "Essential accessibility principles and practical techniques for creating inclusive web experiences for all users.",
    category: "UX/UI",
    author: "Maya Patel",
    date: "Dec 3, 2024",
    readTime: "9 min read",
    slug: "building-accessible-user-interfaces",
  },
]

export default function HomePage() {
  const router = useRouter()
  const [isAdmin] = useState(true) // Mock admin status
  const [isLoading, setIsLoading] = useState(false)

  const handleViewPost = (slug: string) => {
    setIsLoading(true)
    setTimeout(() => {
      router.push(`/post/${slug}`)
    }, 150) // Small delay for smooth transition
  }

  const handleAdminClick = () => {
    router.push("/admin")
  }

  const handleLoadMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen page-transition">
      <BlogHeader isAdmin={isAdmin} onAdminClick={handleAdminClick} />

      <main className="container mx-auto px-4 py-8">
        <section className="text-center py-12 mb-12 animate-in fade-in duration-700">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-pulse">
              BlogSpace
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty animate-in slide-in-from-bottom-4 duration-700 delay-200">
            Discover insightful articles, tutorials, and stories from developers and creators around the world.
          </p>
        </section>

        <section className="animate-in slide-in-from-bottom-6 duration-700 delay-400">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Latest Posts</h2>
            <div className="glass-card px-3 py-1 rounded-full">
              <span className="text-sm text-muted-foreground">{mockPosts.length} articles</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPosts.map((post, index) => (
              <div
                key={post.id}
                className="animate-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100 + 600}ms` }}
              >
                <PostCard
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category}
                  author={post.author}
                  date={post.date}
                  readTime={post.readTime}
                  slug={post.slug}
                  onViewPost={handleViewPost}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="text-center py-12 animate-in fade-in duration-700 delay-1000">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="glass-card px-8 py-3 rounded-lg text-foreground hover:bg-primary hover:text-primary-foreground hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border border-primary/20 hover:border-primary/50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Loading...
              </div>
            ) : (
              "Load More Posts"
            )}
          </Button>
        </section>
      </main>
    </div>
  )
}
