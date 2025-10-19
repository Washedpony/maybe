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
  employer: string
  employerId: string
  parish: string
  salaryMin: number
  salaryMax: number
  currency: string
  jobType: "full-time" | "part-time" | "contract"
  requiredSkills: string[]
  deadline: Date
  status: "active" | "closed" | "filled"
  applications: number
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
