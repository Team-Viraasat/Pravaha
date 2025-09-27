"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Post {
  id: string
  title: string
  category: string
  author: string
  status: "published" | "draft"
  date: string
  views: number
}

const mockPosts: Post[] = [
  {
    id: "1",
    title: "Building Modern Web Applications with Next.js",
    category: "Development",
    author: "Sarah Chen",
    status: "published",
    date: "Dec 15, 2024",
    views: 1250,
  },
  {
    id: "2",
    title: "The Future of AI in Web Development",
    category: "AI & Tech",
    author: "Marcus Johnson",
    status: "published",
    date: "Dec 12, 2024",
    views: 890,
  },
  {
    id: "3",
    title: "Mastering CSS Grid and Flexbox",
    category: "CSS",
    author: "Elena Rodriguez",
    status: "draft",
    date: "Dec 10, 2024",
    views: 0,
  },
  {
    id: "4",
    title: "Database Design Patterns for Scale",
    category: "Backend",
    author: "David Kim",
    status: "published",
    date: "Dec 8, 2024",
    views: 2100,
  },
  {
    id: "5",
    title: "TypeScript Best Practices in 2024",
    category: "TypeScript",
    author: "Alex Thompson",
    status: "published",
    date: "Dec 5, 2024",
    views: 1680,
  },
]

export function AdminPostsList() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const router = useRouter()
  const { toast } = useToast()

  const handleEdit = (postId: string) => {
    router.push(`/admin/editor/${postId}`)
  }

  const handleView = (postId: string) => {
    // In a real app, you'd get the slug from the post data
    router.push(`/post/building-modern-web-apps-nextjs`)
  }

  const handleDelete = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId))
    toast({
      title: "Post deleted",
      description: "The post has been successfully deleted.",
    })
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">All Posts</h2>
        <div className="text-sm text-muted-foreground">{posts.length} posts</div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border/30 hover:bg-secondary/30 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-medium text-foreground">{post.title}</h3>
                <Badge
                  variant={post.status === "published" ? "default" : "secondary"}
                  className={
                    post.status === "published"
                      ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                      : "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                  }
                >
                  {post.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{post.category}</span>
                <span>•</span>
                <span>{post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.views.toLocaleString()} views</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleView(post.id)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleEdit(post.id)}>
                <Edit className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border">
                  <DropdownMenuItem
                    onClick={() => handleDelete(post.id)}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
