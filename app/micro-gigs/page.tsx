"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, DollarSign, CheckCircle, Zap, MapPin, Calendar } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { ChatbotButton } from "@/components/chatbot-button"

type MicroGig = {
  id: string
  title: string
  description: string
  payment: string
  duration: string
  location: string
  category: "data-entry" | "survey" | "verification" | "delivery" | "other"
  deadline: string
  spotsAvailable: number
  totalSpots: number
  accepted: boolean
}

const mockMicroGigs: MicroGig[] = [
  {
    id: "1",
    title: "Census Data Entry",
    description: "Enter census survey data from paper forms into digital system. Training provided.",
    payment: "$2,500 JMD",
    duration: "2-3 hours",
    location: "Remote",
    category: "data-entry",
    deadline: "2025-02-28",
    spotsAvailable: 15,
    totalSpots: 20,
    accepted: false,
  },
  {
    id: "2",
    title: "Community Survey Completion",
    description: "Complete a 20-minute survey about local infrastructure needs in your community.",
    payment: "$500 JMD",
    duration: "20 minutes",
    location: "Remote",
    category: "survey",
    deadline: "2025-02-25",
    spotsAvailable: 45,
    totalSpots: 100,
    accepted: false,
  },
  {
    id: "3",
    title: "Document Verification Assistant",
    description: "Verify and cross-check government documents for accuracy. Must have attention to detail.",
    payment: "$3,000 JMD",
    duration: "4 hours",
    location: "Kingston",
    category: "verification",
    deadline: "2025-03-05",
    spotsAvailable: 8,
    totalSpots: 10,
    accepted: false,
  },
  {
    id: "4",
    title: "Public Notice Distribution",
    description: "Distribute public health notices to households in your parish. Transportation reimbursed.",
    payment: "$4,500 JMD",
    duration: "1 day",
    location: "St. Andrew",
    category: "delivery",
    deadline: "2025-02-27",
    spotsAvailable: 12,
    totalSpots: 15,
    accepted: false,
  },
  {
    id: "5",
    title: "Youth Program Feedback Survey",
    description: "Provide feedback on government youth programs. Must be 18-30 years old.",
    payment: "$800 JMD",
    duration: "30 minutes",
    location: "Remote",
    category: "survey",
    deadline: "2025-03-10",
    spotsAvailable: 67,
    totalSpots: 100,
    accepted: false,
  },
  {
    id: "6",
    title: "Business Registry Data Update",
    description: "Update business contact information in government database. Basic computer skills required.",
    payment: "$3,500 JMD",
    duration: "3-4 hours",
    location: "Remote",
    category: "data-entry",
    deadline: "2025-03-01",
    spotsAvailable: 20,
    totalSpots: 25,
    accepted: false,
  },
]

export default function MicroGigsPage() {
  const [gigs, setGigs] = useState<MicroGig[]>(mockMicroGigs)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState<"all" | MicroGig["category"]>("all")
  const [showAccepted, setShowAccepted] = useState(false)

  const handleAcceptGig = (gigId: string) => {
    setGigs((prevGigs) =>
      prevGigs.map((gig) =>
        gig.id === gigId ? { ...gig, accepted: true, spotsAvailable: Math.max(0, gig.spotsAvailable - 1) } : gig,
      ),
    )
  }

  const filteredGigs = gigs.filter((gig) => {
    const matchesSearch =
      gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterCategory === "all" || gig.category === filterCategory
    const matchesAccepted = showAccepted ? gig.accepted : true
    return matchesSearch && matchesFilter && matchesAccepted
  })

  const acceptedGigs = gigs.filter((gig) => gig.accepted)
  const totalEarnings = acceptedGigs.reduce((sum, gig) => {
    const amount = Number.parseInt(gig.payment.replace(/[^0-9]/g, ""))
    return sum + amount
  }, 0)

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "data-entry":
        return "bg-primary/20 text-primary border-primary/30"
      case "survey":
        return "bg-accent/20 text-accent border-accent/30"
      case "verification":
        return "bg-success/20 text-success border-success/30"
      case "delivery":
        return "bg-warning/20 text-warning border-warning/30"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getCategoryLabel = (category: string) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-10 w-10 text-primary" />
                <h1 className="text-4xl font-bold">Micro-Gigs</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Quick tasks and short-term opportunities. Accept instantly and start earning today.
              </p>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/20">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Available Gigs</p>
                      <p className="text-2xl font-bold">{gigs.filter((g) => !g.accepted).length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-success/20">
                      <CheckCircle className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Accepted Gigs</p>
                      <p className="text-2xl font-bold">{acceptedGigs.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-accent/20">
                      <DollarSign className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Potential Earnings</p>
                      <p className="text-2xl font-bold">${totalEarnings.toLocaleString()} JMD</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="Search micro-gigs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 text-base h-12"
                      />
                    </div>
                    <Button
                      variant={showAccepted ? "default" : "outline"}
                      onClick={() => setShowAccepted(!showAccepted)}
                      size="lg"
                      className="gap-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      {showAccepted ? "Show All" : "My Accepted Gigs"}
                    </Button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={filterCategory === "all" ? "default" : "outline"}
                      onClick={() => setFilterCategory("all")}
                      size="lg"
                    >
                      All
                    </Button>
                    <Button
                      variant={filterCategory === "data-entry" ? "default" : "outline"}
                      onClick={() => setFilterCategory("data-entry")}
                      size="lg"
                    >
                      Data Entry
                    </Button>
                    <Button
                      variant={filterCategory === "survey" ? "default" : "outline"}
                      onClick={() => setFilterCategory("survey")}
                      size="lg"
                    >
                      Surveys
                    </Button>
                    <Button
                      variant={filterCategory === "verification" ? "default" : "outline"}
                      onClick={() => setFilterCategory("verification")}
                      size="lg"
                    >
                      Verification
                    </Button>
                    <Button
                      variant={filterCategory === "delivery" ? "default" : "outline"}
                      onClick={() => setFilterCategory("delivery")}
                      size="lg"
                    >
                      Delivery
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gigs List */}
            <div className="grid gap-4 md:grid-cols-2">
              {filteredGigs.map((gig) => (
                <Card
                  key={gig.id}
                  className={`border-2 transition-all ${
                    gig.accepted
                      ? "border-success bg-success/5"
                      : "hover:border-primary hover:shadow-lg hover:shadow-primary/20"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <CardTitle className="text-xl">{gig.title}</CardTitle>
                      <Badge className={getCategoryBadgeColor(gig.category)}>{getCategoryLabel(gig.category)}</Badge>
                    </div>
                    <CardDescription className="text-base">{gig.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-success" />
                        <span className="font-bold text-success">{gig.payment}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{gig.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{gig.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(gig.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm">
                        <span className="font-medium">{gig.spotsAvailable}</span>
                        <span className="text-muted-foreground"> / {gig.totalSpots} spots left</span>
                      </div>
                      {gig.accepted ? (
                        <Button disabled size="lg" className="gap-2 bg-success hover:bg-success">
                          <CheckCircle className="h-5 w-5" />
                          Accepted
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleAcceptGig(gig.id)}
                          size="lg"
                          className="gap-2"
                          disabled={gig.spotsAvailable === 0}
                        >
                          <Zap className="h-5 w-5" />
                          Accept Gig
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredGigs.length === 0 && (
              <Card className="border-2">
                <CardContent className="py-12 text-center">
                  <p className="text-lg text-muted-foreground">No micro-gigs found matching your criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
      <ChatbotButton />
    </div>
  )
}
