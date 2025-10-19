"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Eye, FileText, Briefcase, Megaphone } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { ChatbotButton } from "@/components/chatbot-button"

type Posting = {
  id: string
  title: string
  type: "job" | "grant" | "announcement"
  description: string
  deadline: string
  status: "active" | "closed"
  submissions: number
}

const mockPostings: Posting[] = [
  {
    id: "1",
    title: "Teaching Position - Ministry of Education",
    type: "job",
    description: "Seeking qualified teachers for primary schools",
    deadline: "2025-03-31",
    status: "active",
    submissions: 45,
  },
  {
    id: "2",
    title: "Small Business Development Grant",
    type: "grant",
    description: "Financial support for small business owners",
    deadline: "2025-04-15",
    status: "active",
    submissions: 23,
  },
  {
    id: "3",
    title: "Youth Employment Program",
    type: "announcement",
    description: "New program for youth ages 18-25",
    deadline: "2025-03-20",
    status: "active",
    submissions: 67,
  },
]

export default function AdminPage() {
  const [postings, setPostings] = useState<Posting[]>(mockPostings)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    type: "job" as "job" | "grant" | "announcement",
    description: "",
    deadline: "",
    requirements: "",
  })

  const handleCreatePosting = () => {
    const newPosting: Posting = {
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type,
      description: formData.description,
      deadline: formData.deadline,
      status: "active",
      submissions: 0,
    }
    setPostings([newPosting, ...postings])
    setShowCreateForm(false)
    setFormData({ title: "", type: "job", description: "", deadline: "", requirements: "" })
  }

  const handleDeletePosting = (id: string) => {
    setPostings(postings.filter((p) => p.id !== id))
  }

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "job":
        return "text-primary"
      case "grant":
        return "text-accent"
      case "announcement":
        return "text-success"
      default:
        return "text-muted-foreground"
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-lg text-muted-foreground">Manage community postings and review submissions</p>
              </div>
              <Button size="lg" onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2">
                <Plus className="h-5 w-5" />
                Create Posting
              </Button>
            </div>

            {/* Statistics */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">Total Postings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{postings.length}</div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">Active Postings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{postings.filter((p) => p.status === "active").length}</div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">Total Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold">{postings.reduce((acc, p) => acc + p.submissions, 0)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Create Form */}
            {showCreateForm && (
              <Card className="border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-2xl">Create New Posting</CardTitle>
                  <CardDescription className="text-base">
                    Fill in the details for your community posting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-base">
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter posting title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="text-base h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-base">
                      Type
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger className="text-base h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="job" className="text-base">
                          Job Posting
                        </SelectItem>
                        <SelectItem value="grant" className="text-base">
                          Grant Opportunity
                        </SelectItem>
                        <SelectItem value="announcement" className="text-base">
                          Announcement
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-base">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Enter posting description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="text-base min-h-32"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements" className="text-base">
                      Requirements
                    </Label>
                    <Textarea
                      id="requirements"
                      placeholder="List requirements or qualifications needed"
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      className="text-base min-h-32"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-base">
                      Deadline
                    </Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="text-base h-12"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button size="lg" onClick={handleCreatePosting} className="flex-1">
                      Publish Posting
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => setShowCreateForm(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Postings List */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">All Postings</h2>
              <div className="space-y-4">
                {postings.map((posting) => (
                  <Card key={posting.id} className="border-2">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg bg-muted ${getTypeColor(posting.type)}`}>
                            {getTypeIcon(posting.type)}
                          </div>
                          <div>
                            <CardTitle className="text-xl mb-1">{posting.title}</CardTitle>
                            <CardDescription className="text-base">{posting.description}</CardDescription>
                            <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                              <span>Deadline: {new Date(posting.deadline).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{posting.submissions} submissions</span>
                              <span>•</span>
                              <span className={posting.status === "active" ? "text-success" : "text-muted-foreground"}>
                                {posting.status === "active" ? "Active" : "Closed"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDeletePosting(posting.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <ChatbotButton />
    </div>
  )
}
