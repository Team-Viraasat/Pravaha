"use client"

import { BlogHeader } from "@/components/blog-header"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Default posts (later we’ll hook to DB)
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
]

export default function HomePage() {
  const router = useRouter()
  const [isAdmin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [typedText, setTypedText] = useState("")

  // Typing effect for BlogSpace
  useEffect(() => {
    const fullText = "BlogSpace"
    let i = 0
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1))
      i++
      if (i === fullText.length) clearInterval(interval)
    }, 120)
    return () => clearInterval(interval)
  }, [])

  const handleViewPost = (slug: string) => {
    setIsLoading(true)
    setTimeout(() => {
      router.push(`/post/${slug}`)
    }, 200)
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
        {/* Hero */}
        <section className="text-center py-12 mb-12 bg-gradient-to-b from-indigo-50 to-transparent rounded-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              {typedText}
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover insightful articles, tutorials, and stories from developers and creators around the world.
          </p>
        </section>

        {/* Posts */}
        <section className="py-12 bg-gradient-to-b from-purple-50 to-transparent rounded-2xl">
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
                className="animate-in slide-in-from-bottom-4 duration-500 rounded-xl shadow-lg 
                           hover:shadow-indigo-300/40 transition-all border border-indigo-100/50 
                           bg-white/70 backdrop-blur-md"
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

        {/* Load more */}
        <section className="text-center py-12">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="glass-card px-8 py-3 rounded-lg text-foreground 
                       hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 
                       hover:text-white hover:shadow-xl transition-all duration-300 
                       hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed 
                       border border-primary/20 hover:border-primary/50"
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
