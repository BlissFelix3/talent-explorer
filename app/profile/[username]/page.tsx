"use client"

import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { candidatesApi } from "@/lib/api/candidates"
import { useShortlistStore } from "@/lib/stores/shortlist-store"
import { MapPin, DollarSign, Clock, Bookmark, BookmarkCheck, Star, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  const { toast } = useToast()
  const { candidates, addCandidate, removeCandidate } = useShortlistStore()

  const {
    data: candidate,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["candidate", username],
    queryFn: () => candidatesApi.getProfile(username),
    retry: 1, // Only retry once for Torre API calls
  })

  const isShortlisted = candidate && candidates.some((c) => c.id === candidate.id)

  const handleShortlistToggle = () => {
    if (!candidate) return

    if (isShortlisted) {
      removeCandidate(candidate.id)
      toast({
        title: "Removed from shortlist",
        description: `${candidate.name} has been removed from your shortlist.`,
      })
    } else {
      addCandidate(candidate)
      toast({
        title: "Added to shortlist",
        description: `${candidate.name} has been added to your shortlist.`,
      })
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container py-8">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse space-y-6">
                <div className="h-48 bg-muted rounded-lg" />
                <div className="h-32 bg-muted rounded-lg" />
                <div className="h-64 bg-muted rounded-lg" />
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
                  <p className="text-muted-foreground">The candidate profile you're looking for doesn't exist.</p>
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
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                    <AvatarFallback>
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                        {candidate.name.charAt(0)}
                      </div>
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <h1 className="text-3xl font-bold">{candidate.name}</h1>
                    <p className="text-xl text-muted-foreground">{candidate.headline}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {candidate.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {candidate.experience} experience
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button onClick={handleShortlistToggle} className="flex items-center gap-2">
                      {isShortlisted ? (
                        <>
                          <BookmarkCheck className="h-4 w-4" />
                          Remove from Shortlist
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4" />
                          Add to Shortlist
                        </>
                      )}
                    </Button>

                    <Button variant="outline" asChild className="flex items-center gap-2">
                      <Link href={`/messages/${candidate.id}`}>
                        <MessageCircle className="h-4 w-4" />
                        Message
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-8 md:grid-cols-2">
              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Compensation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Compensation Expectations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${candidate.compensation.min.toLocaleString()} - ${candidate.compensation.max.toLocaleString()}
                  </div>
                  <p className="text-muted-foreground">{candidate.compensation.currency} per year</p>
                </CardContent>
              </Card>
            </div>

            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {candidate.strengths.map((strength, index) => (
                    <div key={strength} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{strength}</span>
                        <span className="text-sm text-muted-foreground">{85 + index * 3}%</span>
                      </div>
                      <Progress value={85 + index * 3} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Genome Layout */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Genome</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-primary">A+</div>
                    <p className="text-sm text-muted-foreground">Technical Skills</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-green-600">95%</div>
                    <p className="text-sm text-muted-foreground">Culture Fit</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-blue-600">8.9</div>
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
