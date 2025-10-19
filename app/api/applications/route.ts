import { type NextRequest, NextResponse } from "next/server"
import { applicationService } from "@/lib/db-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const applicationId = await applicationService.createApplication({
      jobId: body.postingId,
      userId: "demo-user",
      status: "submitted",
      notes: `Name: ${body.fullName}\nEmail: ${body.email}\nPhone: ${body.phone}\n\nCover Letter:\n${body.coverLetter}`,
    })
    return NextResponse.json({ id: applicationId, success: true })
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 })
  }
}
