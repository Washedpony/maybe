"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "./types"
import { demoAuth } from "./demo-auth"

interface AuthContextType {
  user: User | null
  firebaseUser: { uid: string } | null
  loading: boolean
  isDemoMode: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Initialize demo auth
        demoAuth.init()

        // Check if user is already logged in
        const currentUser = demoAuth.getCurrentUser()
        if (currentUser) {
          setUser({
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.name,
            role: currentUser.role,
            parish: currentUser.parish,
            skills: currentUser.skills,
            createdAt: new Date(currentUser.createdAt),
          })
        }

        setIsDemoMode(true)
      } catch (error) {
        console.error("[v0] Auth initialization error:", error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const logout = async () => {
    await demoAuth.signout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser: user ? { uid: user.id } : null,
        loading,
        isDemoMode,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
