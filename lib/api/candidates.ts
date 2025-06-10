import type { Candidate } from "@/lib/stores/shortlist-store"
import { searchPeople, getProfile, type SearchResponse, type ProfileResponse } from "./torre"

interface FilterOptions {
  location?: string
  experience?: string
  salaryRange?: [number, number]
  skills?: string[]
}

// Transform Torre search result to our Candidate interface
function transformTorreSearchResult(torreResult: SearchResponse["results"][0]): Candidate {
  // Extract years of experience from professional headline or default to random
  const experienceMatch = torreResult.professionalHeadline?.match(/(\d+)\+?\s*years?/i)
  const experienceYears = experienceMatch ? Number.parseInt(experienceMatch[1]) : Math.floor(Math.random() * 10) + 2

  // Generate skills from professional headline or use defaults
  const skills = extractSkillsFromHeadline(torreResult.professionalHeadline || "")

  // Generate compensation based on experience and role
  const baseCompensation = calculateCompensation(torreResult.professionalHeadline || "", experienceYears)

  return {
    id: torreResult.ggId,
    name: torreResult.name,
    headline: torreResult.professionalHeadline || "Professional",
    avatar: torreResult.picture || torreResult.pictureThumbnail || "/placeholder.svg?height=80&width=80",
    skills: skills,
    strengths: generateStrengths(skills),
    compensation: baseCompensation,
    location: torreResult.location?.name || "Remote",
    experience: `${experienceYears} years`,
    username: torreResult.username,
    publicId: torreResult.publicId,
    verified: torreResult.verified,
  }
}

// Transform Torre profile to our Candidate interface
function transformTorreProfile(torreProfile: ProfileResponse): Candidate {
  const experienceYears = calculateExperienceYears(torreProfile.experiences)
  const skills = torreProfile.strengths.slice(0, 8).map((s) => s.name)
  const strengths = torreProfile.strengths
    .filter((s) => s.proficiency === "expert" || s.proficiency === "proficient")
    .slice(0, 4)
    .map((s) => s.name)

  const compensation = calculateCompensationFromProfile(torreProfile)

  return {
    id: torreProfile.person.ggId,
    name: torreProfile.person.name,
    headline: torreProfile.person.professionalHeadline || "Professional",
    avatar: torreProfile.person.picture || "/placeholder.svg?height=80&width=80",
    skills: skills,
    strengths: strengths.length > 0 ? strengths : generateStrengths(skills),
    compensation: compensation,
    location: torreProfile.person.location?.name || "Remote",
    experience: `${experienceYears} years`,
    username: torreProfile.person.ggId, // Use ggId as username fallback
    publicId: torreProfile.person.ggId,
    completion: torreProfile.person.completion,
    verified: torreProfile.person.verified,
    links: torreProfile.person.links,
    languages: torreProfile.languages,
    torreData: torreProfile,
  }
}

function extractSkillsFromHeadline(headline: string): string[] {
  const commonSkills = [
    "React",
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "Node.js",
    "AWS",
    "Docker",
    "Kubernetes",
    "SQL",
    "MongoDB",
    "GraphQL",
    "Vue.js",
    "Angular",
    "Go",
    "Rust",
    "PostgreSQL",
    "Redis",
    "Microservices",
    "DevOps",
    "CI/CD",
    "Terraform",
    "Machine Learning",
    "Data Science",
    "UI/UX",
    "Figma",
    "Product Management",
  ]

  const foundSkills = commonSkills.filter((skill) => headline.toLowerCase().includes(skill.toLowerCase()))

  if (foundSkills.length === 0) {
    if (headline.toLowerCase().includes("frontend") || headline.toLowerCase().includes("ui")) {
      return ["React", "JavaScript", "CSS", "HTML"]
    } else if (headline.toLowerCase().includes("backend") || headline.toLowerCase().includes("api")) {
      return ["Node.js", "Python", "SQL", "REST APIs"]
    } else if (headline.toLowerCase().includes("full stack")) {
      return ["React", "Node.js", "JavaScript", "SQL"]
    } else if (headline.toLowerCase().includes("devops")) {
      return ["Docker", "Kubernetes", "AWS", "CI/CD"]
    } else if (headline.toLowerCase().includes("data")) {
      return ["Python", "SQL", "Machine Learning", "Data Science"]
    } else if (headline.toLowerCase().includes("design")) {
      return ["Figma", "UI/UX", "Prototyping", "User Research"]
    }
    return ["JavaScript", "Python", "SQL"]
  }

  return foundSkills.slice(0, 6)
}

function generateStrengths(skills: string[]): string[] {
  const allStrengths = [
    "Problem Solving",
    "Leadership",
    "Communication",
    "Innovation",
    "Teamwork",
    "Analytical Thinking",
    "Creativity",
    "Adaptability",
    "Mentoring",
    "Strategic Thinking",
    "Attention to Detail",
    "Time Management",
    "Critical Thinking",
    "Collaboration",
  ]

  return allStrengths.sort(() => 0.5 - Math.random()).slice(0, 4)
}

function calculateCompensation(
  headline: string,
  experienceYears: number,
): { min: number; max: number; currency: string } {
  let baseMin = 60000
  let baseMax = 80000

  if (headline.toLowerCase().includes("senior") || headline.toLowerCase().includes("lead")) {
    baseMin = 100000
    baseMax = 140000
  } else if (headline.toLowerCase().includes("principal") || headline.toLowerCase().includes("architect")) {
    baseMin = 140000
    baseMax = 180000
  } else if (headline.toLowerCase().includes("manager") || headline.toLowerCase().includes("director")) {
    baseMin = 120000
    baseMax = 160000
  }

  if (headline.toLowerCase().includes("machine learning") || headline.toLowerCase().includes("ai")) {
    baseMin += 20000
    baseMax += 30000
  } else if (headline.toLowerCase().includes("devops") || headline.toLowerCase().includes("cloud")) {
    baseMin += 15000
    baseMax += 25000
  }

  const experienceMultiplier = Math.min(experienceYears * 0.1, 0.5)
  baseMin += baseMin * experienceMultiplier
  baseMax += baseMax * experienceMultiplier

  return {
    min: Math.round(baseMin),
    max: Math.round(baseMax),
    currency: "USD",
  }
}

function calculateExperienceYears(experiences: ProfileResponse["experiences"]): number {
  if (!experiences || experiences.length === 0) return 2

  let totalYears = 0
  for (const exp of experiences) {
    if (exp.fromYear && exp.toYear) {
      totalYears += Number.parseInt(exp.toYear) - Number.parseInt(exp.fromYear)
    } else if (exp.fromYear) {
      totalYears += new Date().getFullYear() - Number.parseInt(exp.fromYear)
    }
  }

  return Math.max(totalYears, 1)
}

function calculateCompensationFromProfile(profile: ProfileResponse): {
  min: number
  max: number
  currency: string
} {
  const experienceYears = calculateExperienceYears(profile.experiences)
  const headline = profile.person.professionalHeadline || ""
  const completionBonus = profile.person.completion * 0.2

  const baseCompensation = calculateCompensation(headline, experienceYears)

  return {
    min: Math.round(baseCompensation.min * (1 + completionBonus)),
    max: Math.round(baseCompensation.max * (1 + completionBonus)),
    currency: "USD",
  }
}

export const candidatesApi = {
  search: async (
    query: string,
    page = 1,
    filters: FilterOptions = {},
  ): Promise<{ candidates: Candidate[]; hasMore: boolean }> => {
    try {
      const pageSize = 10
      const searchRequest = {
        query: query || "developer",
        limit: pageSize,
        filters: {
          location: filters.location,
          skills: filters.skills,
          remote: filters.location === "Remote",
        },
      }

      const response = await searchPeople(searchRequest)
      const candidates = response.results.map(transformTorreSearchResult)

      // Apply additional client-side filters
      let filteredCandidates = candidates

      if (filters.experience) {
        filteredCandidates = filteredCandidates.filter((candidate) => {
          const years = Number.parseInt(candidate.experience.split(" ")[0])
          switch (filters.experience) {
            case "0-2 years":
              return years <= 2
            case "3-5 years":
              return years >= 3 && years <= 5
            case "6-8 years":
              return years >= 6 && years <= 8
            case "8+ years":
              return years >= 8
            default:
              return true
          }
        })
      }

      if (filters.salaryRange) {
        const [min, max] = filters.salaryRange
        filteredCandidates = filteredCandidates.filter(
          (candidate) => candidate.compensation.min <= max && candidate.compensation.max >= min,
        )
      }

      if (filters.skills && filters.skills.length > 0) {
        filteredCandidates = filteredCandidates.filter((candidate) =>
          filters.skills!.some((skill) => candidate.skills.includes(skill)),
        )
      }

      return {
        candidates: filteredCandidates,
        hasMore: false, // For now, we don't implement pagination
      }
    } catch (error) {
      console.error("Search candidates failed:", error)
      throw new Error("Failed to search candidates. Please try again.")
    }
  },

  getProfile: async (identifier: string): Promise<Candidate> => {
    try {
      const response = await getProfile(identifier)
      return transformTorreProfile(response)
    } catch (error) {
      console.error("Get profile failed:", error)
      throw new Error(`Failed to load profile for ${identifier}`)
    }
  },
}
