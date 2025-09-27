"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface Post {
  id: string
  title: string
  excerpt: string
  slug: string
  date: string
  readTime: string
  category: string
  author: string
}

export default function MyPostsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) {
      router.replace("/login")
      return
    }
    const currentUser = JSON.parse(stored)
    setUser(currentUser)

    const load = async () => {
      try {
        const res = await fetch(`/api/posts?authorId=${currentUser.id}`)
        const data = await res.json()
        setPosts(data.posts || [])
      } catch (e) {
        console.log("[v0] Failed to fetch user posts:", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  const handleNewPost = () => router.push("/add-post")
  const handleView = (slug: string) => router.push(`/post/${slug}`)
  const handleEdit = (id: string) => router.push(`/admin/editor/${id}`)

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Posts</h1>
            <p className="text-muted-foreground mt-1">Posts written by {user.username}</p>
          </div>
          <Button onClick={handleNewPost} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            New Post
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-24 mb-3" />
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-3/4 mb-4" />
                <div className="h-3 bg-muted rounded w-32" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-card rounded-xl p-8 text-center">
            <p className="text-muted-foreground mb-4">You haven’t written any posts yet.</p>
            <Button onClick={handleNewPost} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Write your first post
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="glass-card rounded-xl p-6 flex flex-col">
                <span className="text-xs font-semibold uppercase text-primary bg-primary/10 px-2 py-1 rounded-full w-fit">
                  {post.category}
                </span>
                <h3 className="text-xl font-bold text-foreground mt-3">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 flex-grow">{post.excerpt}</p>
                <div className="text-xs text-muted-foreground mt-3">
                  <span>{post.date}</span> • <span>{post.readTime}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={() => handleView(post.slug)}>
                    View
                  </Button>
                  <Button
                    onClick={() => handleEdit(post.id)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
