"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AddPostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) {
      router.push("/login")
    } else {
      setUser(JSON.parse(stored))
    }
  }, [router])

  const handleAddPost = async () => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, author: user.username, authorId: user.id }),
    })
    if (res.ok) {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-6 rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-4">Add Post</h2>
        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full mb-3 p-2 border rounded"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleAddPost} className="w-full bg-primary text-white py-2 rounded">
          Save Post
        </button>
      </div>
    </div>
  )
}
