"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, DollarSign, Calendar, Briefcase, ArrowRight } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { ChatbotButton } from "@/components/chatbot-button"
import { useAuth } from "@/lib/auth-context"
import type { Job } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobsMap } from "@/components/jobs-map"

export default function JobsPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("/api/matching/jobs", {
          headers: {
            Authorization: `Bearer ${user?.id || ""}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setJobs(data.jobs || [])
          setFilteredJobs(data.jobs || [])
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchJobs()
    }
  }, [user])

  useEffect(() => {
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredJobs(filtered)
  }, [searchTerm, jobs])

  const handleApply = async (jobId: string) => {
    try {
      const response = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.id || ""}`,
        },
        body: JSON.stringify({ jobId }),
      })
      if (response.ok) {
        alert("Application submitted successfully!")
      }
    } catch (error) {
      console.error("Failed to apply:", error)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="h-10 w-10 text-primary" />
                <h1 className="text-4xl font-bold">Job Opportunities</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Discover government jobs matched to your skills and location
              </p>
            </div>

            {/* Search */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-base h-12"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tabs for list and map view */}
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "list" | "map")}>
              <TabsList className="grid w-full max-w-xs grid-cols-2">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="space-y-4">
                {/* Jobs List */}
                {loading ? (
                  <div className="text-center py-8">Loading jobs...</div>
                ) : filteredJobs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <Card key={job.id} className="border-2 hover:border-primary transition-colors">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                              <CardDescription className="text-base">{job.description}</CardDescription>
                            </div>
                            <Badge className="bg-primary/20 text-primary border-primary/30">{job.jobType}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-success" />
                              <span className="font-medium text-success">
                                {job.salaryMin} - {job.salaryMax} {job.currency}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{job.parish}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{new Date(job.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="text-muted-foreground">{job.applications} applications</div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {job.requiredSkills.map((skill) => (
                              <Badge key={skill} variant="outline">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <Button onClick={() => handleApply(job.id)} className="w-full gap-2" size="lg">
                            Apply Now
                            <ArrowRight className="h-5 w-5" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-2">
                    <CardContent className="py-12 text-center">
                      <p className="text-lg text-muted-foreground">No jobs found matching your criteria.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="map">
                {/* Map View for jobs by parish */}
                {loading ? (
                  <div className="text-center py-8">Loading jobs...</div>
                ) : (
                  <JobsMap jobs={filteredJobs.length > 0 ? filteredJobs : jobs} />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <ChatbotButton />
    </div>
  )
}
