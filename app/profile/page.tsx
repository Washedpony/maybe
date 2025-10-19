"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { ChatbotButton } from "@/components/chatbot-button"
import { useAuth } from "@/lib/auth-context"
import { userService } from "@/lib/db-service"
import { User, Mail, Phone, MapPin, Edit2, Save } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    parish: "",
    bio: "",
    skills: [] as string[],
  })
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        parish: user.parish || "",
        bio: user.bio || "",
        skills: user.skills || [],
      })
    }
  }, [user])

  const handleSave = async () => {
    if (user) {
      try {
        await userService.updateUser(user.id, formData)
        setIsEditing(false)
        alert("Profile updated successfully!")
      } catch (error) {
        console.error("Failed to update profile:", error)
      }
    }
  }

  const handleAddSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill],
      })
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    })
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8 max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="h-10 w-10 text-primary" />
                <h1 className="text-4xl font-bold">My Profile</h1>
              </div>
              <Button onClick={() => (isEditing ? handleSave() : setIsEditing(true))} className="gap-2" size="lg">
                {isEditing ? (
                  <>
                    <Save className="h-5 w-5" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit2 className="h-5 w-5" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>

            {/* Profile Card */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base">Full Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="text-base h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input value={formData.email} disabled className="text-base h-12 bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-base flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="text-base h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Parish
                  </Label>
                  <Input value={formData.parish} disabled className="text-base h-12 bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label className="text-base">Bio</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing}
                    className="text-base min-h-24"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Skills</CardTitle>
                <CardDescription className="text-base">Add skills to improve job matching</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
                      className="text-base h-12"
                      onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                    />
                    <Button onClick={handleAddSkill} size="lg">
                      Add
                    </Button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} className="text-base py-2 px-3 gap-2">
                      {skill}
                      {isEditing && (
                        <button onClick={() => handleRemoveSkill(skill)} className="ml-1 hover:text-destructive">
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>

                {formData.skills.length === 0 && <p className="text-muted-foreground">No skills added yet</p>}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <ChatbotButton />
    </div>
  )
}
