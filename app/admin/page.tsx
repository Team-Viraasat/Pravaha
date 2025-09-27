"use client"
\
"next/navigationw I'll create a dedicated admin moderation panel that only admin users can access:

<CodeProject id="Pravaha" taskNameActive="Creating admin moderation panel" taskNameComplete="Created admin moderation panel">

```tsx file="app/admin/page.tsx"
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminModerationPanel() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState("posts")

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        if (userData.username !== "admin") {
          router.push("/")
          return
        }
        setUser(userData)
        setAuthLoading(false)
      } else {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const postsResponse = await fetch("/api/posts")
        const postsData = await postsResponse.json()
        setPosts(postsData.posts)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }

    fetchData()
  }, [user])

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      // This would need to be implemented in the API
      console.log("Delete post:", postId)
      // Remove from local state for now
      setPosts(posts.filter((p) => p.id !== postId))
    } catch (error) {
      console.error("Failed to delete post:", error)
    }
  }

  const handleGoBack = () => {
    router.push("/")
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="blogspace-loader">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

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
            Back to Blog
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
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Posts Management</h2>
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>By {post.author}</span>
                      <span>{post.date}</span>
                      <span className="flex items-center gap-1">
                        <svg
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
                        {post.upvotes}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
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
                        {post.downvotes}
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
            </div>
          </div>
        )}

        {/* User Management */}
        {activeTab === "users" && (
          <div className="glass-card rounded-xl p-6">
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
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-border rounded-lg">
                <h3 className="text-sm text-muted-foreground">Total Posts</h3>
                <p className="text-2xl font-bold text-foreground mt-1">{posts.length}</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h3 className="text-sm text-muted-foreground">Total Upvotes</h3>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {posts.reduce((sum, post) => sum + (post.upvotes || 0), 0)}
                </p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <h3 className="text-sm text-muted-foreground">Total Downvotes</h3>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {posts.reduce((sum, post) => sum + (post.downvotes || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
