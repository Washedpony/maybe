import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { userService } from "@/lib/db-service"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, parish, role } = await request.json()

    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid

    // Create user document in Firestore
    await userService.createUser(uid, {
      id: uid,
      email,
      name,
      parish,
      role: role || "citizen",
      skills: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true, uid, message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Signup failed" },
      { status: 400 },
    )
  }
}
