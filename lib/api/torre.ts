// Torre API endpoints
const TORRE_API_BASE = "https://torre.ai/api"
const ARDA_API_BASE = "https://arda.torre.co"

interface SearchFilters {
  location?: string
  skills?: string[]
  experience?: string
  remote?: boolean
}

interface SearchRequest {
  query: string
  limit?: number
  filters?: SearchFilters
}

interface SearchResponse {
  results: Array<{
    ggId: string
    name: string
    professionalHeadline: string
    picture?: string
    pictureThumbnail?: string
    location?: {
      name: string
      country: string
      countryCode: string
    }
    verified: boolean
    weight: number
    username?: string
    publicId?: string
    _debugInfo?: {
      allFields: string[]
      hasUrl: boolean
      hasSlug: boolean
      hasUsername: boolean
      hasHandle: boolean
      hasImage: boolean
      hasImageUrl: boolean
      hasPicture: boolean
      hasThumbnail: boolean
    }
  }>
  total: number
  metadata: {
    query: string
    searchTime: number
    cached: boolean
    filters?: Record<string, any>
  }
}

interface ProfileResponse {
  person: {
    ggId: string
    name: string
    professionalHeadline: string
    picture?: string
    completion: number
    verified: boolean
    location?: {
      name: string
      country: string
      latitude: number
      longitude: number
    }
    links: Array<{
      name: string
      address: string
    }>
  }
  stats: {
    projects: number
    jobs: number
    education: number
    strengths: number
  }
  strengths: Array<{
    name: string
    proficiency: "expert" | "proficient" | "novice" | "no-experience-interested"
    weight: number
    hits: number
  }>
  experiences: Array<{
    id: string
    category: "jobs" | "education" | "projects"
    name: string
    organizations: Array<{
      name: string
      picture?: string
    }>
    fromMonth?: string
    fromYear?: string
    toMonth?: string
    toYear?: string
  }>
  languages: Array<{
    language: string
    fluency: string
  }>
  processed: {
    skillsCount: number
    experienceYears: number
    topSkills: string[]
    completionScore: number
    industries: string[]
    skillsProficiencyBreakdown: {
      expert: number
      proficient: number
      novice: number
      "no-experience-interested": number
    }
    experienceSummary: string
  }
}

async function torreApiRequest<T>(baseUrl: string, endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const url = `${baseUrl}${endpoint}`
    console.log(`Torre API Request: ${options.method || "GET"} ${url}`)

    // Log request body for debugging
    if (options.body) {
      console.log("Request body:", options.body)
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "TalentScope/1.0",
        ...options.headers,
      },
    })

    console.log(`Torre API Response Status: ${response.status} ${response.statusText}`)

    const text = await response.text()

    if (!response.ok) {
      console.error(`Torre API Error Response: ${text}`)

      let errorData
      try {
        errorData = JSON.parse(text)
      } catch {
        errorData = { message: text }
      }

      if (response.status === 400) {
        throw new Error(`Torre API Bad Request: ${errorData.message || "Invalid request format"}`)
      } else if (response.status === 404) {
        throw new Error(`Torre API Not Found: ${errorData.message || "Resource not found"}`)
      } else if (response.status === 429) {
        throw new Error(`Torre API Rate Limited: ${errorData.message || "Too many requests"}`)
      } else {
        throw new Error(`Torre API Error: ${response.status} - ${errorData.message || text}`)
      }
    }

    try {
      return JSON.parse(text)
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError)
      console.error("Response text:", text)
      throw new Error("Invalid JSON response from Torre API")
    }
  } catch (error) {
    console.error("Torre API Request failed:", error)
    throw error
  }
}

export async function searchPeople(request: SearchRequest): Promise<SearchResponse> {
  try {
    const cleanQuery = request.query?.trim()
    if (!cleanQuery) {
      throw new Error("Search query is required")
    }

    console.log("Sending search request:", {
      query: cleanQuery,
      limit: request.limit || 20,
      filters: request.filters,
    })

    // Simplified payload that matches Torre's API more closely
    const searchPayload: any = {
      query: cleanQuery,
      identityType: "person",
      limit: request.limit || 20,
      meta: true,
    }

    // Only add filters if they have meaningful values
    if (request.filters) {
      if (request.filters.location) {
        searchPayload.location = request.filters.location
      }
      if (request.filters.skills && request.filters.skills.length > 0) {
        searchPayload.skills = request.filters.skills
      }
      if (request.filters.remote !== undefined) {
        searchPayload.remote = request.filters.remote
      }
    }

    console.log("Search payload:", JSON.stringify(searchPayload, null, 2))

    // Add a small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100))

    const response = await torreApiRequest<any>(ARDA_API_BASE, "/entities/_search", {
      method: "POST",
      body: JSON.stringify(searchPayload),
    })

    console.log("Torre Search Response Structure:", JSON.stringify(response, null, 2))

    // Transform Torre response to our format
    const results = (response.results || []).map((person: any, index: number) => {
      console.log(`Person ${index}:`, JSON.stringify(person, null, 2))

      // Torre uses 'imageUrl' in search results, not 'picture'
      const picture = person.imageUrl || person.picture || person.image || person.avatar
      const pictureThumbnail =
        person.imageUrl || person.pictureThumbnail || person.thumbnailUrl || person.thumbnail || picture

      console.log(`Image fields for ${person.name}:`, {
        imageUrl: person.imageUrl,
        picture: person.picture,
        selected: picture,
        thumbnail: pictureThumbnail,
      })

      return {
        ggId: person.ggId,
        name: person.name,
        professionalHeadline: person.professionalHeadline || "",
        picture: picture,
        pictureThumbnail: pictureThumbnail,
        location: person.location,
        verified: person.verified || false,
        weight: person.weight || 0,
        username: person.username,
        publicId: person.publicId,
        _debugInfo: {
          allFields: Object.keys(person),
          hasUrl: Boolean(person.url),
          hasSlug: Boolean(person.slug),
          hasUsername: Boolean(person.username),
          hasHandle: Boolean(person.handle),
          hasImage: Boolean(picture),
          hasImageUrl: Boolean(person.imageUrl),
          hasPicture: Boolean(person.picture),
          hasThumbnail: Boolean(person.pictureThumbnail),
        },
      }
    })

    return {
      results,
      total: results.length,
      metadata: {
        query: request.query,
        searchTime: Date.now(),
        cached: false,
        filters: request.filters,
      },
    }
  } catch (error) {
    console.error("Torre search failed:", error)
    throw error
  }
}

export async function getProfile(identifier: string): Promise<ProfileResponse> {
  try {
    if (!identifier || identifier.trim() === "") {
      throw new Error("Identifier is required")
    }

    const cleanIdentifier = identifier.trim().toLowerCase()
    console.log(`Fetching profile for identifier: ${cleanIdentifier}`)

    // Try different Torre profile endpoints
    const possibleEndpoints = [
      `/genome/bios/${cleanIdentifier}`,
      `/api/genome/bios/${cleanIdentifier}`,
      `/people/${cleanIdentifier}`,
      `/users/${cleanIdentifier}`,
    ]

    let response: any = null
    let lastError: Error | null = null

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`)
        response = await torreApiRequest<any>(TORRE_API_BASE, endpoint)
        console.log(`✅ Profile endpoint ${endpoint} succeeded!`)
        console.log("Raw Torre Profile Response:", JSON.stringify(response, null, 2))
        break
      } catch (error: any) {
        console.log(`❌ Endpoint ${endpoint} failed:`, error.message)
        lastError = error
        continue
      }
    }

    if (!response) {
      console.error("All profile endpoints failed for identifier:", cleanIdentifier)
      throw lastError || new Error(`Profile '${identifier}' not found on Torre`)
    }

    console.log("Profile response structure analysis:", {
      hasPersonField: Boolean(response.person),
      hasDirectFields: Boolean(response.name || response.ggId),
      hasStatsField: Boolean(response.stats),
      hasStrengthsField: Boolean(response.strengths),
      hasExperiencesField: Boolean(response.experiences),
      hasLanguagesField: Boolean(response.languages),
      topLevelKeys: Object.keys(response),
      personKeys: response.person ? Object.keys(response.person) : null,
    })

    // Transform Torre response to our format
    const profileData = {
      person: {
        ggId: response.person?.ggId || response.ggId || "",
        name: response.person?.name || response.name || "Unknown",
        professionalHeadline: response.person?.professionalHeadline || response.professionalHeadline || "",
        picture: response.person?.picture || response.picture,
        completion: response.person?.completion || response.completion || 0,
        verified: response.person?.verified || response.verified || false,
        location: response.person?.location || response.location,
        links: response.person?.links || response.links || [],
      },
      stats: response.stats || {
        projects: 0,
        jobs: 0,
        education: 0,
        strengths: 0,
      },
      strengths: response.strengths || [],
      experiences: response.experiences || [],
      languages: response.languages || [],
      processed: {
        skillsCount: response.strengths?.length || 0,
        experienceYears: 0,
        topSkills: (response.strengths || []).slice(0, 10).map((s: any) => s.name),
        completionScore: response.person?.completion || response.completion || 0,
        industries: [],
        skillsProficiencyBreakdown: {
          expert: 0,
          proficient: 0,
          novice: 0,
          "no-experience-interested": 0,
        },
        experienceSummary: `${response.stats?.jobs || 0} jobs, ${response.stats?.education || 0} education, ${
          response.stats?.projects || 0
        } projects`,
      },
    }

    console.log("Transformed profile data:", JSON.stringify(profileData, null, 2))

    return profileData
  } catch (error: any) {
    console.error("Torre profile fetch failed:", error)

    if (error.message?.includes("404") || error.message?.includes("011002")) {
      throw new Error(`Profile '${identifier}' not found on Torre`)
    }

    throw error
  }
}

export async function getSuggestions(query: string): Promise<string[]> {
  if (query.length < 3) return []

  const fallbackSuggestions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "UI/UX Designer",
    "DevOps Engineer",
    "Product Manager",
    "Software Engineer",
    "React Developer",
    "Node.js Developer",
    "Python Developer",
    "JavaScript Developer",
  ].filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()))

  return fallbackSuggestions.slice(0, 5)
}

export async function getSearchHistory(): Promise<
  Array<{
    id: string
    query: string
    filters: Record<string, any>
    resultsCount: number
    createdAt: string
  }>
> {
  return []
}
