"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Send } from "lucide-react"

interface Comment {
  id: string
  name: string
  email?: string
  content: string
  timestamp: string
}

export function CommentSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}/comments`, { cache: "no-store" })
        const data = await res.json()
        if (res.ok && isMounted) setComments(data.comments || [])
      } catch (e) {
        // no-op
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !content.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in your name and comment.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, content }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast({ title: "Could not post", description: data.error || "Please try again.", variant: "destructive" })
      } else {
        setComments((prev) => [data.comment, ...prev])
        setName("")
        setEmail("")
        setContent("")
        toast({ title: "Comment posted!", description: "Thank you for your comment." })
      }
    } catch {
      toast({ title: "Network error", description: "Please try again.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)

  return (
    <section className="glass-card rounded-xl p-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
          <MessageCircle className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Comments ({comments.length})</h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4 animate-in slide-in-from-bottom-4 duration-500 delay-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground">
              Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="glass-card border-glass-border focus:border-primary/50 focus:shadow-lg transition-all duration-300"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email (optional)
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="glass-card border-glass-border focus:border-primary/50 focus:shadow-lg transition-all duration-300"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment" className="text-sm font-medium text-foreground">
            Comment *
          </Label>
          <Textarea
            id="comment"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="glass-card border-glass-border focus:border-primary/50 focus:shadow-lg transition-all duration-300 resize-none"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !name.trim() || !content.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Posting...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Post Comment
            </div>
          )}
        </Button>
      </form>

      <div className="space-y-6">
        {comments.map((comment, index) => (
          <div
            key={comment.id}
            className="flex gap-4 p-4 rounded-lg glass-card border border-glass-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-in slide-in-from-left-4"
            style={{ animationDelay: `${index * 100 + 400}ms`, animationDuration: "500ms" }}
          >
            <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
              <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/20 text-primary text-sm font-medium">
                {getInitials(comment.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-foreground hover:text-primary transition-colors duration-300">
                  {comment.name}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</span>
              </div>

              <p className="text-muted-foreground leading-relaxed hover:text-foreground/90 transition-colors duration-300">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
