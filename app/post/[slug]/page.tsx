"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, User, Share2, Bookmark, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { CommentSection } from "@/components/comment-section"

const BlogHeader = ({ isAdmin, onAdminClick, onToggleTheme, currentTheme, onLogout }) => {
  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4 text-foreground">
        <h1 className="text-2xl font-bold">Pravaha</h1>
        <div className="flex items-center gap-4">
          <input
            type="search"
            placeholder="Search posts..."
            className="hidden md:block glass-card rounded-full px-4 py-2 bg-transparent border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all"
          />
          {isAdmin && (
            <button onClick={onAdminClick} className="font-semibold hover:text-primary transition-colors">
              Admin
            </button>
          )}
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
                <path d="M20 12h2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
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

export default function PostPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [theme, setTheme] = useState("light")
  const [post, setPost] = useState(null)
  const [postLoading, setPostLoading] = useState(true)
  const [postError, setPostError] = useState(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(42)

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

  useEffect(() => {
    if (!user) return

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.slug}`)
        if (response.ok) {
          const data = await response.json()
          setPost(data.post)
        } else {
          setPostError("Post not found")
        }
      } catch (error) {
        setPostError("Failed to load post")
      } finally {
        setPostLoading(false)
      }
    }

    fetchPost()
  }, [params.slug, user])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const handleBack = () => {
    router.back()
  }

  const handleAdminClick = () => {
    router.push("/admin")
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="blogspace-loader">Loading Pravaha...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (postLoading) {
    return (
      <div className="min-h-screen page-transition">
        <BlogHeader
          isAdmin={isAdmin}
          onAdminClick={handleAdminClick}
          onToggleTheme={toggleTheme}
          currentTheme={theme}
          onLogout={handleLogout}
        />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="glass-card rounded-xl p-8 animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (postError || !post) {
    return (
      <div className="min-h-screen page-transition">
        <BlogHeader
          isAdmin={isAdmin}
          onAdminClick={handleAdminClick}
          onToggleTheme={toggleTheme}
          currentTheme={theme}
          onLogout={handleLogout}
        />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">{postError}</p>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to posts
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen page-transition">
      <BlogHeader
        isAdmin={isAdmin}
        onAdminClick={handleAdminClick}
        onToggleTheme={toggleTheme}
        currentTheme={theme}
        onLogout={handleLogout}
      />

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
                {post.category}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight text-balance animate-in slide-in-from-bottom-4 duration-700 delay-500">
              {post.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4 animate-in fade-in duration-700 delay-700">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
                <span>{post.date}</span>
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
              {post.content.split("\n").map((paragraph, index) => {
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
                if (paragraph.startsWith("```")) {
                  return (
                    <pre key={index} className="bg-muted p-4 rounded-lg overflow-x-auto">
                      <code>{paragraph.slice(3)}</code>
                    </pre>
                  )
                }
                return (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                )
              })}
            </div>
          </div>
        </article>

        <div className="animate-in slide-in-from-bottom-6 duration-700 delay-1300">
          <CommentSection slug={params.slug} />
        </div>
      </main>
    </div>
  )
}
