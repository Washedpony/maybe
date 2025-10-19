"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, MapPin, ThumbsUp, CheckCircle, Clock } from "lucide-react"

interface IssueCardProps {
  id: string
  title: string
  description: string
  category: string
  location: string
  status: "reported" | "acknowledged" | "in-progress" | "resolved"
  upvotes: number
  onUpvote?: (id: string) => void
  onStatusChange?: (id: string, status: string) => void
  isAdmin?: boolean
}

export function IssueCard({
  id,
  title,
  description,
  category,
  location,
  status,
  upvotes,
  onUpvote,
  onStatusChange,
  isAdmin,
}: IssueCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "reported":
        return "bg-yellow-500/20 text-yellow-700"
      case "acknowledged":
        return "bg-blue-500/20 text-blue-700"
      case "in-progress":
        return "bg-orange-500/20 text-orange-700"
      case "resolved":
        return "bg-green-500/20 text-green-700"
      default:
        return "bg-gray-500/20 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <AlertCircle className="h-5 w-5 text-orange-500 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <CardTitle className="text-lg mb-2">{title}</CardTitle>
              <p className="text-sm text-muted-foreground mb-3">{description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="text-xs">
                  {category}
                </Badge>
                <Badge className={`text-xs ${getStatusColor(status)}`}>
                  {getStatusIcon(status)}
                  <span className="ml-1">{status}</span>
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" onClick={() => onUpvote?.(id)} className="gap-2">
              <ThumbsUp className="h-4 w-4" />
              {upvotes}
            </Button>
            {isAdmin && (
              <select
                value={status}
                onChange={(e) => onStatusChange?.(id, e.target.value)}
                className="text-xs px-2 py-1 rounded border"
              >
                <option value="reported">Reported</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
