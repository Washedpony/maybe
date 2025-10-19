// Demo data service for testing without Firebase
// Provides mock data and localStorage-based persistence

import type { Job, MicroGig, JobApplication, Issue } from "./types"

const DEMO_JOBS_KEY = "joust_demo_jobs"
const DEMO_GIGS_KEY = "joust_demo_gigs"
const DEMO_ISSUES_KEY = "joust_demo_issues"
const DEMO_APPLICATIONS_KEY = "joust_demo_applications"

const isBrowser = typeof window !== "undefined"

const DEMO_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Web Developer",
    description:
      "Looking for an experienced web developer to build modern government websites. Must have experience with React, Next.js, and accessibility standards. This is a full-time position with excellent benefits including health insurance, pension, and professional development opportunities.",
    employerId: "demo-employer-1",
    employerName: "Ministry of Technology",
    parish: "Kingston",
    category: "Technology",
    type: "full-time",
    salary: "$50,000 - $70,000 JMD/month",
    requirements: ["JavaScript", "React", "Next.js", "Accessibility Standards", "3+ years experience"],
    status: "active",
    applications: 15,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "job-2",
    title: "Graphic Designer",
    description:
      "Creative graphic designer needed for marketing materials, social media content, and public awareness campaigns. Must be proficient in Adobe Creative Suite and have a strong portfolio.",
    employerId: "demo-employer-2",
    employerName: "Ministry of Information",
    parish: "St. Andrew",
    category: "Design",
    type: "contract",
    salary: "$30/hour",
    requirements: ["Adobe Creative Suite", "Branding", "Print Design", "Social Media Design"],
    status: "active",
    applications: 8,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "job-3",
    title: "Primary School Teacher",
    description:
      "Seeking qualified primary school teachers for schools across Jamaica. Must have teaching certification and passion for education. Competitive salary with benefits.",
    employerId: "demo-employer-3",
    employerName: "Ministry of Education",
    parish: "Manchester",
    category: "Education",
    type: "full-time",
    salary: "$45,000 - $60,000 JMD/month",
    requirements: ["Bachelor's in Education", "Teaching Certification", "2+ years experience"],
    status: "active",
    applications: 23,
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "job-4",
    title: "Healthcare Administrator",
    description:
      "Administrative role in public healthcare facility. Manage patient records, scheduling, and coordinate with medical staff. Experience in healthcare administration required.",
    employerId: "demo-employer-4",
    employerName: "Ministry of Health",
    parish: "St. James",
    category: "Healthcare",
    type: "full-time",
    salary: "$55,000 - $75,000 JMD/month",
    requirements: ["Healthcare Administration Degree", "Medical Records Management", "5+ years experience"],
    status: "active",
    applications: 12,
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "job-5",
    title: "Civil Engineer",
    description:
      "Infrastructure development projects across Jamaica. Design and oversee construction of roads, bridges, and public facilities. Professional engineering license required.",
    employerId: "demo-employer-5",
    employerName: "Ministry of Infrastructure",
    parish: "Clarendon",
    category: "Engineering",
    type: "full-time",
    salary: "$80,000 - $120,000 JMD/month",
    requirements: ["Civil Engineering Degree", "Professional License", "AutoCAD", "7+ years experience"],
    status: "active",
    applications: 6,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
]

const DEMO_GIGS: MicroGig[] = [
  {
    id: "gig-1",
    title: "Census Data Entry",
    description:
      "Enter census survey data from paper forms into digital system. Training provided. Must have basic computer skills and attention to detail.",
    creatorId: "demo-admin-1",
    parish: "Kingston",
    category: "Data Entry",
    payment: 2500,
    deadline: new Date("2025-02-28"),
    maxAcceptances: 20,
    acceptedCount: 5,
    status: "active",
    requirements: ["Basic computer skills", "Attention to detail", "Available for 2-3 hours"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "gig-2",
    title: "Community Survey Completion",
    description:
      "Complete a 20-minute survey about local infrastructure needs in your community. Help improve government services.",
    creatorId: "demo-admin-1",
    parish: "St. Andrew",
    category: "Survey",
    payment: 500,
    deadline: new Date("2025-02-25"),
    maxAcceptances: 100,
    acceptedCount: 55,
    status: "active",
    requirements: ["Must be 18+", "Resident of St. Andrew"],
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "gig-3",
    title: "Document Verification Assistant",
    description:
      "Verify and cross-check government documents for accuracy. Must have excellent attention to detail and ability to spot inconsistencies.",
    creatorId: "demo-admin-1",
    parish: "Kingston",
    category: "Verification",
    payment: 3000,
    deadline: new Date("2025-03-05"),
    maxAcceptances: 10,
    acceptedCount: 2,
    status: "active",
    requirements: ["Attention to detail", "Document handling experience", "Available for 4 hours"],
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "gig-4",
    title: "Public Notice Distribution",
    description:
      "Distribute public health notices to households in your parish. Transportation costs reimbursed. Help spread important information.",
    creatorId: "demo-admin-1",
    parish: "St. Andrew",
    category: "Delivery",
    payment: 4500,
    deadline: new Date("2025-02-27"),
    maxAcceptances: 15,
    acceptedCount: 3,
    status: "active",
    requirements: ["Own transportation", "Available for 1 full day", "Good communication skills"],
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "gig-5",
    title: "Youth Program Feedback Survey",
    description:
      "Provide feedback on government youth programs. Your input helps shape future initiatives for young Jamaicans.",
    creatorId: "demo-admin-1",
    parish: "Kingston",
    category: "Survey",
    payment: 800,
    deadline: new Date("2025-03-10"),
    maxAcceptances: 100,
    acceptedCount: 33,
    status: "active",
    requirements: ["Age 18-30", "Jamaican citizen"],
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "gig-6",
    title: "Business Registry Data Update",
    description:
      "Update business contact information in government database. Basic computer skills required. Help keep business records current.",
    creatorId: "demo-admin-1",
    parish: "Kingston",
    category: "Data Entry",
    payment: 3500,
    deadline: new Date("2025-03-01"),
    maxAcceptances: 25,
    acceptedCount: 5,
    status: "active",
    requirements: ["Basic computer skills", "Data entry experience", "Available for 3-4 hours"],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
]

const DEMO_ISSUES: Issue[] = [
  {
    id: "issue-1",
    title: "Large Pothole on Main Street",
    description:
      "There is a large pothole near the Central Market on Main Street causing traffic issues and potential vehicle damage. It's been there for over 2 weeks and is getting worse with rain.",
    reporterId: "demo-user-1",
    reporterName: "John Citizen",
    parish: "Kingston",
    category: "Infrastructure",
    location: "Main Street, near Central Market",
    status: "reported",
    upvotes: 45,
    priority: "high",
    reportedAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "issue-2",
    title: "Streetlight Not Working",
    description:
      "Streetlight has been out for 2 weeks on Hope Road near the school, making the area unsafe at night for students and residents.",
    reporterId: "demo-user-2",
    reporterName: "Sarah Johnson",
    parish: "St. Andrew",
    category: "Public Safety",
    location: "Hope Road, near the school",
    status: "in-progress",
    upvotes: 28,
    priority: "medium",
    reportedAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "issue-3",
    title: "Overflowing Garbage Bins",
    description:
      "Public garbage bins at the park have been overflowing for days. Creating unsanitary conditions and attracting pests.",
    reporterId: "demo-user-3",
    reporterName: "Michael Brown",
    parish: "Kingston",
    category: "Sanitation",
    location: "National Heroes Park",
    status: "reported",
    upvotes: 67,
    priority: "high",
    reportedAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-01-22"),
  },
  {
    id: "issue-4",
    title: "Broken Water Main",
    description:
      "Water main break causing flooding on residential street. Multiple households affected. Urgent repair needed.",
    reporterId: "demo-user-4",
    reporterName: "Lisa Williams",
    parish: "St. Andrew",
    category: "Infrastructure",
    location: "Constant Spring Road",
    status: "in-progress",
    upvotes: 89,
    priority: "high",
    reportedAt: new Date("2024-01-24"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: "issue-5",
    title: "Damaged Pedestrian Crossing",
    description:
      "Pedestrian crossing markings are completely faded near the school, creating safety hazard for children crossing the street.",
    reporterId: "demo-user-5",
    reporterName: "David Thompson",
    parish: "Kingston",
    category: "Public Safety",
    location: "Half Way Tree Road, near primary school",
    status: "reported",
    upvotes: 34,
    priority: "medium",
    reportedAt: new Date("2024-01-26"),
    updatedAt: new Date("2024-01-26"),
  },
]

// Initialize demo data
export const initDemoData = () => {
  if (!isBrowser) return

  if (!localStorage.getItem(DEMO_JOBS_KEY)) {
    localStorage.setItem(DEMO_JOBS_KEY, JSON.stringify(DEMO_JOBS))
  }
  if (!localStorage.getItem(DEMO_GIGS_KEY)) {
    localStorage.setItem(DEMO_GIGS_KEY, JSON.stringify(DEMO_GIGS))
  }
  if (!localStorage.getItem(DEMO_ISSUES_KEY)) {
    localStorage.setItem(DEMO_ISSUES_KEY, JSON.stringify(DEMO_ISSUES))
  }
  if (!localStorage.getItem(DEMO_APPLICATIONS_KEY)) {
    localStorage.setItem(DEMO_APPLICATIONS_KEY, JSON.stringify([]))
  }
}

// Demo data service
export const demoDataService = {
  // Jobs
  async getJobs(parish?: string) {
    if (!isBrowser) return []
    const jobs = JSON.parse(localStorage.getItem(DEMO_JOBS_KEY) || "[]") as Job[]
    return parish
      ? jobs.filter((j) => j.parish === parish && j.status === "active")
      : jobs.filter((j) => j.status === "active")
  },

  async getJob(id: string) {
    if (!isBrowser) return null
    const jobs = JSON.parse(localStorage.getItem(DEMO_JOBS_KEY) || "[]") as Job[]
    return jobs.find((j) => j.id === id) || null
  },

  async createJob(jobData: Partial<Job>) {
    if (!isBrowser) throw new Error("Cannot access localStorage during SSR")
    const jobs = JSON.parse(localStorage.getItem(DEMO_JOBS_KEY) || "[]") as Job[]
    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: jobData.title || "",
      description: jobData.description || "",
      employerId: jobData.employerId || "",
      employerName: jobData.employerName || "",
      parish: jobData.parish || "",
      category: jobData.category || "",
      type: jobData.type || "full-time",
      salary: jobData.salary || "",
      requirements: jobData.requirements || [],
      status: "active",
      applications: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    jobs.push(newJob)
    localStorage.setItem(DEMO_JOBS_KEY, JSON.stringify(jobs))
    return newJob.id
  },

  async updateJob(id: string, updates: Partial<Job>) {
    if (!isBrowser) throw new Error("Cannot access localStorage during SSR")
    const jobs = JSON.parse(localStorage.getItem(DEMO_JOBS_KEY) || "[]") as Job[]
    const index = jobs.findIndex((j) => j.id === id)
    if (index !== -1) {
      jobs[index] = { ...jobs[index], ...updates, updatedAt: new Date() }
      localStorage.setItem(DEMO_JOBS_KEY, JSON.stringify(jobs))
    }
  },

  async deleteJob(id: string) {
    if (!isBrowser) throw new Error("Cannot access localStorage during SSR")
    const jobs = JSON.parse(localStorage.getItem(DEMO_JOBS_KEY) || "[]") as Job[]
    const filtered = jobs.filter((j) => j.id !== id)
    localStorage.setItem(DEMO_JOBS_KEY, JSON.stringify(filtered))
  },

  // Gigs
  async getGigs(parish?: string) {
    if (!isBrowser) return []
    const gigs = JSON.parse(localStorage.getItem(DEMO_GIGS_KEY) || "[]") as MicroGig[]
    return parish
      ? gigs.filter((g) => g.parish === parish && g.status === "active")
      : gigs.filter((g) => g.status === "active")
  },

  async getGig(id: string) {
    if (!isBrowser) return null
    const gigs = JSON.parse(localStorage.getItem(DEMO_GIGS_KEY) || "[]") as MicroGig[]
    return gigs.find((g) => g.id === id) || null
  },

  async createGig(gigData: Partial<MicroGig>) {
    if (!isBrowser) throw new Error("Cannot access localStorage during SSR")
    const gigs = JSON.parse(localStorage.getItem(DEMO_GIGS_KEY) || "[]") as MicroGig[]
    const newGig: MicroGig = {
      id: `gig-${Date.now()}`,
      title: gigData.title || "",
      description: gigData.description || "",
      creatorId: gigData.creatorId || "",
      parish: gigData.parish || "",
      category: gigData.category || "",
      payment: gigData.payment || 0,
      deadline: gigData.deadline || new Date(),
      maxAcceptances: gigData.maxAcceptances || 1,
      acceptedCount: 0,
      status: "active",
      requirements: gigData.requirements || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    gigs.push(newGig)
    localStorage.setItem(DEMO_GIGS_KEY, JSON.stringify(gigs))
    return newGig.id
  },

  async acceptGig(gigId: string, userId: string) {
    if (!isBrowser) throw new Error("Cannot access localStorage during SSR")
    const gigs = JSON.parse(localStorage.getItem(DEMO_GIGS_KEY) || "[]") as MicroGig[]
    const index = gigs.findIndex((g) => g.id === gigId)
    if (index !== -1) {
      gigs[index].acceptedCount = (gigs[index].acceptedCount || 0) + 1
      localStorage.setItem(DEMO_GIGS_KEY, JSON.stringify(gigs))
    }
    return `acceptance-${Date.now()}`
  },

  // Issues
  async getIssues(parish?: string) {
    if (!isBrowser) return []
    const issues = JSON.parse(localStorage.getItem(DEMO_ISSUES_KEY) || "[]") as Issue[]
    return parish ? issues.filter((i) => i.parish === parish) : issues
  },

  async getIssue(id: string) {
    if (!isBrowser) return null
    const issues = JSON.parse(localStorage.getItem(DEMO_ISSUES_KEY) || "[]") as Issue[]
    return issues.find((i) => i.id === id) || null
  },

  async createIssue(issueData: Partial<Issue>) {
    if (!isBrowser) throw new Error("Cannot access localStorage during SSR")
    const issues = JSON.parse(localStorage.getItem(DEMO_ISSUES_KEY) || "[]") as Issue[]
    const newIssue: Issue = {
      id: `issue-${Date.now()}`,
      title: issueData.title || "",
      description: issueData.description || "",
      reporterId: issueData.reporterId || "",
      reporterName: issueData.reporterName || "",
      parish: issueData.parish || "",
      category: issueData.category || "",
      location: issueData.location || "",
      status: "reported",
      upvotes: 0,
      priority: issueData.priority || "medium",
      reportedAt: new Date(),
      updatedAt: new Date(),
    }
    issues.push(newIssue)
    localStorage.setItem(DEMO_ISSUES_KEY, JSON.stringify(issues))
    return newIssue.id
  },

  async updateIssue(id: string, updates: Partial<Issue>) {
    if (!isBrowser) throw new Error("Cannot access localStorage during SSR")
    const issues = JSON.parse(localStorage.getItem(DEMO_ISSUES_KEY) || "[]") as Issue[]
    const index = issues.findIndex((i) => i.id === id)
    if (index !== -1) {
      issues[index] = { ...issues[index], ...updates, updatedAt: new Date() }
      localStorage.setItem(DEMO_ISSUES_KEY, JSON.stringify(issues))
    }
  },

  async upvoteIssue(id: string) {
    if (!isBrowser) throw new Error("Cannot access localStorage during SSR")
    const issues = JSON.parse(localStorage.getItem(DEMO_ISSUES_KEY) || "[]") as Issue[]
    const index = issues.findIndex((i) => i.id === id)
    if (index !== -1) {
      issues[index].upvotes = (issues[index].upvotes || 0) + 1
      localStorage.setItem(DEMO_ISSUES_KEY, JSON.stringify(issues))
    }
  },

  async deleteIssue(id: string) {
    if (!isBrowser) throw new Error("Cannot access localStorage during SSR")
    const issues = JSON.parse(localStorage.getItem(DEMO_ISSUES_KEY) || "[]") as Issue[]
    const filtered = issues.filter((i) => i.id !== id)
    localStorage.setItem(DEMO_ISSUES_KEY, JSON.stringify(filtered))
  },

  // Applications
  async createApplication(appData: Partial<JobApplication>) {
    if (!isBrowser) throw new Error("Cannot access localStorage during SSR")
    const apps = JSON.parse(localStorage.getItem(DEMO_APPLICATIONS_KEY) || "[]") as JobApplication[]
    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: appData.jobId || "",
      userId: appData.userId || "",
      userName: appData.userName || "",
      userEmail: appData.userEmail || "",
      coverLetter: appData.coverLetter || "",
      status: "pending",
      appliedAt: new Date(),
      updatedAt: new Date(),
    }
    apps.push(newApp)
    localStorage.setItem(DEMO_APPLICATIONS_KEY, JSON.stringify(apps))

    // Increment job application count
    if (appData.jobId) {
      const jobs = JSON.parse(localStorage.getItem(DEMO_JOBS_KEY) || "[]") as Job[]
      const jobIndex = jobs.findIndex((j) => j.id === appData.jobId)
      if (jobIndex !== -1) {
        jobs[jobIndex].applications = (jobs[jobIndex].applications || 0) + 1
        localStorage.setItem(DEMO_JOBS_KEY, JSON.stringify(jobs))
      }
    }

    return newApp.id
  },

  async getUserApplications(userId: string) {
    if (!isBrowser) return []
    const apps = JSON.parse(localStorage.getItem(DEMO_APPLICATIONS_KEY) || "[]") as JobApplication[]
    return apps.filter((a) => a.userId === userId)
  },
}

// Initialize on import
if (isBrowser) {
  initDemoData()
}
