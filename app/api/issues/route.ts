import { type NextRequest, NextResponse } from "next/server"
import { issueService } from "@/lib/db-service"

export async function GET(request: NextRequest) {
  try {
    const parish = request.nextUrl.searchParams.get("parish")
    const issues = await issueService.getIssues(parish || undefined)
    return NextResponse.json(issues)
  } catch (error) {
    console.error("Error fetching issues:", error)
    return NextResponse.json({ error: "Failed to fetch issues" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const issueId = await issueService.createIssue(body)
    return NextResponse.json({ id: issueId, ...body })
  } catch (error) {
    console.error("Error creating issue:", error)
    return NextResponse.json({ error: "Failed to create issue" }, { status: 500 })
  }
}
