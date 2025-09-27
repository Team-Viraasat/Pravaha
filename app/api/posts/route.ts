import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const authorIdParam = url.searchParams.get("authorId")
  const q = url.searchParams.get("q")?.toLowerCase() || ""
  let all = db.getPosts()
  if (authorIdParam) {
    const authorId = Number(authorIdParam)
    all = all.filter((p) => p.authorId === authorId)
  }
  if (q) {
    all = all.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q) ||
        (p.author || "").toLowerCase().includes(q),
    )
  }
  return NextResponse.json({ posts: all })
}

export async function POST(req: Request) {
  const { title, content, author, authorId, excerpt, category } = await req.json()
  const t = (title || "").trim()
  const c = (content || "").trim()

  if (!t || !c) {
    return NextResponse.json({ error: "Title and content are required." }, { status: 400 })
  }

  const slug = t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  const exists = db.getPostBySlug(slug)
  if (exists) {
    return NextResponse.json({ error: "A post with this title already exists." }, { status: 409 })
  }

  const safeAuthor = author || "Anonymous"
  const post = db.addPost(t, c, safeAuthor, excerpt, category, authorId)
  return NextResponse.json({ post })
}
