import { type NextRequest, NextResponse } from "next/server"
import { analyticsService } from "@/lib/db-service"
import { adminAuth, isInitialized } from "@/lib/firebase-admin"

export async function GET(request: NextRequest) {
  try {
    if (!isInitialized) {
      return NextResponse.json(
        {
          success: true,
          dashboard: {
            totalJobs: 0,
            totalApplications: 0,
            citizensServed: 0,
            gigsCompleted: 0,
            skillsDemand: {},
            parishStats: {},
            lastUpdated: new Date(),
            message: "Firebase not configured - returning demo data",
          },
        },
        { status: 200 },
      )
    }

    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    await adminAuth.verifyIdToken(token)

    // Get analytics data
    const analytics = await analyticsService.getAnalytics(30)

    // Calculate aggregated metrics
    const totalJobs = analytics.reduce((sum, a) => sum + (a.activeJobs || 0), 0) / Math.max(analytics.length, 1)
    const totalApplications = analytics.reduce((sum, a) => sum + (a.totalApplications || 0), 0)
    const citizensServed =
      analytics.reduce((sum, a) => sum + (a.citizensServed || 0), 0) / Math.max(analytics.length, 1)
    const gigsCompleted = analytics.reduce((sum, a) => sum + (a.microGigsCompleted || 0), 0)

    // Aggregate skills demand
    const skillsDemand: Record<string, number> = {}
    analytics.forEach((a) => {
      if (a.skillsDemand) {
        Object.entries(a.skillsDemand).forEach(([skill, count]) => {
          skillsDemand[skill] = (skillsDemand[skill] || 0) + (count as number)
        })
      }
    })

    // Aggregate parish stats
    const parishStats: Record<string, { jobs: number; citizens: number }> = {}
    analytics.forEach((a) => {
      if (a.parishStats) {
        Object.entries(a.parishStats).forEach(([parish, stats]) => {
          if (!parishStats[parish]) {
            parishStats[parish] = { jobs: 0, citizens: 0 }
          }
          parishStats[parish].jobs += (stats as any).jobs || 0
          parishStats[parish].citizens += (stats as any).citizens || 0
        })
      }
    })

    return NextResponse.json(
      {
        success: true,
        dashboard: {
          totalJobs: Math.round(totalJobs),
          totalApplications,
          citizensServed: Math.round(citizensServed),
          gigsCompleted,
          skillsDemand,
          parishStats,
          lastUpdated: new Date(),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch analytics" },
      { status: 400 },
    )
  }
}
