import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const { username, password } = await req.json()
  const existing = db.getUsers().find((u) => u.username === username)
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 })
  }
  const newUser = db.addUser(username, password)
  return NextResponse.json({ user: newUser })
}
