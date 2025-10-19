import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const idToken = await userCredential.user.getIdToken()

    return NextResponse.json({ success: true, uid: userCredential.user.uid, idToken }, { status: 200 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Login failed" },
      { status: 401 },
    )
  }
}
