import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const { username, password } = await req.json()
  const user = db.findUser(username, password)
  if (user) {
    return NextResponse.json({ user })
  }
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
}
