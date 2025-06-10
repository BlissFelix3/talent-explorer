import type { Candidate } from "@/lib/stores/shortlist-store"

export interface JobRecommendation {
  id: string
  title: string
  company: string
  location: string
  salary: {
    min: number
    max: number
    currency: string
  }
  skills: string[]
  match: number
  description: string
}

export interface LearningRecommendation {
  id: string
  title: string
  provider: string
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  relevance: "High" | "Medium" | "Low"
  url: string
}

// Mock recommendations data
const mockJobRecommendations: JobRecommendation[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: { min: 120000, max: 160000, currency: "USD" },
    skills: ["React", "TypeScript", "GraphQL", "Next.js"],
    match: 92,
    description: "Join our team building the next generation of web applications.",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "StartupX",
    location: "Remote",
    salary: { min: 100000, max: 140000, currency: "USD" },
    skills: ["Node.js", "React", "PostgreSQL", "AWS"],
    match: 88,
    description: "Help us scale our platform to millions of users.",
  },
]

const mockLearningRecommendations: LearningRecommendation[] = [
  {
    id: "1",
    title: "Advanced React Patterns",
    provider: "TechEd",
    duration: "4 weeks",
    level: "Advanced",
    relevance: "High",
    url: "#",
  },
  {
    id: "2",
    title: "AWS Solutions Architect",
    provider: "CloudAcademy",
    duration: "8 weeks",
    level: "Intermediate",
    relevance: "Medium",
    url: "#",
  },
]

export const recommendationsApi = {
  getCandidateRecommendations: async (): Promise<Candidate[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Return a subset of candidates as recommendations
    return [
      {
        id: "rec-1",
        name: "Alex Chen",
        headline: "Senior React Developer",
        avatar: "/placeholder.svg?height=80&width=80",
        skills: ["React", "TypeScript", "Node.js", "GraphQL"],
        strengths: ["Problem Solving", "Leadership", "Innovation", "Communication"],
        compensation: { min: 130000, max: 160000, currency: "USD" },
        location: "San Francisco, CA",
        experience: "6 years",
      },
      {
        id: "rec-2",
        name: "Sarah Kim",
        headline: "Full Stack Engineer",
        avatar: "/placeholder.svg?height=80&width=80",
        skills: ["Python", "React", "AWS", "PostgreSQL"],
        strengths: ["Analytical Thinking", "Teamwork", "Adaptability", "Mentoring"],
        compensation: { min: 120000, max: 150000, currency: "USD" },
        location: "Seattle, WA",
        experience: "5 years",
      },
    ]
  },

  getJobRecommendations: async (): Promise<JobRecommendation[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return mockJobRecommendations
  },

  getLearningRecommendations: async (): Promise<LearningRecommendation[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return mockLearningRecommendations
  },
}
