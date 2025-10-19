"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle, Clock, Download, Mail, Phone, MapPin, FileText, Search } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { ChatbotButton } from "@/components/chatbot-button"

type Submission = {
  id: string
  applicantName: string
  email: string
  phone: string
  address: string
  postingTitle: string
  postingType: "job" | "grant" | "announcement"
  submittedDate: string
  status: "pending" | "approved" | "rejected"
  education: string
  experience: string
  skills: string
  documents: {
    resume: string
    coverLetter?: string
    certificates?: string
  }
}

const mockSubmissions: Submission[] = [
  {
    id: "1",
    applicantName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(876) 555-0123",
    address: "123 Main Street, Kingston, Jamaica",
    postingTitle: "Teaching Position - Ministry of Education",
    postingType: "job",
    submittedDate: "2025-01-15",
    status: "pending",
    education: "Bachelor of Education, University of the West Indies (2018-2022)",
    experience: "2 years teaching experience at Kingston Primary School",
    skills: "Classroom management, Curriculum development, Student assessment",
    documents: {
      resume: "sarah_johnson_resume.pdf",
      coverLetter: "sarah_johnson_cover.pdf",
      certificates: "teaching_cert.pdf",
    },
  },
  {
    id: "2",
    applicantName: "Marcus Brown",
    email: "marcus.brown@email.com",
    phone: "(876) 555-0456",
    address: "456 Oak Avenue, Montego Bay, Jamaica",
    postingTitle: "Small Business Development Grant",
    postingType: "grant",
    submittedDate: "2025-01-14",
    status: "pending",
    education: "MBA, Northern Caribbean University (2015-2017)",
    experience: "5 years running a small retail business",
    skills: "Business planning, Financial management, Marketing",
    documents: {
      resume: "marcus_brown_resume.pdf",
      certificates: "business_registration.pdf",
    },
  },
  {
    id: "3",
    applicantName: "Keisha Williams",
    email: "keisha.williams@email.com",
    phone: "(876) 555-0789",
    address: "789 Palm Road, Spanish Town, Jamaica",
    postingTitle: "Healthcare Worker - Public Hospital",
    postingType: "job",
    submittedDate: "2025-01-13",
    status: "approved",
    education: "Bachelor of Nursing, University of Technology (2016-2020)",
    experience: "3 years as registered nurse at Kingston Public Hospital",
    skills: "Patient care, Emergency response, Medical documentation",
    documents: {
      resume: "keisha_williams_resume.pdf",
      coverLetter: "keisha_williams_cover.pdf",
      certificates: "nursing_license.pdf",
    },
  },
]

export default function ReviewsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [reviewNotes, setReviewNotes] = useState("")

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesStatus = filterStatus === "all" || sub.status === filterStatus
    const matchesSearch =
      sub.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.postingTitle.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleApprove = (id: string) => {
    setSubmissions(submissions.map((sub) => (sub.id === id ? { ...sub, status: "approved" as const } : sub)))
    setSelectedSubmission(null)
  }

  const handleReject = (id: string) => {
    setSubmissions(submissions.map((sub) => (sub.id === id ? { ...sub, status: "rejected" as const } : sub)))
    setSelectedSubmission(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
      case "approved":
        return "bg-success/20 text-success border-success/30"
      case "rejected":
        return "bg-destructive/20 text-destructive border-destructive/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle2 className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold mb-2">Review Submissions</h1>
              <p className="text-lg text-muted-foreground">Review and manage citizen applications</p>
            </div>

            {/* Statistics */}
            <div className="grid gap-6 md:grid-cols-4">
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Total Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{submissions.length}</div>
                </CardContent>
              </Card>
              <Card className="border-2 border-yellow-500/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Pending Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-500">
                    {submissions.filter((s) => s.status === "pending").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-success/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Approved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">
                    {submissions.filter((s) => s.status === "approved").length}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-destructive/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Rejected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-destructive">
                    {submissions.filter((s) => s.status === "rejected").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Submissions List */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Submissions</CardTitle>
                  <CardDescription className="text-base">Click on a submission to review details</CardDescription>
                  <div className="flex gap-4 pt-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="Search by name or posting..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 text-base h-12"
                      />
                    </div>
                    <Button
                      variant={filterStatus === "all" ? "default" : "outline"}
                      onClick={() => setFilterStatus("all")}
                      size="lg"
                    >
                      All
                    </Button>
                    <Button
                      variant={filterStatus === "pending" ? "default" : "outline"}
                      onClick={() => setFilterStatus("pending")}
                      size="lg"
                    >
                      Pending
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredSubmissions.map((submission) => (
                    <Card
                      key={submission.id}
                      className={`border-2 cursor-pointer transition-colors ${
                        selectedSubmission?.id === submission.id ? "border-primary" : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">{submission.applicantName}</CardTitle>
                            <CardDescription className="text-sm">{submission.postingTitle}</CardDescription>
                          </div>
                          <Badge className={`${getStatusColor(submission.status)} text-xs flex items-center gap-1`}>
                            {getStatusIcon(submission.status)}
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Submitted: {new Date(submission.submittedDate).toLocaleDateString()}
                        </p>
                      </CardHeader>
                    </Card>
                  ))}
                  {filteredSubmissions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">No submissions found</div>
                  )}
                </CardContent>
              </Card>

              {/* Submission Details */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Submission Details</CardTitle>
                  <CardDescription className="text-base">
                    {selectedSubmission ? "Review applicant information" : "Select a submission to view details"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedSubmission ? (
                    <Tabs defaultValue="info" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="info">Info</TabsTrigger>
                        <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                      </TabsList>
                      <TabsContent value="info" className="space-y-6 mt-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 text-base">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <span>{selectedSubmission.email}</span>
                              </div>
                              <div className="flex items-center gap-3 text-base">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <span>{selectedSubmission.phone}</span>
                              </div>
                              <div className="flex items-center gap-3 text-base">
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                                <span>{selectedSubmission.address}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold mb-2">Application Details</h3>
                            <div className="space-y-2 text-base">
                              <div>
                                <span className="text-muted-foreground">Position:</span>
                                <p className="font-medium">{selectedSubmission.postingTitle}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Submitted:</span>
                                <p className="font-medium">
                                  {new Date(selectedSubmission.submittedDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Status:</span>
                                <Badge className={`${getStatusColor(selectedSubmission.status)} ml-2`}>
                                  {selectedSubmission.status.charAt(0).toUpperCase() +
                                    selectedSubmission.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="qualifications" className="space-y-6 mt-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Education</h3>
                          <p className="text-base text-muted-foreground">{selectedSubmission.education}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Experience</h3>
                          <p className="text-base text-muted-foreground">{selectedSubmission.experience}</p>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Skills</h3>
                          <p className="text-base text-muted-foreground">{selectedSubmission.skills}</p>
                        </div>
                      </TabsContent>
                      <TabsContent value="documents" className="space-y-4 mt-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 border-2 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium text-base">Resume</p>
                                <p className="text-sm text-muted-foreground">{selectedSubmission.documents.resume}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </div>
                          {selectedSubmission.documents.coverLetter && (
                            <div className="flex items-center justify-between p-4 border-2 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="font-medium text-base">Cover Letter</p>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedSubmission.documents.coverLetter}
                                  </p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                                <Download className="h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          )}
                          {selectedSubmission.documents.certificates && (
                            <div className="flex items-center justify-between p-4 border-2 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="font-medium text-base">Certificates</p>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedSubmission.documents.certificates}
                                  </p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                                <Download className="h-4 w-4" />
                                Download
                              </Button>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Select a submission from the list to view details</p>
                    </div>
                  )}
                </CardContent>
                {selectedSubmission && selectedSubmission.status === "pending" && (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="notes" className="text-base">
                          Review Notes
                        </Label>
                        <Textarea
                          id="notes"
                          placeholder="Add notes about this application..."
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          className="text-base min-h-24"
                        />
                      </div>
                      <div className="flex gap-4">
                        <Button
                          size="lg"
                          onClick={() => handleApprove(selectedSubmission.id)}
                          className="flex-1 gap-2 bg-success hover:bg-success/90"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          Approve
                        </Button>
                        <Button
                          size="lg"
                          variant="destructive"
                          onClick={() => handleReject(selectedSubmission.id)}
                          className="flex-1 gap-2"
                        >
                          <XCircle className="h-5 w-5" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
      <ChatbotButton />
    </div>
  )
}
