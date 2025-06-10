"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Lightbulb, Users, Briefcase, BookOpen } from "lucide-react"

const recommendations = {
  candidates: [
    {
      id: "1",
      name: "Alex Chen",
      role: "Senior React Developer",
      match: 95,
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["React", "TypeScript", "Node.js"],
    },
    {
      id: "2",
      name: "Sarah Kim",
      role: "Full Stack Engineer",
      match: 88,
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["Python", "React", "AWS"],
    },
  ],
  jobs: [
    {
      id: "1",
      title: "Senior Frontend Developer",
      company: "TechCorp",
      match: 92,
      skills: ["React", "TypeScript", "GraphQL"],
    },
    {
      id: "2",
      title: "Full Stack Engineer",
      company: "StartupX",
      match: 85,
      skills: ["Node.js", "Python", "AWS"],
    },
  ],
  learning: [
    {
      id: "1",
      title: "Advanced React Patterns",
      provider: "TechEd",
      duration: "4 weeks",
      relevance: "High",
    },
    {
      id: "2",
      title: "AWS Solutions Architect",
      provider: "CloudAcademy",
      duration: "8 weeks",
      relevance: "Medium",
    },
  ],
}

export function RecommendationsPanel() {
  return (
    <div className="space-y-6">
      {/* Candidate Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h4 className="font-semibold">Recommended Candidates</h4>
        </div>
        <div className="space-y-3">
          {recommendations.candidates.map((candidate) => (
            <Card key={candidate.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                      <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-sm text-muted-foreground">{candidate.role}</p>
                      <div className="flex gap-1 mt-1">
                        {candidate.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {candidate.match}% match
                    </Badge>
                    <Button size="sm" className="mt-2 w-full">
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Job Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-primary" />
          <h4 className="font-semibold">Recommended Job Postings</h4>
        </div>
        <div className="space-y-3">
          {recommendations.jobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    <div className="flex gap-1 mt-1">
                      {job.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      {job.match}% match
                    </Badge>
                    <Button size="sm" className="mt-2 w-full">
                      View Job
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-primary" />
          <h4 className="font-semibold">Recommended Learning</h4>
        </div>
        <div className="space-y-3">
          {recommendations.learning.map((course) => (
            <Card key={course.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.provider} • {course.duration}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className={`${
                        course.relevance === "High"
                          ? "text-green-600 border-green-600"
                          : "text-yellow-600 border-yellow-600"
                      }`}
                    >
                      {course.relevance} relevance
                    </Badge>
                    <Button size="sm" className="mt-2 w-full">
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">AI Insight</h4>
              <p className="text-sm text-purple-700 dark:text-purple-200 mt-1">
                Based on your recent activity, candidates with React and TypeScript skills are 40% more likely to be a
                good fit for your open positions. Consider prioritizing these skills in your search criteria.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
