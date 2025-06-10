"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { OnboardingStep1 } from "@/components/onboarding/step-1"
import { OnboardingStep2 } from "@/components/onboarding/step-2"
import { OnboardingStep3 } from "@/components/onboarding/step-3"
import { OnboardingStep4 } from "@/components/onboarding/step-4"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useToast } from "@/hooks/use-toast"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    teamSize: "",
    hiringGoals: [],
    skills: [],
    preferences: {},
  })
  const router = useRouter()
  const { user } = useAuthStore()
  const { toast } = useToast()

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    toast({
      title: "Welcome to TalentScope!",
      description: "Your profile has been set up successfully. Let's start finding great talent!",
    })
    router.push("/search")
  }

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData({ ...formData, ...data })
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to TalentScope, {user.name}!</h1>
          <p className="text-muted-foreground">Let's set up your profile to get you started</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>
                  Step {currentStep} of {totalSteps}
                </CardTitle>
                <CardDescription>
                  {currentStep === 1 && "Tell us about your role"}
                  {currentStep === 2 && "Company information"}
                  {currentStep === 3 && "Your hiring preferences"}
                  {currentStep === 4 && "Final setup"}
                </CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">{Math.round(progress)}% complete</div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && <OnboardingStep1 data={formData} updateData={updateFormData} />}
            {currentStep === 2 && <OnboardingStep2 data={formData} updateData={updateFormData} />}
            {currentStep === 3 && <OnboardingStep3 data={formData} updateData={updateFormData} />}
            {currentStep === 4 && <OnboardingStep4 data={formData} updateData={updateFormData} />}

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                Previous
              </Button>
              <Button onClick={handleNext}>{currentStep === totalSteps ? "Complete Setup" : "Next"}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
