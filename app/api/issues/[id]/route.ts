import { type NextRequest, NextResponse } from "next/server"
import { issueService } from "@/lib/db-service"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    if (body.status) {
      await issueService.updateIssueStatus(params.id, body.status)
    }
    if (body.upvote) {
      await issueService.upvoteIssue(params.id)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating issue:", error)
    return NextResponse.json({ error: "Failed to update issue" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await issueService.deleteIssue(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting issue:", error)
    return NextResponse.json({ error: "Failed to delete issue" }, { status: 500 })
  }
}
