import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  return NextResponse.json({ posts: db.getPosts() })
}

export async function POST(req: Request) {
  const { title, content, author } = await req.json()
  const post = db.addPost(title, content, author)
  return NextResponse.json({ post })
}
