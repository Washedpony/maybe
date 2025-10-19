"use client"

import { useState } from "react"
import { TrendingUp, Users, MapPin, Search, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"

const skillDemands = [
  { skill: "Software Development", demand: 245, growth: "+32%", avgSalary: "JMD 3.2M - 5.8M" },
  { skill: "Data Analysis", demand: 189, growth: "+28%", avgSalary: "JMD 2.8M - 4.5M" },
  { skill: "Digital Marketing", demand: 167, growth: "+24%", avgSalary: "JMD 2.2M - 3.8M" },
  { skill: "Customer Service", demand: 312, growth: "+18%", avgSalary: "JMD 1.8M - 2.9M" },
  { skill: "Project Management", demand: 143, growth: "+22%", avgSalary: "JMD 3.5M - 5.2M" },
  { skill: "Accounting", demand: 198, growth: "+15%", avgSalary: "JMD 2.5M - 4.1M" },
  { skill: "Nursing", demand: 276, growth: "+35%", avgSalary: "JMD 2.1M - 3.6M" },
  { skill: "Teaching", demand: 234, growth: "+12%", avgSalary: "JMD 2.0M - 3.2M" },
]

const regionData = [
  { parish: "Kingston", jobs: 1247, percentage: 28, color: "bg-blue-500" },
  { parish: "St. Andrew", jobs: 1089, percentage: 24, color: "bg-blue-600" },
  { parish: "St. Catherine", jobs: 876, percentage: 19, color: "bg-blue-700" },
  { parish: "Manchester", jobs: 432, percentage: 10, color: "bg-blue-800" },
  { parish: "St. James", jobs: 398, percentage: 9, color: "bg-blue-900" },
  { parish: "Clarendon", jobs: 234, percentage: 5, color: "bg-blue-950" },
  { parish: "Other Parishes", jobs: 224, percentage: 5, color: "bg-slate-700" },
]

export default function CompanyPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSkills = skillDemands.filter((skill) => skill.skill.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Company Insights</h1>
              <p className="text-xl text-muted-foreground">Skillset demands and job distribution across Jamaica</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Total Job Openings</CardTitle>
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4,500</div>
                  <p className="text-sm text-muted-foreground mt-1">Across all parishes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Active Companies</CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">1,247</div>
                  <p className="text-sm text-muted-foreground mt-1">Registered employers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Fastest Growing</CardTitle>
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">Nursing</div>
                  <p className="text-sm text-muted-foreground mt-1">+35% demand increase</p>
                </CardContent>
              </Card>
            </div>

            {/* Skillset Demand */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">In-Demand Skills</CardTitle>
                <CardDescription className="text-base">
                  Current skillset needs across Jamaican companies
                </CardDescription>
                <div className="flex gap-2 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-base"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredSkills.map((skill) => (
                    <div key={skill.skill} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold">{skill.skill}</h3>
                          <p className="text-muted-foreground text-base">{skill.avgSalary} annually</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{skill.demand}</div>
                          <div className="text-sm text-muted-foreground">open positions</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all"
                            style={{ width: `${(skill.demand / 312) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-green-500">{skill.growth}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Jobs by Parish</CardTitle>
                <CardDescription className="text-base">
                  Geographic distribution of job opportunities across Jamaica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Map Visualization */}
                  <div className="bg-muted rounded-lg p-6 h-64 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <svg viewBox="0 0 400 200" className="w-full h-full">
                        {/* Simplified Jamaica map outline */}
                        <path
                          d="M 50 100 Q 80 80, 120 85 T 200 90 Q 250 85, 300 95 Q 330 100, 350 110 L 340 130 Q 310 125, 270 120 T 180 115 Q 120 120, 80 125 Q 60 120, 50 110 Z"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="relative z-10 text-center">
                      <MapPin className="h-16 w-16 text-primary mx-auto mb-2" />
                      <p className="text-xl font-semibold">Jamaica Job Distribution</p>
                      <p className="text-muted-foreground">4,500 total opportunities</p>
                    </div>
                  </div>

                  {/* Parish Breakdown */}
                  <div className="space-y-3">
                    {regionData.map((region) => (
                      <div key={region.parish} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded ${region.color}`} />
                            <span className="text-lg font-medium">{region.parish}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-bold">{region.jobs}</span>
                            <span className="text-muted-foreground ml-2">({region.percentage}%)</span>
                          </div>
                        </div>
                        <div className="bg-muted rounded-full h-2 overflow-hidden ml-7">
                          <div
                            className={`${region.color} h-full rounded-full transition-all`}
                            style={{ width: `${region.percentage * 3}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
