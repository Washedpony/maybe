"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Upload, FileText, User, Briefcase, ArrowLeft, ArrowRight } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { ChatbotButton } from "@/components/chatbot-button"

//Register 
type Step = {
  id: number
  title: string
  description: string
}

const steps: Step[] = [
  { id: 1, title: "Personal Information", description: "Tell us about yourself" },
  { id: 2, title: "Qualifications", description: "Share your education and experience" },
  { id: 3, title: "Documents", description: "Upload required documents" },
  { id: 4, title: "Review & Submit", description: "Review your application" },
]

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    // Step 2: Qualifications
    education: "",
    experience: "",
    skills: "",
    references: "",
    // Step 3: Documents
    resume: null as File | null,
    coverLetter: null as File | null,
    certificates: null as File | null,
  })

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const handleFileChange = (field: string, file: File | null) => {
    setFormData({ ...formData, [field]: file })
  }

  if (submitted) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto flex items-center justify-center p-6">
            <Card className="border-2 border-success max-w-2xl w-full">
              <CardContent className="pt-12 pb-12 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-success/20">
                    <CheckCircle2 className="h-16 w-16 text-success" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">Application Submitted Successfully!</h2>
                  <p className="text-lg text-muted-foreground">
                    Your application has been received and is under review. You will be notified of any updates via
                    email and SMS.
                  </p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" onClick={() => (window.location.href = "/community")}>
                    Back to Community Board
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => (window.location.href = "/")}>
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
        <ChatbotButton />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div>
              <Button variant="ghost" onClick={() => (window.location.href = "/community")} className="mb-4 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Community Board
              </Button>
              <h1 className="text-4xl font-bold mb-2">Submit Application</h1>
              <p className="text-lg text-muted-foreground">Teaching Position - Ministry of Education</p>
            </div>

            {/* Progress Bar */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Step {currentStep} of {steps.length}
                    </span>
                    <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="grid grid-cols-4 gap-2">
                    {steps.map((step) => (
                      <div
                        key={step.id}
                        className={`text-center ${
                          step.id === currentStep
                            ? "text-primary font-medium"
                            : step.id < currentStep
                              ? "text-success"
                              : "text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm">{step.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step Content */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  {currentStep === 1 && <User className="h-6 w-6 text-primary" />}
                  {currentStep === 2 && <Briefcase className="h-6 w-6 text-primary" />}
                  {currentStep === 3 && <Upload className="h-6 w-6 text-primary" />}
                  {currentStep === 4 && <FileText className="h-6 w-6 text-primary" />}
                  {steps[currentStep - 1].title}
                </CardTitle>
                <CardDescription className="text-base">{steps[currentStep - 1].description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-base">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="Enter your first name"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="text-base h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-base">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Enter your last name"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="text-base h-12"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="text-base h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(876) 123-4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="text-base h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-base">
                        Address *
                      </Label>
                      <Textarea
                        id="address"
                        placeholder="Enter your full address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="text-base min-h-24"
                      />
                    </div>
                  </>
                )}

                {/* Step 2: Qualifications */}
                {currentStep === 2 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="education" className="text-base">
                        Education *
                      </Label>
                      <Textarea
                        id="education"
                        placeholder="List your educational qualifications (degrees, certifications, etc.)"
                        value={formData.education}
                        onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                        className="text-base min-h-32"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-base">
                        Work Experience *
                      </Label>
                      <Textarea
                        id="experience"
                        placeholder="Describe your relevant work experience"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="text-base min-h-32"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="skills" className="text-base">
                        Skills & Competencies *
                      </Label>
                      <Textarea
                        id="skills"
                        placeholder="List your relevant skills and competencies"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        className="text-base min-h-32"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="references" className="text-base">
                        References
                      </Label>
                      <Textarea
                        id="references"
                        placeholder="Provide contact information for 2-3 professional references"
                        value={formData.references}
                        onChange={(e) => setFormData({ ...formData, references: e.target.value })}
                        className="text-base min-h-24"
                      />
                    </div>
                  </>
                )}

                {/* Step 3: Documents */}
                {currentStep === 3 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="resume" className="text-base">
                        Resume / CV *
                      </Label>
                      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <Input
                          id="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange("resume", e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <Label htmlFor="resume" className="cursor-pointer">
                          <Button type="button" variant="outline" size="lg" asChild>
                            <span>Choose File</span>
                          </Button>
                        </Label>
                        {formData.resume && (
                          <p className="text-sm text-muted-foreground mt-2">Selected: {formData.resume.name}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">PDF, DOC, or DOCX (Max 5MB)</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coverLetter" className="text-base">
                        Cover Letter
                      </Label>
                      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <Input
                          id="coverLetter"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange("coverLetter", e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <Label htmlFor="coverLetter" className="cursor-pointer">
                          <Button type="button" variant="outline" size="lg" asChild>
                            <span>Choose File</span>
                          </Button>
                        </Label>
                        {formData.coverLetter && (
                          <p className="text-sm text-muted-foreground mt-2">Selected: {formData.coverLetter.name}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">PDF, DOC, or DOCX (Max 5MB)</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="certificates" className="text-base">
                        Certificates & Credentials
                      </Label>
                      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <Input
                          id="certificates"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange("certificates", e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <Label htmlFor="certificates" className="cursor-pointer">
                          <Button type="button" variant="outline" size="lg" asChild>
                            <span>Choose File</span>
                          </Button>
                        </Label>
                        {formData.certificates && (
                          <p className="text-sm text-muted-foreground mt-2">Selected: {formData.certificates.name}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">PDF or Image (Max 10MB)</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="p-6 bg-muted rounded-lg space-y-4">
                      <h3 className="text-xl font-semibold">Personal Information</h3>
                      <div className="grid md:grid-cols-2 gap-4 text-base">
                        <div>
                          <p className="text-muted-foreground">Name</p>
                          <p className="font-medium">
                            {formData.firstName} {formData.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-medium">{formData.email}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Phone</p>
                          <p className="font-medium">{formData.phone}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Address</p>
                          <p className="font-medium">{formData.address}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-muted rounded-lg space-y-4">
                      <h3 className="text-xl font-semibold">Qualifications</h3>
                      <div className="space-y-4 text-base">
                        <div>
                          <p className="text-muted-foreground mb-1">Education</p>
                          <p className="font-medium">{formData.education}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Experience</p>
                          <p className="font-medium">{formData.experience}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Skills</p>
                          <p className="font-medium">{formData.skills}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-muted rounded-lg space-y-4">
                      <h3 className="text-xl font-semibold">Documents</h3>
                      <div className="space-y-2 text-base">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-success" />
                          <span>Resume: {formData.resume?.name || "Not uploaded"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {formData.coverLetter ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : (
                            <div className="h-5 w-5" />
                          )}
                          <span>Cover Letter: {formData.coverLetter?.name || "Not uploaded"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {formData.certificates ? (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          ) : (
                            <div className="h-5 w-5" />
                          )}
                          <span>Certificates: {formData.certificates?.name || "Not uploaded"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-4">
                  {currentStep > 1 && (
                    <Button variant="outline" size="lg" onClick={handleBack} className="gap-2 bg-transparent">
                      <ArrowLeft className="h-5 w-5" />
                      Back
                    </Button>
                  )}
                  {currentStep < steps.length ? (
                    <Button size="lg" onClick={handleNext} className="flex-1 gap-2">
                      Next
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Button size="lg" onClick={handleSubmit} className="flex-1">
                      Submit Application
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <ChatbotButton />
    </div>
  )
}
