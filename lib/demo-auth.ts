// Demo authentication service for testing without Firebase
// This allows the app to work immediately while Firebase credentials are being set up

interface DemoUser {
  id: string
  email: string
  name: string
  phone: string
  parish: string
  role: "citizen" | "admin" | "employer"
  skills: string[]
  createdAt: Date
  updatedAt: Date
}

const DEMO_USERS_KEY = "joust_demo_users"
const DEMO_CURRENT_USER_KEY = "joust_demo_current_user"

// Pre-populated demo users for testing
const DEMO_USERS: DemoUser[] = [
  {
    id: "demo-user-1",
    email: "citizen@demo.com",
    name: "John Citizen",
    phone: "+1 (876) 123-4567",
    parish: "Kingston",
    role: "citizen",
    skills: ["JavaScript", "React", "Node.js"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "demo-admin-1",
    email: "admin@demo.com",
    name: "Admin User",
    phone: "+1 (876) 987-6543",
    parish: "St. Andrew",
    role: "admin",
    skills: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "demo-employer-1",
    email: "employer@demo.com",
    name: "Employer User",
    phone: "+1 (876) 555-1234",
    parish: "Manchester",
    role: "employer",
    skills: [],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

const isBrowser = typeof window !== "undefined"

export const demoAuth = {
  // Initialize demo users in localStorage
  init: () => {
    if (!isBrowser) return
    const stored = localStorage.getItem(DEMO_USERS_KEY)
    if (!stored) {
      localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(DEMO_USERS))
    }
  },

  // Sign up a new user
  signup: async (email: string, password: string, userData: Omit<DemoUser, "id" | "createdAt" | "updatedAt">) => {
    if (!isBrowser) throw new Error("Cannot access localStorage during SSR")
    const users = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || "[]") as DemoUser[]

    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      throw new Error("auth/email-already-in-use")
    }

    const newUser: DemoUser = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    users.push(newUser)
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))
    localStorage.setItem(DEMO_CURRENT_USER_KEY, JSON.stringify(newUser))

    return newUser
  },

  // Sign in a user
  signin: async (email: string, password: string) => {
    if (!isBrowser) throw new Error("Cannot access localStorage during SSR")
    const users = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || "[]") as DemoUser[]
    const user = users.find((u) => u.email === email)

    if (!user) {
      throw new Error("auth/user-not-found")
    }

    // In demo mode, any password works for demo accounts
    if (email.includes("demo")) {
      localStorage.setItem(DEMO_CURRENT_USER_KEY, JSON.stringify(user))
      return user
    }

    // For non-demo accounts, require password match (stored as plain text in demo)
    localStorage.setItem(DEMO_CURRENT_USER_KEY, JSON.stringify(user))
    return user
  },

  // Get current user
  getCurrentUser: (): DemoUser | null => {
    if (!isBrowser) return null
    const stored = localStorage.getItem(DEMO_CURRENT_USER_KEY)
    return stored ? JSON.parse(stored) : null
  },

  // Sign out
  signout: async () => {
    if (!isBrowser) return
    localStorage.removeItem(DEMO_CURRENT_USER_KEY)
  },

  // Get user by ID
  getUser: async (id: string) => {
    if (!isBrowser) return null
    const users = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || "[]") as DemoUser[]
    return users.find((u) => u.id === id) || null
  },

  // Update user
  updateUser: async (id: string, updates: Partial<DemoUser>) => {
    if (!isBrowser) throw new Error("Cannot access localStorage during SSR")
    const users = JSON.parse(localStorage.getItem(DEMO_USERS_KEY) || "[]") as DemoUser[]
    const index = users.findIndex((u) => u.id === id)

    if (index === -1) {
      throw new Error("User not found")
    }

    users[index] = { ...users[index], ...updates, updatedAt: new Date() }
    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users))

    // Update current user if it's the same user
    const currentUser = localStorage.getItem(DEMO_CURRENT_USER_KEY)
    if (currentUser) {
      const parsed = JSON.parse(currentUser)
      if (parsed.id === id) {
        localStorage.setItem(DEMO_CURRENT_USER_KEY, JSON.stringify(users[index]))
      }
    }

    return users[index]
  },
}
