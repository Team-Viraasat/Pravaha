"use client"

import { PostEditor } from "@/components/post-editor"

export default function EditPostPage({ params }: { params: { id: string } }) {
  return <PostEditor postId={params.id} />
}
