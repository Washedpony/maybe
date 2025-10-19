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

    const applications = await applicationService.getUserApplications(decodedToken.uid)

    return NextResponse.json({ success: true, applications }, { status: 200 })
  } catch (error) {
    console.error("Applications fetch error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch applications" },
      { status: 400 },
    )
  }
}
