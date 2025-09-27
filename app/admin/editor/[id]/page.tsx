"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PostEditor } from "@/components/post-editor"

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    const verify = async () => {
      try {
        const stored = localStorage.getItem("user")
        if (!stored) {
          router.replace("/login")
          return
        }
        const currentUser = JSON.parse(stored)

        const res = await fetch(`/api/posts/id/${params.id}`)
        if (!res.ok) {
          router.replace("/")
          return
        }
        const { post } = await res.json()
        const isAdmin = currentUser?.username === "admin" || currentUser?.role === "admin"
        const isOwner = post?.authorId && post.authorId === currentUser.id

        if (isAdmin || isOwner) {
          setAuthorized(true)
        } else {
          setAuthorized(false)
          router.replace("/") // block unauthorized edit attempts
        }
      } catch {
        router.replace("/")
      }
    }
    verify()
  }, [params.id, router])

  if (authorized === null) {
    return null
  }

  if (!authorized) {
    return null
  }

  return <PostEditor postId={params.id} />
}
