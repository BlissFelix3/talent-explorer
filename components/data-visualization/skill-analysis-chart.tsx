"use client"

import { Card } from "@/components/ui/card"

interface Skill {
  name: string
  level: number
}

interface SkillAnalysisChartProps {
  skills: Skill[]
}

export function SkillAnalysisChart({ skills }: SkillAnalysisChartProps) {
  const maxLevel = Math.max(...skills.map((s) => s.level))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill, index) => (
          <Card key={skill.name} className="p-4">
            <div className="text-center space-y-2">
              <div className="relative w-20 h-20 mx-auto">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-muted stroke-current"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary stroke-current"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${skill.level}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-semibold">{skill.level}%</span>
                </div>
              </div>
              <h4 className="font-medium">{skill.name}</h4>
              <div className="text-xs text-muted-foreground">
                {skill.level >= 80
                  ? "Expert"
                  : skill.level >= 60
                    ? "Advanced"
                    : skill.level >= 40
                      ? "Intermediate"
                      : "Beginner"}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h4 className="font-semibold mb-2">Skill Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Skills</p>
            <p className="font-semibold">{skills.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Average Level</p>
            <p className="font-semibold">{Math.round(skills.reduce((acc, s) => acc + s.level, 0) / skills.length)}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Expert Skills</p>
            <p className="font-semibold">{skills.filter((s) => s.level >= 80).length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Top Skill</p>
            <p className="font-semibold">{skills.find((s) => s.level === maxLevel)?.name}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
