"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign } from "lucide-react"
import type { Job } from "@/lib/types"
import { PARISH_COORDINATES, getJobDensityColor } from "@/lib/parish-coordinates"

interface JobsMapProps {
  jobs: Job[]
}

export function JobsMap({ jobs }: JobsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [selectedParish, setSelectedParish] = useState<string | null>(null)

  // Group jobs by parish
  const jobsByParish = jobs.reduce(
    (acc, job) => {
      if (!acc[job.parish]) {
        acc[job.parish] = []
      }
      acc[job.parish].push(job)
      return acc
    },
    {} as Record<string, Job[]>,
  )

  const parishStats = Object.entries(jobsByParish).map(([parish, parishJobs]) => {
    const avgSalary = Math.round(
      parishJobs.reduce((sum, job) => sum + (job.salaryMin + job.salaryMax) / 2, 0) / parishJobs.length,
    )
    return {
      parish,
      count: parishJobs.length,
      avgSalary,
      coords: PARISH_COORDINATES[parish],
    }
  })

  if (jobs.length === 0) {
    return (
      <Card className="border-2">
        <CardContent className="py-12 text-center">
          <p className="text-lg text-muted-foreground">No jobs available to display on the map.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Jobs by Parish Map</CardTitle>
          <CardDescription>Interactive visualization of job opportunities across Jamaica</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            ref={mapContainer}
            className="w-full h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 flex items-center justify-center relative overflow-hidden"
          >
            {/* SVG Map Background */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
              {/* Jamaica outline (simplified) */}
              <rect x="50" y="50" width="300" height="200" fill="none" stroke="#cbd5e1" strokeWidth="2" />
              <text x="200" y="160" textAnchor="middle" className="text-sm fill-slate-400">
                Jamaica Map
              </text>
            </svg>

            {/* Parish Markers */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 p-4">
                {parishStats.map((stat) => (
                  <button
                    key={stat.parish}
                    onClick={() => setSelectedParish(selectedParish === stat.parish ? null : stat.parish)}
                    className="transition-all hover:scale-110"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                      style={{ backgroundColor: getJobDensityColor(stat.count) }}
                      title={`${stat.parish}: ${stat.count} jobs`}
                    >
                      {stat.count}
                    </div>
                    <p className="text-xs text-center mt-1 text-slate-600">{stat.parish}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parish Statistics - Only show if there are stats */}
      {parishStats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parishStats.map((stat) => (
            <Card
              key={stat.parish}
              className={`border-2 cursor-pointer transition-all ${
                selectedParish === stat.parish ? "border-primary bg-primary/5" : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedParish(selectedParish === stat.parish ? null : stat.parish)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {stat.parish}
                    </CardTitle>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: getJobDensityColor(stat.count) }}
                  >
                    {stat.count}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Jobs</span>
                  <Badge variant="outline">{stat.count}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Salary</span>
                  <div className="flex items-center gap-1 text-success font-medium">
                    <DollarSign className="h-4 w-4" />
                    {stat.avgSalary.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Selected Parish Details - Only show if parish is selected and has jobs */}
      {selectedParish && jobsByParish[selectedParish] && jobsByParish[selectedParish].length > 0 && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Jobs in {selectedParish}</CardTitle>
            <CardDescription>{jobsByParish[selectedParish].length} opportunities available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {jobsByParish[selectedParish].map((job) => (
                <div key={job.id} className="p-3 bg-muted rounded-lg border border-border">
                  <h4 className="font-semibold text-sm">{job.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{job.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-medium text-success">
                      ${job.salaryMin} - ${job.salaryMax}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {job.applications} applications
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
