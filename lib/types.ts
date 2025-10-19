// User Types
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  parish: string
  skills: string[]
  bio?: string
  profileImage?: string
  createdAt: Date
  updatedAt: Date
  role: "citizen" | "admin" | "employer"
}

// Job Types
export interface Job {
  id: string
  title: string
  description: string
  employerId: string
  employerName: string
  parish: string
  category: string
  type: string
  salary: string
  requirements: string[]
  status: "active" | "closed" | "filled"
  applications: number
  reports?: Report[] // Added reports array
  createdAt: Date
  updatedAt: Date
}

// Micro-Gig Types
export interface MicroGig {
  id: string
  title: string
  description: string
  category: "data-entry" | "survey" | "verification" | "delivery" | "other"
  payment: number
  currency: string
  duration: string
  location: string
  parish: string
  deadline: Date
  totalSpots: number
  acceptedCount: number
  status: "active" | "closed" | "completed"
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

// Gig Acceptance Types
export interface GigAcceptance {
  id: string
  gigId: string
  userId: string
  status: "accepted" | "in-progress" | "completed" | "cancelled"
  acceptedAt: Date
  completedAt?: Date
  paymentStatus: "pending" | "processing" | "completed"
}

// Application Types
export interface JobApplication {
  id: string
  jobId: string
  userId: string
  status: "submitted" | "reviewing" | "interview" | "accepted" | "rejected"
  appliedAt: Date
  updatedAt: Date
  notes?: string
}

// Analytics Types
export interface AnalyticsData {
  id: string
  date: Date
  activeJobs: number
  totalApplications: number
  citizensServed: number
  microGigsCompleted: number
  totalPaymentProcessed: number
  skillsDemand: Record<string, number>
  parishStats: Record<string, { jobs: number; citizens: number }>
}

// Grant Types
export interface Grant {
  id: string
  title: string
  description: string
  amount: number
  currency: string
  eligibility: string[]
  deadline: Date
  status: "active" | "closed"
  applications: number
  createdAt: Date
  updatedAt: Date
}

// Issue Types
export interface Issue {
  id: string
  title: string
  description: string
  category: "pothole" | "infrastructure" | "safety" | "other"
  location: string
  parish: string
  latitude?: number
  longitude?: number
  status: "reported" | "acknowledged" | "in-progress" | "resolved"
  reportedBy: string
  reportedAt: Date
  updatedAt: Date
  upvotes: number
  images?: string[]
}

// Report Types
export interface Report {
  id: string
  jobId: string
  jobTitle: string
  reporterId: string
  reporterName: string
  reporterEmail: string
  description: string
  category: "issue" | "update" | "completion" | "question"
  priority: "low" | "medium" | "high"
  status: "open" | "in-progress" | "resolved" | "closed"
  createdAt: Date
  updatedAt: Date
}
