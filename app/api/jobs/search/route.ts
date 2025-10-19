import { type NextRequest, NextResponse } from "next/server"
import { demoDataService } from "@/lib/demo-data"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""

    const jobs = await demoDataService.searchJobs(query)
    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error searching jobs:", error)
    return NextResponse.json({ error: "Failed to search jobs" }, { status: 500 })
  }
}
