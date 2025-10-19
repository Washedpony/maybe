import { type NextRequest, NextResponse } from "next/server"
import { matchingService } from "@/lib/matching-service"
import { userService } from "@/lib/db-service"
import { adminAuth } from "@/lib/firebase-admin"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decodedToken = await adminAuth.verifyIdToken(token)

    const user = await userService.getUser(decodedToken.uid)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const matchedJobs = await matchingService.getRecommendedJobs(user)

    return NextResponse.json({ success: true, jobs: matchedJobs }, { status: 200 })
  } catch (error) {
    console.error("Matching error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get matched jobs" },
      { status: 400 },
    )
  }
}
