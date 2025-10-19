import { type NextRequest, NextResponse } from "next/server"
import { applicationService } from "@/lib/db-service"
import { adminAuth } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decodedToken = await adminAuth.verifyIdToken(token)

    const { jobId } = await request.json()

    const applicationId = await applicationService.createApplication({
      jobId,
      userId: decodedToken.uid,
      status: "submitted",
    })

    return NextResponse.json({ success: true, applicationId }, { status: 201 })
  } catch (error) {
    console.error("Application error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to apply" }, { status: 400 })
  }
}
