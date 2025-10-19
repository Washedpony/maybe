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
    const decodedToken = await adminAuth.verifyIdToken(token)

    const acceptanceId = await gigService.acceptGig(params.id, decodedToken.uid)

    return NextResponse.json({ success: true, acceptanceId }, { status: 201 })
  } catch (error) {
    console.error("Gig claim error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to claim gig" }, { status: 400 })
  }
}
