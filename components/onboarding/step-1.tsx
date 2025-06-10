"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Step1Props {
  data: any
  updateData: (data: any) => void
}

export function OnboardingStep1({ data, updateData }: Step1Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="role">What's your role?</Label>
        <RadioGroup value={data.role} onValueChange={(value) => updateData({ role: value })}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="recruiter" id="recruiter" />
            <Label htmlFor="recruiter">Recruiter</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hr-manager" id="hr-manager" />
            <Label htmlFor="hr-manager">HR Manager</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hiring-manager" id="hiring-manager" />
            <Label htmlFor="hiring-manager">Hiring Manager</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="founder" id="founder" />
            <Label htmlFor="founder">Founder/CEO</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Other</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Years of recruiting experience</Label>
        <RadioGroup value={data.experience} onValueChange={(value) => updateData({ experience: value })}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="0-1" id="0-1" />
            <Label htmlFor="0-1">0-1 years</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2-5" id="2-5" />
            <Label htmlFor="2-5">2-5 years</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="6-10" id="6-10" />
            <Label htmlFor="6-10">6-10 years</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="10+" id="10+" />
            <Label htmlFor="10+">10+ years</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
