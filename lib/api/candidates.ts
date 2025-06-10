import type { Candidate } from "@/lib/stores/shortlist-store"

// Mock candidate data
const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    headline: "Senior Full Stack Developer",
    avatar: "/placeholder.svg?height=80&width=80",
    skills: ["React", "Node.js", "TypeScript", "Python", "AWS"],
    strengths: ["Problem Solving", "Leadership", "Communication", "Innovation"],
    compensation: { min: 120000, max: 150000, currency: "USD" },
    location: "San Francisco, CA",
    experience: "8 years",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    headline: "DevOps Engineer & Cloud Architect",
    avatar: "/placeholder.svg?height=80&width=80",
    skills: ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD"],
    strengths: ["System Design", "Automation", "Scalability", "Mentoring"],
    compensation: { min: 130000, max: 160000, currency: "USD" },
    location: "Austin, TX",
    experience: "10 years",
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    headline: "Product Designer & UX Researcher",
    avatar: "/placeholder.svg?height=80&width=80",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "A/B Testing"],
    strengths: ["Empathy", "Creativity", "Data-Driven", "Collaboration"],
    compensation: { min: 110000, max: 140000, currency: "USD" },
    location: "New York, NY",
    experience: "6 years",
  },
  {
    id: "4",
    name: "David Kim",
    headline: "Machine Learning Engineer",
    avatar: "/placeholder.svg?height=80&width=80",
    skills: ["Python", "TensorFlow", "PyTorch", "MLOps", "Statistics"],
    strengths: ["Analytical Thinking", "Research", "Innovation", "Teaching"],
    compensation: { min: 140000, max: 180000, currency: "USD" },
    location: "Seattle, WA",
    experience: "7 years",
  },
  {
    id: "5",
    name: "Priya Patel",
    headline: "Frontend Developer & Design Systems Lead",
    avatar: "/placeholder.svg?height=80&width=80",
    skills: ["React", "Vue.js", "CSS", "JavaScript", "Storybook"],
    strengths: ["Attention to Detail", "Component Architecture", "Performance", "Accessibility"],
    compensation: { min: 100000, max: 130000, currency: "USD" },
    location: "Remote",
    experience: "5 years",
  },
  {
    id: "6",
    name: "James Wilson",
    headline: "Backend Engineer & API Specialist",
    avatar: "/placeholder.svg?height=80&width=80",
    skills: ["Node.js", "GraphQL", "MongoDB", "Express", "REST APIs"],
    strengths: ["System Architecture", "Performance Optimization", "Documentation", "Mentoring"],
    compensation: { min: 115000, max: 145000, currency: "USD" },
    location: "Boston, MA",
    experience: "6 years",
  },
  {
    id: "7",
    name: "Sophia Lee",
    headline: "Data Scientist & ML Specialist",
    avatar: "/placeholder.svg?height=80&width=80",
    skills: ["Python", "R", "SQL", "TensorFlow", "Data Visualization"],
    strengths: ["Statistical Analysis", "Problem Solving", "Communication", "Research"],
    compensation: { min: 125000, max: 155000, currency: "USD" },
    location: "Chicago, IL",
    experience: "4 years",
  },
  {
    id: "8",
    name: "Michael Brown",
    headline: "Senior Software Engineer",
    avatar: "/placeholder.svg?height=80&width=80",
    skills: ["Java", "Spring Boot", "Microservices", "AWS", "Docker"],
    strengths: ["System Design", "Mentoring", "Problem Solving", "Leadership"],
    compensation: { min: 135000, max: 165000, currency: "USD" },
    location: "Austin, TX",
    experience: "9 years",
  },
]

interface FilterOptions {
  location?: string
  experience?: string
  salaryRange?: [number, number]
  skills?: string[]
}

export const candidatesApi = {
  search: async (
    query: string,
    page = 1,
    filters: FilterOptions = {},
  ): Promise<{ candidates: Candidate[]; hasMore: boolean }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Apply search query
    let filtered = query
      ? mockCandidates.filter(
          (candidate) =>
            candidate.name.toLowerCase().includes(query.toLowerCase()) ||
            candidate.headline.toLowerCase().includes(query.toLowerCase()) ||
            candidate.skills.some((skill) => skill.toLowerCase().includes(query.toLowerCase())),
        )
      : [...mockCandidates]

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter((candidate) => candidate.location === filters.location)
    }

    // Apply experience filter
    if (filters.experience) {
      filtered = filtered.filter((candidate) => {
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

    // Apply salary filter
    if (filters.salaryRange) {
      const [min, max] = filters.salaryRange
      filtered = filtered.filter((candidate) => candidate.compensation.min <= max && candidate.compensation.max >= min)
    }

    // Apply skills filter
    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter((candidate) => filters.skills!.some((skill) => candidate.skills.includes(skill)))
    }

    const pageSize = 10
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      candidates: filtered.slice(start, end),
      hasMore: end < filtered.length,
    }
  },

  getProfile: async (username: string): Promise<Candidate> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const candidate = mockCandidates.find((c) => c.name.toLowerCase().replace(" ", "") === username.toLowerCase())

    if (!candidate) {
      throw new Error("Candidate not found")
    }

    return candidate
  },
}
