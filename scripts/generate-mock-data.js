// Generate additional mock candidate data for testing
console.log("📊 Generating mock candidate data for TalentScope...\n")

const skills = [
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "TypeScript",
  "JavaScript",
  "Go",
  "Rust",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "MongoDB",
  "PostgreSQL",
  "Redis",
  "GraphQL",
  "REST APIs",
  "Microservices",
  "Machine Learning",
  "Data Science",
  "DevOps",
  "CI/CD",
  "Terraform",
  "Figma",
  "Sketch",
  "Adobe XD",
  "User Research",
  "Prototyping",
  "A/B Testing",
]

const locations = [
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Seattle, WA",
  "Boston, MA",
  "Denver, CO",
  "Remote",
  "Chicago, IL",
  "Los Angeles, CA",
  "Portland, OR",
  "Atlanta, GA",
  "Miami, FL",
]

const roles = [
  "Senior Software Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Data Scientist",
  "ML Engineer",
  "Product Designer",
  "UX Researcher",
  "Product Manager",
  "Engineering Manager",
  "Cloud Architect",
  "Security Engineer",
  "Mobile Developer",
  "QA Engineer",
]

const strengths = [
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

function generateRandomCandidate(id) {
  const firstName = ["Alex", "Sarah", "Marcus", "Elena", "David", "Priya", "James", "Maria", "Kevin", "Lisa"][
    Math.floor(Math.random() * 10)
  ]
  const lastName = ["Chen", "Johnson", "Rodriguez", "Kim", "Patel", "Smith", "Williams", "Brown", "Davis", "Miller"][
    Math.floor(Math.random() * 10)
  ]

  const candidateSkills = skills.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 6) + 3)
  const candidateStrengths = strengths.sort(() => 0.5 - Math.random()).slice(0, 4)

  const minSalary = 80000 + Math.floor(Math.random() * 100000)
  const maxSalary = minSalary + Math.floor(Math.random() * 50000) + 20000

  return {
    id: id.toString(),
    name: `${firstName} ${lastName}`,
    headline: roles[Math.floor(Math.random() * roles.length)],
    avatar: `/placeholder.svg?height=80&width=80`,
    skills: candidateSkills,
    strengths: candidateStrengths,
    compensation: {
      min: minSalary,
      max: maxSalary,
      currency: "USD",
    },
    location: locations[Math.floor(Math.random() * locations.length)],
    experience: `${Math.floor(Math.random() * 10) + 2} years`,
  }
}

// Generate 50 mock candidates
const mockCandidates = []
for (let i = 1; i <= 50; i++) {
  mockCandidates.push(generateRandomCandidate(i))
}

console.log(`✅ Generated ${mockCandidates.length} mock candidates`)
console.log("\nSample candidates:")
mockCandidates.slice(0, 5).forEach((candidate) => {
  console.log(`- ${candidate.name}: ${candidate.headline}`)
  console.log(`  Skills: ${candidate.skills.slice(0, 3).join(", ")}`)
  console.log(`  Location: ${candidate.location}`)
  console.log(
    `  Salary: $${candidate.compensation.min.toLocaleString()} - $${candidate.compensation.max.toLocaleString()}`,
  )
  console.log("")
})

console.log("🎯 Mock data generation complete!")
console.log("💡 This data can be used to test search, filtering, and pagination features")
