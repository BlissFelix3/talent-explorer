"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { CandidateChat } from "@/components/candidate-chat"
import { InterviewScheduler } from "@/components/interview-scheduler"
import { ArrowLeft, CalendarDays } from "lucide-react"
import Link from "next/link"

export default function CandidateMessagePage() {
  const params = useParams()
  const candidateId = params.candidateId as string

  const {
    data: candidate,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["candidate-by-id", candidateId],
    queryFn: async () => {
      // Try to get candidate from Torre API
      try {
        // candidatesApi needs to be defined.  Assuming it's available elsewhere.
        // return await candidatesApi.getProfile(candidateId)
        throw new Error("Torre API not implemented") // Removing the call to the API since it's not defined
      } catch (error) {
        // Fallback to mock data for demo
        const mockCandidates = [
          {
            id: "1",
            name: "Sarah Chen",
            headline: "Senior Full Stack Developer",
            avatar: "/placeholder.svg?height=80&width=80",
            skills: ["React", "Node.js", "TypeScript", "Python", "AWS"],
            experience: "8 years",
            bio: "Experienced developer passionate about building scalable applications.",
          },
          {
            id: "2",
            name: "Marcus Johnson",
            headline: "DevOps Engineer & Cloud Architect",
            avatar: "/placeholder.svg?height=80&width=80",
            skills: ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD"],
            experience: "10 years",
            bio: "Cloud enthusiast with a knack for automation and infrastructure.",
          },
          {
            id: "3",
            name: "Elena Rodriguez",
            headline: "Product Designer & UX Researcher",
            avatar: "/placeholder.svg?height=80&width=80",
            skills: ["Figma", "User Research", "Prototyping", "Design Systems", "A/B Testing"],
            experience: "6 years",
            bio: "User-centered designer focused on creating intuitive and engaging experiences.",
          },
        ]

        const candidate = mockCandidates.find((c) => c.id === candidateId)
        if (!candidate) {
          throw new Error("Candidate not found")
        }
        return candidate
      }
    },
  })

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container py-8">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-12 bg-muted rounded-lg" />
                <div className="h-96 bg-muted rounded-lg" />
              </div>
            </div>
          </main>
        </div>
      </AuthGuard>
    )
  }

  if (error || !candidate) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container py-8">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-12 text-center">
                  <h3 className="text-lg font-semibold mb-2">Candidate not found</h3>
                  <p className="text-muted-foreground">The candidate you're looking for doesn't exist.</p>
                  <Button asChild className="mt-4">
                    <Link href="/messages">Back to Messages</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/messages">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">{candidate.name}</h1>
                  <p className="text-muted-foreground">{candidate.headline}</p>
                </div>
              </div>

              <InterviewScheduler candidate={candidate} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CandidateChat candidate={candidate} />
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Candidate Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Experience</h4>
                      <p className="text-sm text-muted-foreground">{candidate.experience}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Key Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 6).map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/profile/${candidate.name.toLowerCase().replace(" ", "")}`}>View Full Profile</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <InterviewScheduler candidate={candidate} />
                    <Button variant="outline" className="w-full">
                      Add to Shortlist
                    </Button>
                    <Button variant="outline" className="w-full">
                      Share Profile
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
