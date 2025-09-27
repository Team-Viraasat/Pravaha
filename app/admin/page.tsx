"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  username: string
  [key: string]: unknown
}

type Post = {
  id: string
  title: string
  slug: string
  excerpt?: string
  author?: string
  date?: string
  upvotes?: number
  downvotes?: number
}

export default function AdminModerationPanel() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])
  const [activeTab, setActiveTab] = useState<"posts" | "users" | "analytics">("posts")

  // Auth guard: only "admin" can access this page (basic client-side check)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user")
      if (!stored) {
        router.push("/login")
        return
      }
      const data = JSON.parse(stored) as User
      if (data?.username !== "admin") {
        router.push("/")
        return
      }
      setUser(data)
    } catch {
      router.push("/login")
      return
    } finally {
      setAuthLoading(false)
    }
  }, [router])

  // Load posts for moderation
  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const res = await fetch("/api/posts")
        const json = await res.json()
        // supports { posts: [...] } or direct array
        const items: Post[] = Array.isArray(json) ? json : (json?.posts ?? [])
        setPosts(items)
      } catch (err) {
        console.error("[v0] Failed to fetch posts:", err)
      }
    }
    load()
  }, [user])

  const handleDeletePost = async (postId: string) => {
    const ok = confirm("Are you sure you want to delete this post?")
    if (!ok) return
    try {
      // TODO: Implement delete in API when available
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    } catch (err) {
      console.error("[v0] Failed to delete post:", err)
    }
  }

  const handleGoBack = () => {
    router.push("/")
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Moderation Panel</h1>
            <p className="text-muted-foreground mt-1">Manage posts, users, and content moderation</p>
          </div>
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
          >
            <svg
              aria-hidden="true"
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
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span className="sr-only">Back</span>
            <span aria-hidden>Back to Blog</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-8 p-1 bg-muted/30 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "posts"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Posts Management
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "users"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "analytics"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Posts Management */}
        {activeTab === "posts" && (
          <div className="rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Posts Management</h2>
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{post.title}</h3>
                    {post.excerpt ? <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p> : null}
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {post.author ? <span>By {post.author}</span> : null}
                      {post.date ? <span>{post.date}</span> : null}
                      <span className="flex items-center gap-1">
                        <svg
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m18 15-6-6-6 6" />
                        </svg>
                        {post.upvotes ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                        {post.downvotes ?? 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/post/${post.slug}`)}
                      className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="px-3 py-1 text-sm bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && <p className="text-sm text-muted-foreground">No posts found.</p>}
            </div>
          </div>
        )}

        {/* User Management */}
        {activeTab === "users" && (
          <div className="rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">User Management</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h3 className="font-semibold text-foreground">admin</h3>
                  <p className="text-sm text-muted-foreground">Administrator</p>
                </div>
                <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">Admin</span>
              </div>
              <p className="text-sm text-muted-foreground">More users will appear here as they register.</p>
            </div>
          </div>
        )}

        {/* Analytics */}
        {activeTab === "analytics" && (
          <div className="rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-border rounded-lg">
                <h3 className="text-sm text-muted-foreground">Total Posts</h3>
                <p className="text-2xl font-bold text-foreground mt-1">{posts.length}</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h3 className="text-sm text-muted-foreground">Total Upvotes</h3>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {posts.reduce((sum, p) => sum + (p.upvotes || 0), 0)}
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h3 className="text-sm text-muted-foreground">Total Downvotes</h3>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {posts.reduce((sum, p) => sum + (p.downvotes || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
