import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { userId, voteType } = await req.json()
    const { slug } = params

    const post = db.getPostBySlug(slug)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const updatedPost = db.votePost(userId, post.id, voteType)
    const userVote = db.getUserVote(userId, post.id)

    return NextResponse.json({
      post: updatedPost,
      userVote: userVote?.type || null,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const { slug } = params

    const post = db.getPostBySlug(slug)
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const userVote = userId ? db.getUserVote(Number.parseInt(userId), post.id) : null

    return NextResponse.json({
      upvotes: post.upvotes,
      downvotes: post.downvotes,
      userVote: userVote?.type || null,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to get vote data" }, { status: 500 })
  }
}
