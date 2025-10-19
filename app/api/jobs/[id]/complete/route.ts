import { type NextRequest, NextResponse } from "next/server"
import { jobService } from "@/lib/db-service"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await jobService.markJobCompleted(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking job as completed:", error)
    return NextResponse.json({ error: "Failed to mark job as completed" }, { status: 500 })
  }
}
