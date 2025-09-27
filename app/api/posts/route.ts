import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const authorIdParam = url.searchParams.get("authorId")
  const all = db.getPosts()
  if (authorIdParam) {
    const authorId = Number(authorIdParam)
    const filtered = all.filter((p) => p.authorId === authorId)
    return NextResponse.json({ posts: filtered })
  }
  return NextResponse.json({ posts: all })
}

export async function POST(req: Request) {
  const { title, content, author, authorId, excerpt, category } = await req.json()
  const post = db.addPost(title, content, author, excerpt, category, authorId)
  return NextResponse.json({ post })
}
