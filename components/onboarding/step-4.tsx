"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface Step4Props {
  data: any
  updateData: (data: any) => void
}

export function OnboardingStep4({ data, updateData }: Step4Props) {
  const preferences = data.preferences || {}

  const updatePreference = (key: string, value: boolean) => {
    updateData({
      preferences: {
        ...preferences,
        [key]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
        <h3 className="text-xl font-semibold">Almost done!</h3>
        <p className="text-muted-foreground">Let's configure your preferences to personalize your experience</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Email notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified about new candidate matches</p>
            </div>
            <Checkbox
              checked={preferences.emailNotifications !== false}
              onCheckedChange={(checked) => updatePreference("emailNotifications", !!checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Weekly insights</Label>
              <p className="text-sm text-muted-foreground">Receive weekly market trends and insights</p>
            </div>
            <Checkbox
              checked={preferences.weeklyInsights !== false}
              onCheckedChange={(checked) => updatePreference("weeklyInsights", !!checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Smart recommendations</Label>
              <p className="text-sm text-muted-foreground">Get AI-powered candidate and job recommendations</p>
            </div>
            <Checkbox
              checked={preferences.smartRecommendations !== false}
              onCheckedChange={(checked) => updatePreference("smartRecommendations", !!checked)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Your Setup Summary:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Role: {data.role || "Not specified"}</li>
          <li>• Company: {data.company || "Not specified"}</li>
          <li>• Industry: {data.industry || "Not specified"}</li>
          <li>• Skills focus: {data.skills?.length || 0} skills selected</li>
        </ul>
      </div>
    </div>
  )
}
