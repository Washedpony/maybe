import { type NextRequest, NextResponse } from "next/server"
import { jobService } from "@/lib/db-service"
import { adminAuth } from "@/lib/firebase-admin"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const job = await jobService.getJob(params.id)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, job }, { status: 200 })
  } catch (error) {
    console.error("Job fetch error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch job" }, { status: 400 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decodedToken = await adminAuth.verifyIdToken(token)

    const job = await jobService.getJob(params.id)
    if (!job || job.employerId !== decodedToken.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updates = await request.json()
    await jobService.updateJob(params.id, updates)

    return NextResponse.json({ success: true, message: "Job updated" }, { status: 200 })
  } catch (error) {
    console.error("Job update error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update job" },
      { status: 400 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decodedToken = await adminAuth.verifyIdToken(token)

    const job = await jobService.getJob(params.id)
    if (!job || job.employerId !== decodedToken.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await jobService.deleteJob(params.id)

    return NextResponse.json({ success: true, message: "Job deleted" }, { status: 200 })
  } catch (error) {
    console.error("Job deletion error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete job" },
      { status: 400 },
    )
  }
}
