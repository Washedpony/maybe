import { type NextRequest, NextResponse } from "next/server"
import { gigService } from "@/lib/db-service"
import { adminAuth } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decodedToken = await adminAuth.verifyIdToken(token)

    const gigData = await request.json()

    const gigId = await gigService.createGig({
      ...gigData,
      createdBy: decodedToken.uid,
      status: "active",
    })

    return NextResponse.json({ success: true, gigId }, { status: 201 })
  } catch (error) {
    console.error("Gig creation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create gig" },
      { status: 400 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parish = searchParams.get("parish")

    const gigs = await gigService.getAvailableGigs(parish || undefined)

    return NextResponse.json({ success: true, gigs }, { status: 200 })
  } catch (error) {
    console.error("Gig fetch error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch gigs" },
      { status: 400 },
    )
  }
}
