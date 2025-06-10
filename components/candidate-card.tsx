"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, DollarSign, Clock, Bookmark, BookmarkCheck } from "lucide-react"
import type { Candidate } from "@/lib/stores/shortlist-store"
import { useShortlistStore } from "@/lib/stores/shortlist-store"
import Link from "next/link"

interface CandidateCardProps {
  candidate: Candidate
  showActions?: boolean
}

export function CandidateCard({ candidate, showActions = true }: CandidateCardProps) {
  const { candidates, addCandidate, removeCandidate } = useShortlistStore()
  const isShortlisted = candidates.some((c) => c.id === candidate.id)

  const handleShortlistToggle = () => {
    if (isShortlisted) {
      removeCandidate(candidate.id)
    } else {
      addCandidate(candidate)
    }
  }

  const profileUrl = `/profile/${candidate.name.toLowerCase().replace(" ", "")}`

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
              <AvatarFallback>
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                  {candidate.name.charAt(0)}
                </div>
              </AvatarFallback>
            </Avatar>
            <div>
              <Link href={profileUrl} className="font-semibold hover:text-primary transition-colors">
                {candidate.name}
              </Link>
              <p className="text-sm text-muted-foreground">{candidate.headline}</p>
            </div>
          </div>
          {showActions && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShortlistToggle}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {isShortlisted ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {candidate.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {candidate.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{candidate.skills.length - 4}
            </Badge>
          )}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>{candidate.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{candidate.experience} experience</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>
              ${candidate.compensation.min.toLocaleString()} - ${candidate.compensation.max.toLocaleString()}{" "}
              {candidate.compensation.currency}
            </span>
          </div>
        </div>

        {showActions && (
          <div className="flex space-x-2 pt-2">
            <Button asChild className="flex-1">
              <Link href={profileUrl}>View Profile</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
