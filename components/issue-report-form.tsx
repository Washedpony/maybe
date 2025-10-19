"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, MapPin } from "lucide-react"

interface IssueReportFormProps {
  onSubmit?: (data: any) => void
  onClose?: () => void
}

export function IssueReportForm({ onSubmit, onClose }: IssueReportFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "pothole",
    location: "",
    parish: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        onSubmit?.(formData)
        setFormData({ title: "", description: "", category: "pothole", location: "", parish: "" })
      }
    } catch (error) {
      console.error("Error submitting issue:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Report an Issue
        </CardTitle>
        <CardDescription>Help us improve your community by reporting infrastructure issues</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">
              Issue Title
            </Label>
            <Input
              id="title"
              placeholder="e.g., Large pothole on Main Street"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="text-base h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-base">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="text-base h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pothole" className="text-base">
                  Pothole
                </SelectItem>
                <SelectItem value="infrastructure" className="text-base">
                  Infrastructure
                </SelectItem>
                <SelectItem value="safety" className="text-base">
                  Safety Concern
                </SelectItem>
                <SelectItem value="other" className="text-base">
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="Street address or landmark"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="text-base h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parish" className="text-base">
              Parish
            </Label>
            <Input
              id="parish"
              placeholder="Your parish"
              value={formData.parish}
              onChange={(e) => setFormData({ ...formData, parish: e.target.value })}
              className="text-base h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="text-base min-h-32"
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" size="lg" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
            <Button type="button" size="lg" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
