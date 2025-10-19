import { type NextRequest, NextResponse } from "next/server"
import { jobService } from "@/lib/db-service"
import { adminAuth } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decodedToken = await adminAuth.verifyIdToken(token)

    const jobData = await request.json()

    const jobId = await jobService.createJob({
      ...jobData,
      employerId: decodedToken.uid,
      status: "active",
    })

    return NextResponse.json({ success: true, jobId }, { status: 201 })
  } catch (error) {
    console.error("Job creation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create job" },
      { status: 400 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parish = searchParams.get("parish")

    const jobs = await jobService.getActiveJobs(parish || undefined)

    return NextResponse.json({ success: true, jobs }, { status: 200 })
  } catch (error) {
    console.error("Job fetch error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch jobs" },
      { status: 400 },
    )
  }
}
