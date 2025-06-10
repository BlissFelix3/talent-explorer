"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { useShortlistStore } from "@/lib/stores/shortlist-store"
import { Trash2, Edit3, Users, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ShortlistPage() {
  const { candidates, selectedForComparison, removeCandidate, updateNote, toggleComparison, clearComparison } =
    useShortlistStore()
  const { toast } = useToast()
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [noteText, setNoteText] = useState("")

  const handleRemoveCandidate = (id: string, name: string) => {
    removeCandidate(id)
    toast({
      title: "Candidate removed",
      description: `${name} has been removed from your shortlist.`,
    })
  }

  const handleEditNote = (id: string, currentNote: string) => {
    setEditingNote(id)
    setNoteText(currentNote || "")
  }

  const handleSaveNote = (id: string) => {
    updateNote(id, noteText)
    setEditingNote(null)
    setNoteText("")
    toast({
      title: "Note saved",
      description: "Your note has been updated.",
    })
  }

  const selectedCandidates = candidates.filter((c) => selectedForComparison.includes(c.id))

  if (candidates.length === 0) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="container py-8">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Your shortlist is empty</h3>
                  <p className="text-muted-foreground mb-6">
                    Start building your shortlist by adding candidates from the search page.
                  </p>
                  <Button asChild>
                    <Link href="/search">Browse Candidates</Link>
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
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Your Shortlist</h1>
                <p className="text-muted-foreground">
                  {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} saved
                </p>
              </div>

              {selectedForComparison.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{selectedForComparison.length} selected for comparison</Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Compare Selected</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Candidate Comparison</DialogTitle>
                        <DialogDescription>Compare selected candidates side by side</DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {selectedCandidates.map((candidate) => (
                          <Card key={candidate.id}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                                  <AvatarFallback>
                                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                                      {candidate.name.charAt(0)}
                                    </div>
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-semibold">{candidate.name}</h4>
                                  <p className="text-sm text-muted-foreground">{candidate.headline}</p>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <h5 className="font-medium mb-2">Skills</h5>
                                <div className="flex flex-wrap gap-1">
                                  {candidate.skills.slice(0, 3).map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h5 className="font-medium mb-1">Experience</h5>
                                <p className="text-sm text-muted-foreground">{candidate.experience}</p>
                              </div>

                              <div>
                                <h5 className="font-medium mb-1">Compensation</h5>
                                <p className="text-sm text-muted-foreground">
                                  ${candidate.compensation.min.toLocaleString()} - $
                                  {candidate.compensation.max.toLocaleString()}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <div className="flex justify-end">
                        <Button variant="outline" onClick={clearComparison}>
                          Clear Selection
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>

            <div className="grid gap-6">
              {candidates.map((candidate) => (
                <Card key={candidate.id} className="group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex items-start space-x-4 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedForComparison.includes(candidate.id)}
                          onChange={() => toggleComparison(candidate.id)}
                          className="mt-1"
                        />

                        <Avatar className="h-12 w-12">
                          <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
                          <AvatarFallback>
                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                              {candidate.name.charAt(0)}
                            </div>
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-3">
                          <div>
                            <Link
                              href={`/profile/${candidate.name.toLowerCase().replace(" ", "")}`}
                              className="font-semibold text-lg hover:text-primary transition-colors"
                            >
                              {candidate.name}
                            </Link>
                            <p className="text-muted-foreground">{candidate.headline}</p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {candidate.skills.slice(0, 5).map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="text-sm text-muted-foreground">
                            {candidate.location} • {candidate.experience} • $
                            {candidate.compensation.min.toLocaleString()} - $
                            {candidate.compensation.max.toLocaleString()}
                          </div>

                          {/* Notes Section */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium">Notes:</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditNote(candidate.id, candidate.note || "")}
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                            </div>

                            {editingNote === candidate.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={noteText}
                                  onChange={(e) => setNoteText(e.target.value)}
                                  placeholder="Add your notes about this candidate..."
                                  className="min-h-[80px]"
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => handleSaveNote(candidate.id)}>
                                    Save
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingNote(null)}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">{candidate.note || "No notes added yet."}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/profile/${candidate.name.toLowerCase().replace(" ", "")}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveCandidate(candidate.id, candidate.name)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
