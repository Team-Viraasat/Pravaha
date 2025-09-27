"use client"

import React, { useState, useEffect } from "react"
// useRouter and component paths are mocked as the build environment cannot resolve them.
// Replace these with your actual components and routing logic.

// --- Mock Components (to resolve build errors) ---

const BlogHeader = ({ isAdmin, onAdminClick, onToggleTheme, currentTheme }) => {
  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4 text-foreground">
        <h1 className="text-2xl font-bold">BlogSpace</h1>
        <div className="flex items-center gap-4">
          <input
            type="search"
            placeholder="Search posts..."
            className="hidden md:block glass-card rounded-full px-4 py-2 bg-transparent border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all"
          />
          {isAdmin && (
            <button
              onClick={onAdminClick}
              className="font-semibold hover:text-primary transition-colors"
            >
              Admin
            </button>
          )}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
            aria-label="Toggle theme"
          >
            {currentTheme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.93 17.66 1.41-1.41"/><path d="m17.66 4.93 1.41-1.41"/></svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

const PostCard = ({ title, excerpt, category, author, date, readTime, slug, onViewPost }) => {
  return (
    <div className="p-6 h-full flex flex-col">
      <div>
        <span className="text-xs font-semibold uppercase text-primary bg-primary/10 px-2 py-1 rounded-full">{category}</span>
      </div>
      <h3 className="text-xl font-bold my-3 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm flex-grow">{excerpt}</p>
      <div className="text-xs text-muted-foreground mt-4">
        <span>{author}</span> &bull; <span>{date}</span> &bull; <span>{readTime}</span>
      </div>
      <button onClick={() => onViewPost(slug)} className="text-sm font-semibold text-primary mt-4 self-start hover:underline">
        View Post &rarr;
      </button>
    </div>
  )
}

// --- Mock useRouter hook ---
const useRouter = () => {
  return {
    push: (path) => {
      console.log(`Navigating to: ${path}`)
      // In a real Next.js app, this would change the URL.
      // Since this environment doesn't support it, we'll simulate a page load delay.
      alert(`Navigating to ${path}. This is a mock navigation.`);
    },
  }
}


// --- Main Page Component ---

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
  const [theme, setTheme] = useState("light")

  // Effect for theme switching
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

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

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleViewPost = (slug) => {
    setIsLoading(true)
    setTimeout(() => {
      router.push(`/post/${slug}`)
      setIsLoading(false)
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
      <BlogHeader 
        isAdmin={isAdmin} 
        onAdminClick={handleAdminClick} 
        onToggleTheme={toggleTheme}
        currentTheme={theme}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <section className="text-center py-12 mb-12 rounded-2xl">
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
        <section className="py-12 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Latest Posts</h2>
            <div className="glass-card px-3 py-1 rounded-full">
              <span className="text-sm text-muted-foreground">{mockPosts.length} articles</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockPosts.map((post, index) => (
              <div
                key={post.id}
                className="glass-card animate-in slide-in-from-bottom-4 duration-500 rounded-2xl 
                           overflow-hidden"
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
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="glass-card px-8 py-3 rounded-lg text-foreground 
                       font-semibold
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
          </button>
        </section>
      </main>
    </div>
  )
}

