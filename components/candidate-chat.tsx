"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface CandidateChatProps {
  candidate: {
    id: string
    name: string
    headline: string
    avatar: string
    skills: string[]
    experience: string
  }
}

export function CandidateChat({ candidate }: CandidateChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Add initial greeting message
  useEffect(() => {
    const initialMessage = {
      id: "initial",
      role: "assistant" as const,
      content: `Hi there! I'm ${candidate.name}, a ${candidate.headline}. How can I help you today?`,
      timestamp: new Date(),
    }
    setMessages([initialMessage])
  }, [candidate])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

      if (!apiKey) {
        throw new Error("OpenRouter API key is not configured")
      }

      // Create context for the AI
      const context = `You are ${candidate.name}, a ${candidate.headline} with ${candidate.experience} of experience.
Your skills include: ${candidate.skills.join(", ")}.
You are responding to a recruiter who is interested in your profile.
Be professional, enthusiastic, and provide detailed responses about your experience and skills.
Keep responses concise (under 150 words) but informative.`

      // Get conversation history
      const conversation = messages
        .map((msg) => `${msg.role === "user" ? "Recruiter" : candidate.name}: ${msg.content}`)
        .join("\n")

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-exp:free",
          messages: [
            {
              role: "system",
              content: context,
            },
            {
              role: "user",
              content: `Conversation history:\n${conversation}\n\nRecruiter: ${input}\n\nPlease respond as ${candidate.name}:`,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      const assistantResponse = data.choices[0]?.message?.content?.trim()

      if (!assistantResponse) {
        throw new Error("No response generated")
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: assistantResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
            <AvatarFallback>
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                {candidate.name.charAt(0)}
              </div>
            </AvatarFallback>
          </Avatar>
          <div>
            <p>{candidate.name}</p>
            <p className="text-xs text-muted-foreground">{candidate.headline}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="border-t p-3">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
