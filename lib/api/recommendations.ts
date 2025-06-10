import type { Candidate } from "@/lib/stores/shortlist-store"
import { searchPeople } from "./torre"

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

// Mock job and learning recommendations (these would come from other APIs)
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
    try {
      // Get recommended candidates from Torre based on popular skills
      const response = await searchPeople({
        query: "React developer",
        limit: 6,
      })

      // Transform Torre results to our Candidate interface
      const candidates: Candidate[] = response.results.map((result) => {
        const experienceYears = Math.floor(Math.random() * 8) + 3
        const skills = ["React", "JavaScript", "TypeScript", "Node.js", "CSS"].slice(
          0,
          Math.floor(Math.random() * 3) + 3,
        )

        return {
          id: result.ggId,
          name: result.name,
          headline: result.professionalHeadline || "Software Developer",
          avatar: result.imageUrl || "/placeholder.svg?height=80&width=80",
          skills: skills,
          strengths: ["Problem Solving", "Leadership", "Innovation", "Communication"],
          compensation: {
            min: 100000 + Math.floor(Math.random() * 50000),
            max: 130000 + Math.floor(Math.random() * 50000),
            currency: "USD",
          },
          location: "Remote",
          experience: `${experienceYears} years`,
          username: result.username,
          publicId: result.publicId,
          verified: result.verified,
        }
      })

      return candidates.slice(0, 3) // Return top 3 recommendations
    } catch (error) {
      console.error("Failed to get candidate recommendations:", error)
      // Return empty array on error
      return []
    }
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
