"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { Navbar } from "@/components/navbar"
import { Search, MessageCircle } from "lucide-react"
import Link from "next/link"

// Mock conversations data
const mockConversations = [
  {
    id: "1",
    candidate: {
      id: "1",
      name: "Sarah Chen",
      headline: "Senior Full Stack Developer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: "Thanks for reaching out! I'd love to discuss the opportunity.",
    timestamp: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    candidate: {
      id: "2",
      name: "Marcus Johnson",
      headline: "DevOps Engineer & Cloud Architect",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: "I have experience with Kubernetes and would be interested in learning more about the role.",
    timestamp: "1 day ago",
    unread: false,
  },
  {
    id: "3",
    candidate: {
      id: "3",
      name: "Elena Rodriguez",
      headline: "Product Designer & UX Researcher",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: "Could we schedule a call to discuss the design team structure?",
    timestamp: "3 days ago",
    unread: true,
  },
]

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = mockConversations.filter((conversation) =>
    conversation.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Messages</h1>
                <p className="text-muted-foreground">Communicate with candidates and schedule interviews</p>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {filteredConversations.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No conversations found</h3>
                  <p className="text-muted-foreground">
                    Start messaging candidates from their profile pages to begin conversations.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredConversations.map((conversation) => (
                  <Link key={conversation.id} href={`/messages/${conversation.candidate.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={conversation.candidate.avatar || "/placeholder.svg"}
                              alt={conversation.candidate.name}
                            />
                            <AvatarFallback>
                              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                                {conversation.candidate.name.charAt(0)}
                              </div>
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold truncate">{conversation.candidate.name}</h3>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{conversation.timestamp}</span>
                                {conversation.unread && (
                                  <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{conversation.candidate.headline}</p>
                            <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
