"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Briefcase, FileText, TrendingUp, Users, ArrowRight, Zap, Clock, DollarSign, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const metrics = [
  { icon: Briefcase, label: "Active Jobs", value: "1,234", change: "+12%", color: "text-primary" },
  { icon: FileText, label: "Open Grants", value: "89", change: "+5%", color: "text-accent" },
  { icon: Users, label: "Citizens Served", value: "45.2K", change: "+18%", color: "text-success" },
  { icon: TrendingUp, label: "Applications", value: "3,456", change: "+23%", color: "text-chart-4" },
]

const quickActions = [
  { title: "Apply for Job", description: "Browse and apply for government positions", href: "/jobs" },
  { title: "Request Grant", description: "Submit a grant application", href: "/grants" },
  { title: "Get Support", description: "Contact citizen support services", href: "/support" },
  { title: "Update Profile", description: "Manage your account information", href: "/profile" },
]

const applications = [
  { title: "Teaching Position - Ministry of Education", status: 65, stage: "Interview Scheduled" },
  { title: "Small Business Grant Application", status: 40, stage: "Under Review" },
  { title: "Youth Development Program", status: 90, stage: "Final Approval" },
]

const acceptedMicroGigs = [
  {
    id: "1",
    title: "Census Data Entry",
    payment: "$2,500 JMD",
    duration: "2-3 hours",
    deadline: "2025-02-28",
    status: "in-progress",
  },
  {
    id: "2",
    title: "Community Survey Completion",
    payment: "$500 JMD",
    duration: "20 minutes",
    deadline: "2025-02-25",
    status: "completed",
  },
  {
    id: "3",
    title: "Document Verification Assistant",
    payment: "$3,000 JMD",
    duration: "4 hours",
    deadline: "2025-03-05",
    status: "in-progress",
  },
]

export function Dashboard() {
  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Welcome back, Citizen</h1>
        <p className="text-lg text-muted-foreground">Here's what's happening with your applications and services</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{metric.label}</CardTitle>
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metric.value}</div>
              <p className="text-sm text-success mt-1">{metric.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="h-7 w-7 text-primary" />
              <CardTitle className="text-2xl">Your Micro-Gigs</CardTitle>
            </div>
            <Button variant="outline" size="lg" asChild>
              <a href="/micro-gigs" className="gap-2">
                View All
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
          <CardDescription className="text-base">Quick tasks you've accepted</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {acceptedMicroGigs.map((gig) => (
            <Card key={gig.id} className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{gig.title}</h3>
                      {gig.status === "completed" ? (
                        <span className="flex items-center gap-1 text-sm text-success">
                          <CheckCircle className="h-4 w-4" />
                          Completed
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-primary">
                          <Clock className="h-4 w-4" />
                          In Progress
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-success" />
                        <span className="font-medium text-success">{gig.payment}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{gig.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Due: {new Date(gig.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  {gig.status === "in-progress" && <Button size="lg">Start Task</Button>}
                </div>
              </CardContent>
            </Card>
          ))}
          {acceptedMicroGigs.length === 0 && (
            <div className="text-center py-8">
              <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-lg text-muted-foreground mb-4">No micro-gigs accepted yet</p>
              <Button size="lg" asChild>
                <a href="/micro-gigs" className="gap-2">
                  <Zap className="h-5 w-5" />
                  Browse Micro-Gigs
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Announcements */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl">Latest Announcements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-2 w-2 rounded-full bg-primary mt-2" />
            <div>
              <p className="text-lg font-medium">New Youth Employment Program Launched</p>
              <p className="text-base text-muted-foreground">
                Applications now open for ages 18-25. Deadline: March 31st
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="h-2 w-2 rounded-full bg-accent mt-2" />
            <div>
              <p className="text-lg font-medium">Grant Application Portal Updated</p>
              <p className="text-base text-muted-foreground">New features for easier submission and tracking</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Progress */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Your Applications</CardTitle>
          <CardDescription className="text-base">Track the progress of your submissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {applications.map((app) => (
            <div key={app.title} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-lg font-medium">{app.title}</p>
                <span className="text-base text-muted-foreground">{app.status}%</span>
              </div>
              <Progress value={app.status} className="h-3" />
              <p className="text-base text-muted-foreground">{app.stage}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card key={action.title} className="border-2 hover:border-primary transition-colors cursor-pointer group">
              <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between">
                  {action.title}
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardTitle>
                <CardDescription className="text-base">{action.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
