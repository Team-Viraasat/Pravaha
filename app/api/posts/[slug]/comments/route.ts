import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const post = db.getPostBySlug(params.slug)
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }
  const list = db.getCommentsByPostId(post.id)
  return NextResponse.json({ comments: list })
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const { name, email, content } = await req.json()
  const n = (name || "").trim()
  const c = (content || "").trim()
  if (!n || !c) {
    return NextResponse.json({ error: "Name and comment are required." }, { status: 400 })
  }
  const post = db.getPostBySlug(params.slug)
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }
  const comment = db.addComment(post.id, n, (email || "").trim() || undefined, c)
  return NextResponse.json({ comment }, { status: 201 })
}
