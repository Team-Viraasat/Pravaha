"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// --- Mock Components (to resolve build errors) ---

const BlogHeader = ({ isAdmin, onUserClick, onToggleTheme, currentTheme, onLogout, onWritePost }) => {
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
          <button
            onClick={onWritePost}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10,9 9,9 8,9" />
            </svg>
            Write Post
          </button>
          <button onClick={onUserClick} className="font-semibold hover:text-primary transition-colors">
            Dashboard
          </button>
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
            aria-label="Toggle theme"
          >
            {currentTheme === "light" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m4.93 17.66 1.41-1.41" />
                <path d="m17.66 4.93 1.41-1.41" />
              </svg>
            )}
          </button>
          <button onClick={onLogout} className="font-semibold hover:text-destructive transition-colors">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

const PostCard = ({ post, onViewPost, user }) => {
  const [upvotes, setUpvotes] = useState(post.upvotes || 0)
  const [downvotes, setDownvotes] = useState(post.downvotes || 0)
  const [userVote, setUserVote] = useState(null)
  const [isVoting, setIsVoting] = useState(false)

  useEffect(() => {
    // Fetch user's current vote for this post
    const fetchUserVote = async () => {
      try {
        const response = await fetch(`/api/posts/${post.slug}/vote?userId=${user.id}`)
        const data = await response.json()
        setUserVote(data.userVote)
        setUpvotes(data.upvotes)
        setDownvotes(data.downvotes)
      } catch (error) {
        console.error("Failed to fetch vote data:", error)
      }
    }

    if (user && post.slug) {
      fetchUserVote()
    }
  }, [post.slug, user])

  const handleVote = async (voteType) => {
    if (isVoting) return

    setIsVoting(true)
    try {
      const response = await fetch(`/api/posts/${post.slug}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, voteType }),
      })

      const data = await response.json()
      if (response.ok) {
        setUpvotes(data.post.upvotes)
        setDownvotes(data.post.downvotes)
        setUserVote(data.userVote)
      }
    } catch (error) {
      console.error("Failed to vote:", error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div>
        <span className="text-xs font-semibold uppercase text-primary bg-primary/10 px-2 py-1 rounded-full">
          {post.category}
        </span>
      </div>
      <h3 className="text-xl font-bold my-3 text-foreground">{post.title}</h3>
      <p className="text-muted-foreground text-sm flex-grow">{post.excerpt}</p>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleVote("upvote")}
            disabled={isVoting}
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
              userVote === "upvote"
                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={userVote === "upvote" ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
            <span className="text-sm font-medium">{upvotes}</span>
          </button>

          <button
            onClick={() => handleVote("downvote")}
            disabled={isVoting}
            className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all ${
              userVote === "downvote"
                ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={userVote === "downvote" ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
            <span className="text-sm font-medium">{downvotes}</span>
          </button>
        </div>

        <button onClick={() => onViewPost(post.slug)} className="text-sm font-semibold text-primary hover:underline">
          View Post &rarr;
        </button>
      </div>

      <div className="text-xs text-muted-foreground mt-2">
        <span>{post.author}</span> &bull; <span>{post.date}</span> &bull; <span>{post.readTime}</span>
      </div>
    </div>
  )
}

// --- Main Page Component ---

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [theme, setTheme] = useState("light")
  const [posts, setPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsAdmin(userData.username === "admin")
        setAuthLoading(false)
      } else {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

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

  // Fetch posts from database
  useEffect(() => {
    if (!user) return

    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts")
        const data = await response.json()
        setPosts(data.posts)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
      } finally {
        setPostsLoading(false)
      }
    }

    fetchPosts()
  }, [user])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleViewPost = (slug) => {
    setIsLoading(true)
    setTimeout(() => {
      router.push(`/post/${slug}`)
      setIsLoading(false)
    }, 200)
  }

  const handleUserClick = () => {
    router.push("/user")
  }

  const handleAdminClick = () => {
    router.push("/admin")
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  const handleLoadMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleWritePost = () => {
    router.push("/add-post")
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="blogspace-loader">Loading BlogSpace...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen page-transition">
      <BlogHeader
        isAdmin={isAdmin}
        onUserClick={handleUserClick}
        onToggleTheme={toggleTheme}
        currentTheme={theme}
        onLogout={handleLogout}
        onWritePost={handleWritePost}
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
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Discover insightful articles, tutorials, and stories from developers and creators around the world.
          </p>
          <button
            onClick={handleWritePost}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10,9 9,9 8,9" />
            </svg>
            Start Writing Your Story
          </button>
        </section>

        {/* Posts */}
        <section className="py-12 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Latest Posts</h2>
            <div className="glass-card px-3 py-1 rounded-full">
              <span className="text-sm text-muted-foreground">
                {postsLoading ? "Loading..." : `${posts.length} articles`}
              </span>
            </div>
          </div>

          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded w-20 mb-4"></div>
                  <div className="h-6 bg-muted rounded mb-3"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-muted rounded w-32"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className="glass-card animate-in slide-in-from-bottom-4 duration-500 rounded-2xl 
                             overflow-hidden"
                  style={{ animationDelay: `${index * 100 + 600}ms` }}
                >
                  <PostCard post={post} onViewPost={handleViewPost} user={user} />
                </div>
              ))}
            </div>
          )}
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
