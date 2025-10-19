"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, DollarSign, Calendar, FileText, ArrowRight, Filter } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { ChatbotButton } from "@/components/chatbot-button"

type Grant = {
  id: string
  title: string
  description: string
  amount: string
  deadline: string
  category: string
  eligibility: string[]
  applications: number
}

const mockGrants: Grant[] = [
  {
    id: "1",
    title: "Small Business Development Grant",
    description: "Financial support for small business owners to expand operations and create jobs",
    amount: "$50,000 - $500,000 JMD",
    deadline: "2025-04-15",
    category: "Business",
    eligibility: ["Registered business", "2+ years operation", "Job creation plan"],
    applications: 23,
  },
  {
    id: "2",
    title: "Youth Entrepreneurship Fund",
    description: "Seed funding for young entrepreneurs aged 18-35 starting new ventures",
    amount: "$25,000 - $200,000 JMD",
    deadline: "2025-03-30",
    category: "Youth",
    eligibility: ["Age 18-35", "Business plan", "Jamaican citizen"],
    applications: 45,
  },
  {
    id: "3",
    title: "Agricultural Innovation Grant",
    description: "Support for farmers implementing sustainable and innovative farming practices",
    amount: "$100,000 - $1,000,000 JMD",
    deadline: "2025-05-20",
    category: "Agriculture",
    eligibility: ["Active farmer", "Land ownership/lease", "Innovation proposal"],
    applications: 18,
  },
  {
    id: "4",
    title: "Community Development Initiative",
    description: "Funding for community projects that improve local infrastructure and services",
    amount: "$200,000 - $2,000,000 JMD",
    deadline: "2025-06-10",
    category: "Community",
    eligibility: ["Community organization", "Project proposal", "Local support"],
    applications: 12,
  },
  {
    id: "5",
    title: "Education Technology Grant",
    description: "Support for educational institutions adopting technology-enhanced learning",
    amount: "$150,000 - $800,000 JMD",
    deadline: "2025-04-25",
    category: "Education",
    eligibility: ["Educational institution", "Technology plan", "Student impact"],
    applications: 31,
  },
]

export default function GrantsPage() {
  const [grants] = useState<Grant[]>(mockGrants)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(grants.map((g) => g.category)))

  const filteredGrants = grants.filter((grant) => {
    const matchesSearch =
      grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grant.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || grant.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
                <FileText className="h-10 w-10 text-primary" />
                <h1 className="text-4xl font-bold">Grant Opportunities</h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Discover funding opportunities for your business, project, or community initiative
              </p>
            </div>

            {/* Search and Filter */}
            <div className="space-y-4">
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search grants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-base h-12"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Category Filter */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter by category:</span>
                </div>
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Grants List */}
            <div className="space-y-4">
              {filteredGrants.length > 0 ? (
                filteredGrants.map((grant) => (
                  <Card key={grant.id} className="border-2 hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{grant.title}</CardTitle>
                            <Badge className="bg-primary/20 text-primary border-primary/30">{grant.category}</Badge>
                          </div>
                          <CardDescription className="text-base">{grant.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-success" />
                          <span className="font-medium text-success">{grant.amount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Deadline: {new Date(grant.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="text-muted-foreground">{grant.applications} applications</div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Eligibility Requirements:</p>
                        <div className="flex flex-wrap gap-2">
                          {grant.eligibility.map((req, index) => (
                            <Badge key={index} variant="outline">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full gap-2" size="lg">
                        Apply for Grant
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-2">
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-lg text-muted-foreground">No grants found matching your criteria.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
      <ChatbotButton />
    </div>
  )
}
