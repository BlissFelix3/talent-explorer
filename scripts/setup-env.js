// Environment setup script for TalentScope
console.log("Setting up TalentScope environment...")

// Mock environment variables that would be used in production
const envVars = {
  NEXT_PUBLIC_API_URL: "https://api.talentscope.com",
  NEXT_PUBLIC_APP_NAME: "TalentScope",
  NEXT_PUBLIC_APP_VERSION: "2.0.0",
}

console.log("Environment variables configured:")
Object.entries(envVars).forEach(([key, value]) => {
  console.log(`${key}: ${value}`)
})

console.log("\n✅ TalentScope setup complete!")
console.log("🚀 Ready to discover exceptional talent!")

// Mock data validation
const mockCandidates = [
  { id: "1", name: "Sarah Chen", skills: ["React", "Node.js"] },
  { id: "2", name: "Marcus Johnson", skills: ["Kubernetes", "Docker"] },
  { id: "3", name: "Elena Rodriguez", skills: ["Figma", "User Research"] },
]

console.log(`\n📊 Mock data loaded: ${mockCandidates.length} candidates available`)
console.log("Demo credentials: demo@talentscope.com / password")
