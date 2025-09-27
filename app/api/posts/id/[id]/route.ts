import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const post = db.getPostById(params.id)
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }
  return NextResponse.json({ post })
}
