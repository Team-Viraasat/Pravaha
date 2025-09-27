"use client"

import { BlogHeader } from "@/components/blog-header"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import TypingText from "@/components/TypingText"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [isAdmin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState<any[]>([])

  // Fetch posts from in-memory DB API
  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.posts)) setPosts(data.posts)
      })
      .catch(() => setPosts([]))
  }, [])

  const handleViewPost = (slug: string) => {
    setIsLoading(true)
    setTimeout(() => {
      router.push(`/post/${slug}`)
    }, 150)
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
        <section className="text-center py-12 mb-12 animate-in fade-in duration-700">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Welcome to <TypingText text="BlogSpace" />
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty animate-in slide-in-from-bottom-4 duration-700 delay-200">
            Discover insightful articles, tutorials, and stories from developers and creators around the world.
          </p>
        </section>

        {/* Posts */}
        <section className="animate-in slide-in-from-bottom-6 duration-700 delay-400">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Latest Posts</h2>
            <div className="glass-card px-3 py-1 rounded-full">
              <span className="text-sm text-muted-foreground">{posts.length} articles</span>
            </div>
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">No posts yet. Login and add one!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100 + 600}ms` }}
                >
                  <PostCard
                    title={post.title}
                    excerpt={post.excerpt || (post.content ? post.content.slice(0, 120) + "…" : "")}
                    category={post.category || "General"}
                    author={post.author}
                    date={post.date}
                    readTime={post.readTime || "—"}
                    slug={post.slug || String(post.id)}
                    onViewPost={handleViewPost}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Load more */}
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
