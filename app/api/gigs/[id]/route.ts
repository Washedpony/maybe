import { type NextRequest, NextResponse } from "next/server"
import { gigService } from "@/lib/db-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const gig = await gigService.getGig(params.id)

    if (!gig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, gig }, { status: 200 })
  } catch (error) {
    console.error("Gig fetch error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch gig" }, { status: 400 })
  }
}
