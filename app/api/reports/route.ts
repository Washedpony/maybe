import { type NextRequest, NextResponse } from "next/server"
import { demoDataService } from "@/lib/demo-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const jobId = searchParams.get("jobId")

    const reports = await demoDataService.getReports(jobId || undefined)
    return NextResponse.json(reports)
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const reportId = await demoDataService.createReport(data)
    return NextResponse.json({ id: reportId, success: true })
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 })
  }
}
