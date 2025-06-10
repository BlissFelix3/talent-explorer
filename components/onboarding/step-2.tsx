"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Step2Props {
  data: any
  updateData: (data: any) => void
}

export function OnboardingStep2({ data, updateData }: Step2Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="company">Company name</Label>
        <Input
          id="company"
          value={data.company}
          onChange={(e) => updateData({ company: e.target.value })}
          placeholder="Enter your company name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <RadioGroup value={data.industry} onValueChange={(value) => updateData({ industry: value })}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="technology" id="technology" />
            <Label htmlFor="technology">Technology</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="finance" id="finance" />
            <Label htmlFor="finance">Finance</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="healthcare" id="healthcare" />
            <Label htmlFor="healthcare">Healthcare</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="education" id="education" />
            <Label htmlFor="education">Education</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other-industry" />
            <Label htmlFor="other-industry">Other</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company-size">Company size</Label>
        <RadioGroup value={data.companySize} onValueChange={(value) => updateData({ companySize: value })}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1-10" id="1-10" />
            <Label htmlFor="1-10">1-10 employees</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="11-50" id="11-50" />
            <Label htmlFor="11-50">11-50 employees</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="51-200" id="51-200" />
            <Label htmlFor="51-200">51-200 employees</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="201-1000" id="201-1000" />
            <Label htmlFor="201-1000">201-1000 employees</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1000+" id="1000+" />
            <Label htmlFor="1000+">1000+ employees</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
