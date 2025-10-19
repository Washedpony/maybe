import { type NextRequest, NextResponse } from "next/server"
import { applicationService } from "@/lib/db-service"
import { adminAuth } from "@/lib/firebase-admin"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decodedToken = await adminAuth.verifyIdToken(token)

    // Get user applications
    const applications = await applicationService.getUserApplications(decodedToken.uid)

    // Calculate application stats
    const applicationStats = {
      total: applications.length,
      submitted: applications.filter((a) => a.status === "submitted").length,
      reviewing: applications.filter((a) => a.status === "reviewing").length,
      interview: applications.filter((a) => a.status === "interview").length,
      accepted: applications.filter((a) => a.status === "accepted").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
    }

    return NextResponse.json(
      {
        success: true,
        stats: {
          applications: applicationStats,
          lastUpdated: new Date(),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("User stats error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch user stats" },
      { status: 400 },
    )
  }
}
