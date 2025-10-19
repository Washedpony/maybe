"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, AlertCircle, Plus, FileText, Clock, CheckCircle } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { ChatbotButton } from "@/components/chatbot-button"
import { useAuth } from "@/lib/auth-context"

type Job = {
  id: string
  title: string
  description: string
  category: string
  parish: string
  status: string
  reports?: Report[]
  createdAt: Date
}

type Report = {
  id: string
  jobId: string
  reporterName: string
  description: string
  category: string
  priority: string
  status: string
  createdAt: Date
}

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showReportForm, setShowReportForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [reportFormData, setReportFormData] = useState({
    jobTitle: "",
    jobId: "",
    reporterName: "",
    reporterEmail: "",
    description: "",
    category: "issue",
    priority: "medium",
    parish: "Kingston",
  })
  const { user } = useAuth()
  const userRole = user?.role || "citizen"

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(`/api/jobs/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const jobs = await response.json()
        setSearchResults(jobs)
      }
    } catch (error) {
      console.error("Error searching jobs:", error)
    }
  }

  const handleJobSelect = async (job: Job) => {
    setSelectedJob(job)
    // Load reports for this job
    try {
      const response = await fetch(`/api/reports?jobId=${job.id}`)
      if (response.ok) {
        const reports = await response.json()
        setSelectedJob({ ...job, reports })
      }
    } catch (error) {
      console.error("Error loading reports:", error)
    }
  }

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportFormData),
      })

      if (response.ok) {
        const result = await response.json()

        const jobResponse = await fetch(`/api/jobs/search?q=${encodeURIComponent(result.jobId)}`)
        if (jobResponse.ok) {
          const jobs = await jobResponse.json()
          const createdJob = jobs.find((j: Job) => j.id === result.jobId)

          if (createdJob) {
            const reportsResponse = await fetch(`/api/reports?jobId=${createdJob.id}`)
            if (reportsResponse.ok) {
              const reports = await reportsResponse.json()
              createdJob.reports = reports
            }

            setSearchResults((prev) => {
              const exists = prev.some((j) => j.id === createdJob.id)
              if (exists) {
                return prev.map((j) => (j.id === createdJob.id ? createdJob : j))
              }
              return [createdJob, ...prev]
            })

            setSelectedJob(createdJob)
          }
        }

        setSuccessMessage(result.message || "Report submitted successfully!")
        setTimeout(() => setSuccessMessage(""), 5000)

        setShowReportForm(false)
        setReportFormData({
          jobTitle: "",
          jobId: "",
          reporterName: "",
          reporterEmail: "",
          description: "",
          category: "issue",
          priority: "medium",
          parish: "Kingston",
        })
      }
    } catch (error) {
      console.error("Error submitting report:", error)
      alert("Failed to submit report. Please try again.")
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/20 text-destructive border-destructive/30"
      case "medium":
        return "bg-warning/20 text-warning border-warning/30"
      case "low":
        return "bg-success/20 text-success border-success/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
      case "closed":
        return "bg-success/20 text-success border-success/30"
      case "in-progress":
        return "bg-primary/20 text-primary border-primary/30"
      case "open":
        return "bg-warning/20 text-warning border-warning/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Job Registry & Ticketing</h1>
              <p className="text-lg text-muted-foreground">
                Search for jobs by name, ID, or keywords. Report issues to create or update job records.
              </p>
            </div>

            {successMessage && (
              <Card className="border-2 border-success bg-success/10">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-success" />
                    <p className="font-medium text-success">{successMessage}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Search Jobs</CardTitle>
                <CardDescription>Find existing jobs or report a new one</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search by job name, ID, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="pl-10 text-base h-12"
                    />
                  </div>
                  <Button size="lg" onClick={handleSearch} className="gap-2">
                    <Search className="h-5 w-5" />
                    Search
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      setShowReportForm(true)
                      setReportFormData({ ...reportFormData, jobTitle: searchQuery, jobId: "" })
                    }}
                    className="gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Report Issue
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Found {searchResults.length} job(s)</p>
                    {searchResults.map((job) => (
                      <Card
                        key={job.id}
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => handleJobSelect(job)}
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{job.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline">{job.category}</Badge>
                                <Badge variant="outline">{job.parish}</Badge>
                                <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowReportForm(true)
                                setReportFormData({ ...reportFormData, jobTitle: job.title, jobId: job.id })
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Report
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {searchQuery && searchResults.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="py-8 text-center">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">No job found for "{searchQuery}"</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Report an issue to automatically create this job
                      </p>
                      <Button
                        onClick={() => {
                          setShowReportForm(true)
                          setReportFormData({ ...reportFormData, jobTitle: searchQuery, jobId: "" })
                        }}
                        className="gap-2"
                      >
                        <Plus className="h-5 w-5" />
                        Create Job & Report Issue
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {showReportForm && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-2xl">Submit Report</CardTitle>
                  <CardDescription>
                    {reportFormData.jobId
                      ? "Add a report to existing job"
                      : "This will create a new job and attach your report"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleReportSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Job Title</label>
                      <Input
                        value={reportFormData.jobTitle}
                        onChange={(e) => setReportFormData({ ...reportFormData, jobTitle: e.target.value })}
                        placeholder="e.g., IT—Reset Staff Password, Repair AC Unit"
                        required
                        disabled={!!reportFormData.jobId}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Name</label>
                        <Input
                          value={reportFormData.reporterName}
                          onChange={(e) => setReportFormData({ ...reportFormData, reporterName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Email</label>
                        <Input
                          type="email"
                          value={reportFormData.reporterEmail}
                          onChange={(e) => setReportFormData({ ...reportFormData, reporterEmail: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Description</label>
                      <textarea
                        className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background"
                        value={reportFormData.description}
                        onChange={(e) => setReportFormData({ ...reportFormData, description: e.target.value })}
                        placeholder="Place address, specific location details, and describe the issue or update in detail..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Category</label>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          value={reportFormData.category}
                          onChange={(e) => setReportFormData({ ...reportFormData, category: e.target.value })}
                        >
                          <option value="issue">Issue</option>
                          <option value="update">Update</option>
                          <option value="completion">Completion</option>
                          <option value="question">Question</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Priority</label>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          value={reportFormData.priority}
                          onChange={(e) => setReportFormData({ ...reportFormData, priority: e.target.value })}
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Parish</label>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-input bg-background"
                          value={reportFormData.parish}
                          onChange={(e) => setReportFormData({ ...reportFormData, parish: e.target.value })}
                        >
                          <option value="Kingston">Kingston</option>
                          <option value="St. Andrew">St. Andrew</option>
                          <option value="St. Catherine">St. Catherine</option>
                          <option value="Clarendon">Clarendon</option>
                          <option value="Manchester">Manchester</option>
                          <option value="St. Elizabeth">St. Elizabeth</option>
                          <option value="Westmoreland">Westmoreland</option>
                          <option value="Hanover">Hanover</option>
                          <option value="St. James">St. James</option>
                          <option value="Trelawny">Trelawny</option>
                          <option value="St. Ann">St. Ann</option>
                          <option value="St. Mary">St. Mary</option>
                          <option value="Portland">Portland</option>
                          <option value="St. Thomas">St. Thomas</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" size="lg" className="flex-1">
                        Submit Report
                      </Button>
                      <Button type="button" size="lg" variant="outline" onClick={() => setShowReportForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {selectedJob && (
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{selectedJob.title}</CardTitle>
                      <CardDescription className="text-base">{selectedJob.description}</CardDescription>
                      <div className="flex gap-2 mt-4">
                        <Badge variant="outline">{selectedJob.category}</Badge>
                        <Badge variant="outline">{selectedJob.parish}</Badge>
                        <Badge className={getStatusColor(selectedJob.status)}>{selectedJob.status}</Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setShowReportForm(true)
                        setReportFormData({ ...reportFormData, jobTitle: selectedJob.title, jobId: selectedJob.id })
                      }}
                      className="gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      Add Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Related Reports ({selectedJob.reports?.length || 0})
                  </h3>
                  {selectedJob.reports && selectedJob.reports.length > 0 ? (
                    <div className="space-y-3">
                      {selectedJob.reports.map((report) => (
                        <Card key={report.id}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge className={getPriorityColor(report.priority)}>{report.priority}</Badge>
                                <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                                <Badge variant="outline">{report.category}</Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {new Date(report.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <p className="text-sm mb-2">{report.description}</p>
                            <p className="text-xs text-muted-foreground">Reported by: {report.reporterName}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No reports yet for this job</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
      <ChatbotButton />
    </div>
  )
}
