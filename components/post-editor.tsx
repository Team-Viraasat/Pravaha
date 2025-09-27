"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Eye, Plus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface PostEditorProps {
  postId?: string
}

interface PostData {
  title: string
  content: string
  category: string
  tags: string[]
  isPublished: boolean
  excerpt: string
}

const categories = ["Development", "AI & Tech", "CSS", "Backend", "TypeScript", "UX/UI", "Design"]

export function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [showNewCategory, setShowNewCategory] = useState(false)

  const [postData, setPostData] = useState<PostData>({
    title: "",
    content: "",
    category: "",
    tags: [],
    isPublished: false,
    excerpt: "",
  })

  // Load existing post data if editing
  useEffect(() => {
    if (postId) {
      // Mock loading existing post data
      setPostData({
        title: "Building Modern Web Applications with Next.js",
        content: `# Introduction

Next.js has revolutionized the way we build React applications by providing a comprehensive framework that handles routing, server-side rendering, and optimization out of the box.

## Getting Started

The latest version of Next.js introduces several groundbreaking features that make development faster and more efficient.

### Key Features

- App Router for better file-based routing
- Server Components for improved performance
- Built-in optimization tools
- TypeScript support out of the box

## Best Practices

Here are some essential best practices to follow when building with Next.js:

1. Use TypeScript for better developer experience
2. Optimize images with the built-in Image component
3. Implement proper SEO with metadata API
4. Take advantage of automatic code splitting

## Conclusion

Next.js continues to evolve and provide developers with powerful tools to build modern web applications.`,
        category: "Development",
        tags: ["Next.js", "React", "Web Development", "JavaScript"],
        isPublished: true,
        excerpt:
          "Explore the latest features and best practices for creating scalable web applications using Next.js 14 and React Server Components.",
      })
    }
  }, [postId])

  const handleSave = async (publish = false) => {
    if (!postData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your post.",
        variant: "destructive",
      })
      return
    }
    if (!postData.content.trim()) {
      toast({
        title: "Content required",
        description: "Please add content to your post.",
        variant: "destructive",
      })
      return
    }
    if (!postData.category) {
      toast({
        title: "Category required",
        description: "Please select a category for your post.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const userRaw = typeof window !== "undefined" ? localStorage.getItem("user") : null
      const user = userRaw ? JSON.parse(userRaw) : null
      const author = user?.username || "Anonymous"
      const authorId = user?.id

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          category: postData.category,
          author,
          authorId,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast({
          title: "Could not save",
          description: data.error || "Please try again.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: publish ? "Post published!" : "Post saved!",
        description: publish ? "Your post is now live." : "Your changes have been saved.",
      })

      if (!postId && data.post?.slug) {
        router.push(`/post/${data.post.slug}`)
      } else {
        router.push("/admin")
      }
    } catch {
      toast({ title: "Network error", description: "Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !postData.tags.includes(newTag.trim())) {
      setPostData({
        ...postData,
        tags: [...postData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setPostData({
      ...postData,
      tags: postData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setPostData({
        ...postData,
        category: newCategory.trim(),
      })
      setNewCategory("")
      setShowNewCategory(false)
    }
  }

  const handleBack = () => {
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{postId ? "Edit Post" : "Create New Post"}</h1>
              <p className="text-muted-foreground text-sm">
                {postId ? "Update your existing post" : "Write and publish a new blog post"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(!showPreview)}
              className="bg-secondary/50 hover:bg-secondary"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? "Edit" : "Preview"}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={isLoading}
              className="bg-secondary/50 hover:bg-secondary"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {!showPreview ? (
              <>
                {/* Title */}
                <div className="glass-card rounded-xl p-6">
                  <Label htmlFor="title" className="text-sm font-medium text-foreground mb-2 block">
                    Post Title *
                  </Label>
                  <Input
                    id="title"
                    value={postData.title}
                    onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                    placeholder="Enter your post title..."
                    className="text-lg font-medium bg-input/50 border-border/50 focus:bg-input focus:border-ring"
                  />
                </div>

                {/* Excerpt */}
                <div className="glass-card rounded-xl p-6">
                  <Label htmlFor="excerpt" className="text-sm font-medium text-foreground mb-2 block">
                    Excerpt
                  </Label>
                  <Textarea
                    id="excerpt"
                    value={postData.excerpt}
                    onChange={(e) => setPostData({ ...postData, excerpt: e.target.value })}
                    placeholder="Brief description of your post..."
                    rows={3}
                    className="bg-input/50 border-border/50 focus:bg-input focus:border-ring resize-none"
                  />
                </div>

                {/* Content Editor */}
                <div className="glass-card rounded-xl p-6">
                  <Label htmlFor="content" className="text-sm font-medium text-foreground mb-2 block">
                    Content *
                  </Label>
                  <Textarea
                    id="content"
                    value={postData.content}
                    onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                    placeholder="Write your post content in Markdown..."
                    rows={20}
                    className="font-mono text-sm bg-input/50 border-border/50 focus:bg-input focus:border-ring resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Supports Markdown formatting. Use # for headings, ** for bold, * for italic.
                  </p>
                </div>
              </>
            ) : (
              /* Preview */
              <div className="glass-card rounded-xl p-8">
                <h1 className="text-3xl font-bold text-foreground mb-4">{postData.title || "Untitled Post"}</h1>
                {postData.excerpt && <p className="text-lg text-muted-foreground mb-6 italic">{postData.excerpt}</p>}
                <div className="prose prose-invert prose-lg max-w-none">
                  <div className="text-foreground leading-relaxed space-y-4">
                    {postData.content.split("\n").map((line, index) => {
                      if (line.startsWith("# ")) {
                        return (
                          <h1 key={index} className="text-2xl font-bold text-foreground mt-8 mb-4">
                            {line.slice(2)}
                          </h1>
                        )
                      }
                      if (line.startsWith("## ")) {
                        return (
                          <h2 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">
                            {line.slice(3)}
                          </h2>
                        )
                      }
                      if (line.startsWith("### ")) {
                        return (
                          <h3 key={index} className="text-lg font-medium text-foreground mt-4 mb-2">
                            {line.slice(4)}
                          </h3>
                        )
                      }
                      if (line.trim() === "") {
                        return <br key={index} />
                      }
                      return (
                        <p key={index} className="text-muted-foreground leading-relaxed">
                          {line}
                        </p>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Publish Settings</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="publish-toggle" className="text-sm text-foreground">
                  Published
                </Label>
                <Switch
                  id="publish-toggle"
                  checked={postData.isPublished}
                  onCheckedChange={(checked) => setPostData({ ...postData, isPublished: checked })}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {postData.isPublished ? "This post is live and visible to readers." : "This post is saved as a draft."}
              </p>
            </div>

            {/* Category */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Category *</h3>
              <Select
                value={postData.category}
                onValueChange={(value) => setPostData({ ...postData, category: value })}
              >
                <SelectTrigger className="bg-input/50 border-border/50 focus:bg-input focus:border-ring">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {!showNewCategory ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewCategory(true)}
                  className="mt-2 text-xs text-primary hover:text-primary-foreground hover:bg-primary"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add new category
                </Button>
              ) : (
                <div className="mt-3 space-y-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className="text-sm bg-input/50 border-border/50 focus:bg-input focus:border-ring"
                    onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddCategory} className="text-xs">
                      Add
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowNewCategory(false)
                        setNewCategory("")
                      }}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {postData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="ml-2 hover:text-destructive" type="button">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  className="text-sm bg-input/50 border-border/50 focus:bg-input focus:border-ring"
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button size="sm" onClick={handleAddTag} className="text-xs">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
