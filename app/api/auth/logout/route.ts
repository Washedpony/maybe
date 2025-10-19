import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    await signOut(auth)
    return NextResponse.json({ success: true, message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Logout failed" },
      { status: 400 },
    )
  }
}
