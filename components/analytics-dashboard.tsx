"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, Users, Briefcase, Zap } from "lucide-react"

interface DashboardData {
  totalJobs: number
  totalApplications: number
  citizensServed: number
  gigsCompleted: number
  skillsDemand: Record<string, number>
  parishStats: Record<string, { jobs: number; citizens: number }>
}

const COLORS = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export function AnalyticsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics/dashboard")
        if (response.ok) {
          const result = await response.json()
          setData(result.dashboard)
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>
  }

  if (!data) {
    return <div className="text-center py-8">Failed to load analytics</div>
  }

  const skillsData = Object.entries(data.skillsDemand)
    .map(([skill, count]) => ({ name: skill, value: count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  const parishData = Object.entries(data.parishStats)
    .map(([parish, stats]) => ({ name: parish, jobs: stats.jobs, citizens: stats.citizens }))
    .sort((a, b) => b.jobs - a.jobs)
    .slice(0, 10)

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-6 w-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totalJobs}</div>
            <p className="text-sm text-muted-foreground mt-1">Government positions</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Applications</CardTitle>
            <TrendingUp className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totalApplications}</div>
            <p className="text-sm text-muted-foreground mt-1">Total submissions</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Citizens Served</CardTitle>
            <Users className="h-6 w-6 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.citizensServed}</div>
            <p className="text-sm text-muted-foreground mt-1">Active users</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Gigs Completed</CardTitle>
            <Zap className="h-6 w-6 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.gigsCompleted}</div>
            <p className="text-sm text-muted-foreground mt-1">Micro-tasks finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Skills Demand Chart */}
      {skillsData.length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Top In-Demand Skills</CardTitle>
            <CardDescription className="text-base">Skills most requested in job postings</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Demand",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Parish Statistics */}
      {parishData.length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Parish Statistics</CardTitle>
            <CardDescription className="text-base">Jobs and citizens by parish</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                jobs: {
                  label: "Jobs",
                  color: "hsl(var(--chart-1))",
                },
                citizens: {
                  label: "Citizens",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={parishData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="jobs" fill="var(--color-jobs)" />
                  <Bar dataKey="citizens" fill="var(--color-citizens)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
