"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

interface Step3Props {
  data: any
  updateData: (data: any) => void
}

const commonSkills = [
  "React",
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "Node.js",
  "AWS",
  "Docker",
  "Kubernetes",
  "SQL",
  "MongoDB",
  "GraphQL",
  "UI/UX Design",
  "Product Management",
  "Data Science",
  "DevOps",
]

export function OnboardingStep3({ data, updateData }: Step3Props) {
  const [customSkill, setCustomSkill] = useState("")
  const skills = data.skills || []

  const toggleSkill = (skill: string) => {
    const updatedSkills = skills.includes(skill) ? skills.filter((s: string) => s !== skill) : [...skills, skill]
    updateData({ skills: updatedSkills })
  }

  const addCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      updateData({ skills: [...skills, customSkill.trim()] })
      setCustomSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    updateData({ skills: skills.filter((s: string) => s !== skill) })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>What skills are you typically looking for in candidates?</Label>
        <p className="text-sm text-muted-foreground">Select the skills that are most relevant to your hiring needs</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {commonSkills.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox id={skill} checked={skills.includes(skill)} onCheckedChange={() => toggleSkill(skill)} />
              <Label htmlFor={skill} className="text-sm">
                {skill}
              </Label>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Add custom skill..."
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
          />
          <Button type="button" onClick={addCustomSkill}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {skills.length > 0 && (
          <div className="space-y-2">
            <Label>Selected skills:</Label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent"
                    onClick={() => removeSkill(skill)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
