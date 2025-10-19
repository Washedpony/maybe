"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  FileText,
  Megaphone,
  Search,
  Calendar,
  Users,
  ArrowRight,
  AlertCircle,
  Trash2,
  CheckCircle,
} from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { ChatbotButton } from "@/components/chatbot-button"
import { IssueReportForm } from "@/components/issue-report-form"
import { IssueCard } from "@/components/issue-card"
import { useAuth } from "@/lib/auth-context" // fixed import path from @/context/auth-context to @/lib/auth-context

type Posting = {
  id: string
  title: string
  type: "job" | "grant" | "announcement"
  description: string
  deadline: string
  requirements: string[]
  department: string
  submissions: number
  status?: "active" | "closed"
}

const mockPostings: Posting[] = [
  {
    id: "1",
    title: "Teaching Position - Ministry of Education",
    type: "job",
    description:
      "Seeking qualified teachers for primary schools across Jamaica. This position offers competitive salary, benefits, and professional development opportunities.",
    deadline: "2025-03-31",
    requirements: ["Bachelor's degree in Education", "Teaching certification", "2+ years experience"],
    department: "Ministry of Education",
    submissions: 45,
    status: "active",
  },
  {
    id: "2",
    title: "Small Business Development Grant",
    type: "grant",
    description:
      "Financial support for small business owners looking to expand operations or start new ventures. Grants up to $500,000 JMD available.",
    deadline: "2025-04-15",
    requirements: ["Registered business", "Business plan", "Financial statements"],
    department: "Ministry of Industry",
    submissions: 23,
    status: "active",
  },
  {
    id: "3",
    title: "Youth Employment Program",
    type: "announcement",
    description:
      "New program launching to provide job training and placement for youth ages 18-25. Free training in technology, hospitality, and construction sectors.",
    deadline: "2025-03-20",
    requirements: ["Age 18-25", "Jamaican citizen", "High school diploma"],
    department: "Ministry of Labour",
    submissions: 67,
    status: "active",
  },
]

export default function CommunityPage() {
  const [postings, setPostings] = useState<Posting[]>(mockPostings)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "job" | "grant" | "announcement">("all")
  const [showIssueForm, setShowIssueForm] = useState(false)
  const [issues, setIssues] = useState<any[]>([])
  const { user } = useAuth() // Use useAuth hook to get user role
  const userRole = user?.role || "citizen" // Set userRole based on auth context

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const response = await fetch("/api/issues")
        if (response.ok) {
          const data = await response.json()
          setIssues(data)
        }
      } catch (error) {
        console.error("Error loading issues:", error)
      }
    }
    loadIssues()
  }, [])

  const filteredPostings = postings.filter((posting) => {
    const matchesSearch =
      posting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      posting.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || posting.type === filterType
    return matchesSearch && matchesFilter
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "job":
        return <Briefcase className="h-5 w-5" />
      case "grant":
        return <FileText className="h-5 w-5" />
      case "announcement":
        return <Megaphone className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "job":
        return "bg-primary/20 text-primary border-primary/30"
      case "grant":
        return "bg-accent/20 text-accent border-accent/30"
      case "announcement":
        return "bg-success/20 text-success border-success/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleCompleteJob = async (jobId: string) => {
    try {
      await fetch(`/api/jobs/${jobId}/complete`, { method: "POST" })
      const updatedPostings = postings.map((p) => (p.id === jobId ? { ...p, status: "closed" } : p))
      setPostings(updatedPostings)
    } catch (error) {
      console.error("Error completing job:", error)
    }
  }

  const handleRemoveJob = async (jobId: string) => {
    try {
      await fetch(`/api/jobs/${jobId}`, { method: "DELETE" })
      setPostings(postings.filter((p) => p.id !== jobId))
    } catch (error) {
      console.error("Error removing job:", error)
    }
  }

  const handleUpvoteIssue = async (issueId: string) => {
    try {
      await fetch(`/api/issues/${issueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upvote: true }),
      })
      const response = await fetch("/api/issues")
      if (response.ok) {
        setIssues(await response.json())
      }
    } catch (error) {
      console.error("Error upvoting issue:", error)
    }
  }

  const handleIssueStatusChange = async (issueId: string, newStatus: string) => {
    try {
      await fetch(`/api/issues/${issueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      const response = await fetch("/api/issues")
      if (response.ok) {
        setIssues(await response.json())
      }
    } catch (error) {
      console.error("Error updating issue status:", error)
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
              <h1 className="text-4xl font-bold mb-2">Community Board</h1>
              <p className="text-lg text-muted-foreground">
                Browse jobs, grants, announcements, and report community issues
              </p>
            </div>

            {/* Issue Reporting Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <AlertCircle className="h-6 w-6" />
                  Community Issues
                </h2>
                <Button size="lg" onClick={() => setShowIssueForm(!showIssueForm)} className="gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Report Issue
                </Button>
              </div>

              {showIssueForm && (
                <IssueReportForm onClose={() => setShowIssueForm(false)} onSubmit={() => setShowIssueForm(false)} />
              )}

              {issues.length > 0 && (
                <div className="space-y-4">
                  {issues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      {...issue}
                      onUpvote={handleUpvoteIssue}
                      onStatusChange={handleIssueStatusChange}
                      isAdmin={userRole === "admin"}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Search and Filter */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search postings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-base h-12"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={filterType === "all" ? "default" : "outline"}
                      onClick={() => setFilterType("all")}
                      size="lg"
                    >
                      All
                    </Button>
                    <Button
                      variant={filterType === "job" ? "default" : "outline"}
                      onClick={() => setFilterType("job")}
                      size="lg"
                    >
                      Jobs
                    </Button>
                    <Button
                      variant={filterType === "grant" ? "default" : "outline"}
                      onClick={() => setFilterType("grant")}
                      size="lg"
                    >
                      Grants
                    </Button>
                    <Button
                      variant={filterType === "announcement" ? "default" : "outline"}
                      onClick={() => setFilterType("announcement")}
                      size="lg"
                    >
                      News
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/20">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Jobs</p>
                      <p className="text-2xl font-bold">
                        {postings.filter((p) => p.type === "job" && p.status === "active").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-accent/20">
                      <FileText className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Open Grants</p>
                      <p className="text-2xl font-bold">{postings.filter((p) => p.type === "grant").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-success/20">
                      <AlertCircle className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Reported Issues</p>
                      <p className="text-2xl font-bold">{issues.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Postings List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Job Postings & Opportunities</h2>
              {filteredPostings.map((posting) => (
                <Card key={posting.id} className="border-2 hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-muted">{getTypeIcon(posting.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-2xl">{posting.title}</CardTitle>
                            <Badge className={`${getTypeBadgeColor(posting.type)} text-sm`}>
                              {posting.type.charAt(0).toUpperCase() + posting.type.slice(1)}
                            </Badge>
                            {posting.status === "closed" && (
                              <Badge variant="outline" className="text-sm">
                                Closed
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-base mb-4">{posting.description}</CardDescription>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Deadline: {new Date(posting.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>{posting.submissions} applications</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{posting.department}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Requirements:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {posting.requirements.map((req, idx) => (
                                <li key={idx}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="lg" className="gap-2">
                          Apply Now
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                        {userRole === "admin" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCompleteJob(posting.id)}
                              className="gap-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Mark Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveJob(posting.id)}
                              className="gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {filteredPostings.length === 0 && (
              <Card className="border-2">
                <CardContent className="py-12 text-center">
                  <p className="text-lg text-muted-foreground">No postings found matching your search.</p>
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
