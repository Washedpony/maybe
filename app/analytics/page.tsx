"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { ChatbotButton } from "@/components/chatbot-button"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { useAuth } from "@/lib/auth-context"
import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  const { user } = useAuth()

  // Only admins can view analytics
  if (user?.role !== "admin") {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">Access denied. Admin only.</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
            </div>
            <AnalyticsDashboard />
          </div>
        </main>
      </div>
      <ChatbotButton />
    </div>
  )
}
