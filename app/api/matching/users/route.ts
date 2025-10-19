import { type NextRequest, NextResponse } from "next/server"
import { matchingService } from "@/lib/matching-service"
import { jobService } from "@/lib/db-service"
import { adminAuth } from "@/lib/firebase-admin"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decodedToken = await adminAuth.verifyIdToken(token)

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get("jobId")

    if (!jobId) {
      return NextResponse.json({ error: "Job ID required" }, { status: 400 })
    }

    const job = await jobService.getJob(jobId)
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const matchedUsers = await matchingService.getMatchedUsers(job)

    return NextResponse.json({ success: true, users: matchedUsers }, { status: 200 })
  } catch (error) {
    console.error("Matching error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get matched users" },
      { status: 400 },
    )
  }
}
