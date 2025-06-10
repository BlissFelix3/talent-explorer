"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { SettingsSidebar } from "@/components/settings/settings-sidebar"
import { SkillAnalysisChart } from "@/components/data-visualization/skill-analysis-chart"
import { TrendAnalysisChart } from "@/components/data-visualization/trend-analysis-chart"
import { RecommendationsPanel } from "@/components/settings/recommendations-panel"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/lib/stores/auth-store"
import { User, TrendingUp, Award, Target, Plus, X } from "lucide-react"

export default function ProfileSettingsPage() {
  const { toast } = useToast()
  const { user } = useAuthStore()
  const [skills, setSkills] = useState([
    { name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Node.js", level: 80 },
    { name: "Python", level: 75 },
    { name: "AWS", level: 70 },
  ])
  const [newSkill, setNewSkill] = useState("")
  const [bio, setBio] = useState(
    "Experienced recruiter with a passion for finding exceptional talent and building great teams.",
  )

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { name: newSkill.trim(), level: 50 }])
      setNewSkill("")
    }
  }

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const updateSkillLevel = (index: number, level: number) => {
    const updatedSkills = [...skills]
    updatedSkills[index].level = level
    setSkills(updatedSkills)
  }

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-64 shrink-0">
              <SettingsSidebar />
            </div>
            <div className="flex-1 space-y-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your professional profile and skill analysis</p>
              </div>

              {/* Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update your professional information and bio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input id="title" defaultValue="Senior Talent Acquisition Specialist" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" defaultValue="San Francisco, CA" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      placeholder="Tell us about your professional background and expertise..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Skill Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Skill Analysis
                  </CardTitle>
                  <CardDescription>Manage your skills and view proficiency analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a new skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    />
                    <Button onClick={addSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {skills.map((skill, index) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{skill.name}</Badge>
                            <Button variant="ghost" size="sm" onClick={() => removeSkill(index)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="text-sm text-muted-foreground">{skill.level}%</span>
                        </div>
                        <Progress
                          value={skill.level}
                          className="h-2"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const x = e.clientX - rect.left
                            const percentage = Math.round((x / rect.width) * 100)
                            updateSkillLevel(index, Math.max(0, Math.min(100, percentage)))
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4">Skill Distribution</h4>
                    <SkillAnalysisChart skills={skills} />
                  </div>
                </CardContent>
              </Card>

              {/* Trend Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Market Trends
                  </CardTitle>
                  <CardDescription>Industry trends and skill demand analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <TrendAnalysisChart />
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Personalized Recommendations
                  </CardTitle>
                  <CardDescription>AI-powered recommendations based on your profile and activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecommendationsPanel />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
