import { type NextRequest, NextResponse } from "next/server"
import { gigService } from "@/lib/db-service"
import { adminAuth } from "@/lib/firebase-admin"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    await adminAuth.verifyIdToken(token)

    const { acceptanceId } = await request.json()

    await gigService.completeGig(acceptanceId)

    return NextResponse.json({ success: true, message: "Gig completed" }, { status: 200 })
  } catch (error) {
    console.error("Gig completion error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to complete gig" },
      { status: 400 },
    )
  }
}
