// Using Next.js proxy endpoints to avoid CORS issues
import { useAuthStore } from "../stores/auth-store";

interface SearchFilters {
  location?: string;
  skills?: string[];
  experience?: string;
  remote?: boolean;
}

interface SearchRequest {
  query: string;
  limit?: number;
  filters?: SearchFilters;
}

interface TorreSearchResult {
  ardaId: number;
  ggId: string;
  name: string;
  comparableName: string;
  username: string;
  professionalHeadline: string | null;
  imageUrl: string | null;
  completion: number;
  grammar: number;
  weight: number;
  verified: boolean;
  connections: any[];
  totalStrength: number;
  pageRank: number;
  organizationId: string | null;
  organizationNumericId: number | null;
  publicId: string | null;
  status: string | null;
  creators: any[];
  relationDegree: number;
  isSearchable: boolean;
  contact: boolean;
}

interface TorreSearchResponse {
  results: TorreSearchResult[];
  size: number;
  offset: number;
  total: number;
}

interface SearchResponse {
  results: Array<{
    ggId: string;
    ardaId: number;
    name: string;
    professionalHeadline: string;
    picture?: string;
    pictureThumbnail?: string;
    location?: {
      name: string;
      country: string;
      countryCode: string;
    };
    verified: boolean;
    weight: number;
    pageRank: number;
    username?: string;
    publicId?: string;
    completion: number;
    totalStrength: number;
    isSearchable: boolean;
  }>;
  total: number;
  metadata: {
    query: string;
    searchTime: number;
    cached: boolean;
    filters?: Record<string, any>;
  };
}

interface TorreProfileResponse {
  person: {
    professionalHeadline: string;
    completion: number;
    showPhone: boolean;
    created: string;
    verified: boolean;
    flags: Record<string, boolean>;
    weight: number;
    ggId: string;
    completionStage: {
      stage: number;
      progress: number;
    };
    locale: string;
    subjectId: number;
    picture: string;
    hasEmail: boolean;
    isTest: boolean;
    name: string;
    links: Array<{
      id: string;
      name: string;
      address: string;
    }>;
    location: {
      name: string;
      shortName: string;
      country: string;
      countryCode: string;
      latitude: number;
      longitude: number;
      timezone: string;
    };
    theme: string;
    id: string;
    pictureThumbnail: string;
    claimant: boolean;
    summaryOfBio: string;
    publicId: string;
  };
  stats: {
    jobs: number;
    education: number;
    strengths: number;
  };
  strengths: Array<{
    id: string;
    code: number;
    name: string;
    proficiency:
      | "expert"
      | "proficient"
      | "novice"
      | "no-experience-interested";
    implicitProficiency: boolean;
    weight: number;
    recommendations: number;
    media: any[];
    supra: boolean;
    created: string;
    hits: number;
    relatedExperiences: string[];
    pin: boolean;
  }>;
  interests?: Array<{
    id: string;
    name: string;
    media: any[];
  }>;
  experiences?: Array<{
    id: string;
    category: "jobs" | "education" | "projects";
    name: string;
    organizations: Array<{
      name: string;
      picture?: string;
    }>;
    fromMonth?: string;
    fromYear?: string;
    toMonth?: string;
    toYear?: string;
  }>;
  awards?: Array<{
    id: string;
    category: string;
    name: string;
    description: string;
  }>;
  jobs?: Array<{
    id: string;
    name: string;
    organizations: Array<{
      name: string;
      picture?: string;
    }>;
    fromMonth?: string;
    fromYear?: string;
    toMonth?: string;
    toYear?: string;
  }>;
  projects?: Array<{
    id: string;
    name: string;
    description: string;
    media: any[];
  }>;
  publications?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  education?: Array<{
    id: string;
    name: string;
    category: string;
    organizations: Array<{
      name: string;
      picture?: string;
    }>;
    fromMonth?: string;
    fromYear?: string;
    toMonth?: string;
    toYear?: string;
  }>;
  languages?: Array<{
    language: string;
    fluency: string;
  }>;
}

interface ProfileResponse {
  person: {
    ggId: string;
    ardaId: number;
    name: string;
    professionalHeadline: string;
    picture?: string;
    pictureThumbnail?: string;
    completion: number;
    verified: boolean;
    location?: {
      name: string;
      country: string;
      latitude: number;
      longitude: number;
      timezone: string;
    };
    links: Array<{
      name: string;
      address: string;
    }>;
    summaryOfBio?: string;
    publicId?: string;
    created: string;
    theme: string;
  };
  stats: {
    projects?: number;
    jobs: number;
    education: number;
    strengths: number;
  };
  strengths: Array<{
    name: string;
    proficiency:
      | "expert"
      | "proficient"
      | "novice"
      | "no-experience-interested";
    weight: number;
    hits: number;
    recommendations: number;
    pin: boolean;
  }>;
  experiences: Array<{
    id: string;
    category: "jobs" | "education" | "projects";
    name: string;
    organizations: Array<{
      name: string;
      picture?: string;
    }>;
    fromMonth?: string;
    fromYear?: string;
    toMonth?: string;
    toYear?: string;
  }>;
  languages: Array<{
    language: string;
    fluency: string;
  }>;
  processed: {
    skillsCount: number;
    experienceYears: number;
    topSkills: string[];
    completionScore: number;
    industries: string[];
    skillsProficiencyBreakdown: {
      expert: number;
      proficient: number;
      novice: number;
      "no-experience-interested": number;
    };
    experienceSummary: string;
  };
}

async function torreApiRequest<T>(
  baseUrl: string,
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const url = `${baseUrl}${endpoint}`;
    console.log(`Torre API Request: ${options.method || "GET"} ${url}`);

    // Log request body for debugging
    if (options.body) {
      console.log("Request body:", options.body);
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "TalentScope/1.0", // Add a user agent
        ...options.headers,
      },
    });

    console.log(
      `Torre API Response Status: ${response.status} ${response.statusText}`
    );

    const text = await response.text();

    if (!response.ok) {
      console.error(`Torre API Error Response: ${text}`);

      // Try to parse error response
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = { message: text };
      }

      // More specific error messages
      if (response.status === 400) {
        throw new Error(
          `Torre API Bad Request: ${
            errorData.message || "Invalid request format"
          }`
        );
      } else if (response.status === 404) {
        throw new Error(
          `Torre API Not Found: ${errorData.message || "Resource not found"}`
        );
      } else if (response.status === 429) {
        throw new Error(
          `Torre API Rate Limited: ${errorData.message || "Too many requests"}`
        );
      } else {
        throw new Error(
          `Torre API Error: ${response.status} - ${errorData.message || text}`
        );
      }
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Response text:", text);
      throw new Error("Invalid JSON response from Torre API");
    }
  } catch (error) {
    console.error("Torre API Request failed:", error);
    throw error;
  }
}

export async function searchPeople(
  request: SearchRequest
): Promise<SearchResponse> {
  try {
    // Clean and validate the request
    const cleanQuery = request.query?.trim();
    if (!cleanQuery) {
      throw new Error("Search query is required");
    }

    console.log("Sending search request:", {
      query: cleanQuery,
      limit: request.limit || 20,
      filters: request.filters,
    });

    // Simplified payload that matches Torre's API exactly as in the manual
    const searchPayload: any = {
      query: cleanQuery,
      identityType: "person",
      limit: request.limit || 20,
      meta: true,
    };

    // Only add filters if they have meaningful values - using correct field names
    if (request.filters) {
      if (request.filters.location) {
        searchPayload.location = request.filters.location;
      }
      if (request.filters.skills && request.filters.skills.length > 0) {
        searchPayload.skills = request.filters.skills;
      }
      // Remove remote filter as it's not supported by Torre API
    }

    console.log("Search payload:", JSON.stringify(searchPayload, null, 2));

    // Add a small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Get auth token
    const { accessToken } = useAuthStore.getState();

    // Use Next.js proxy API
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch("/api/torre/search", {
      method: "POST",
      headers,
      body: JSON.stringify(searchPayload),
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    const data = await response.json();

    console.log(
      "Torre Search Response Structure:",
      JSON.stringify(data, null, 2)
    );

    // Transform Torre response to our format - using the exact structure from the manual
    const results = (data.results || []).map((person: any, index: number) => {
      console.log(`Person ${index}:`, JSON.stringify(person, null, 2));

      // Torre uses 'imageUrl' in search results, not 'picture' - from the manual
      const picture =
        person.imageUrl || person.picture || person.image || person.avatar;
      const pictureThumbnail =
        person.imageUrl ||
        person.pictureThumbnail ||
        person.thumbnailUrl ||
        person.thumbnail ||
        picture;

      console.log(`Image fields for ${person.name}:`, {
        imageUrl: person.imageUrl,
        picture: person.picture,
        selected: picture,
        thumbnail: pictureThumbnail,
      });

      return {
        ggId: person.ggId,
        ardaId: person.ardaId || 0,
        name: person.name,
        professionalHeadline: person.professionalHeadline || "",
        picture: picture,
        pictureThumbnail: pictureThumbnail,
        location: person.location,
        verified: person.verified || false,
        weight: person.weight || 0,
        pageRank: person.pageRank || 0,
        username: person.username, // Extract the username field Torre provides
        publicId: person.publicId, // Extract publicId as backup
        completion: person.completion || 0,
        totalStrength: person.totalStrength || 0,
        isSearchable: person.isSearchable || true,
        // Log any additional fields that might contain username info
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
      };
    });

    return {
      results,
      total: results.length,
      metadata: {
        query: request.query,
        searchTime: Date.now(),
        cached: false,
        filters: request.filters,
      },
    };
  } catch (error) {
    console.error("Torre search failed:", error);
    throw error;
  }
}

export async function getTopRankedPeople(
  limit: number = 20
): Promise<SearchResponse> {
  try {
    console.log(`Fetching top ${limit} ranked people`);

    // Search for Torre.ai related terms to find Torre talent
    const torreQueries = ["Torre.ai", "Torre", "at Torre"];

    let allResults: any[] = [];

    // Search for Torre-related terms to get Torre talent
    for (const query of torreQueries.slice(0, 3)) {
      // Search Torre-specific terms
      try {
        const searchPayload = {
          query: query,
          identityType: "person",
          limit: limit * 2, // Get more results to find high pageRank
          meta: true,
        };

        console.log(`Torre search for: ${query}`);

        // Get auth token
        const { accessToken } = useAuthStore.getState();

        // Use Next.js proxy API
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const response = await fetch("/api/torre/search", {
          method: "POST",
          headers,
          body: JSON.stringify(searchPayload),
        });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }

        const data = await response.json();

        if (data.results) {
          // Filter for Torre.ai people only and high pageRank
          const torreResults = data.results.filter((person: any) => {
            const hasPageRank = person.pageRank && person.pageRank > 400;
            const profileCompletion =
              person.completion && person.completion > 0.68;
            const isTorreRelated =
              person.professionalHeadline?.toLowerCase().includes("torre.ai") ||
              person.professionalHeadline?.toLowerCase().includes("torre") ||
              person.professionalHeadline?.toLowerCase().includes("at torre") ||
              // person.location?.name?.toLowerCase().includes("torre") ||
              // person.username?.toLowerCase().includes("torre") ||
              // person.name?.toLowerCase().includes("torre") ||
              JSON.stringify(person).toLowerCase().includes("torre.ai");

            console.log(
              `Checking ${person.name}: Torre-related=${isTorreRelated}, PageRank=${person.pageRank}`
            );
            return hasPageRank && isTorreRelated && profileCompletion;
          });
          allResults.push(...torreResults);
        }

        // Small delay between requests
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (queryError) {
        console.warn(`Search failed for query "${query}":`, queryError);
        continue; // Try next query
      }
    }

    console.log(`Combined ${allResults.length} Torre.ai related results`);

    // Remove duplicates based on ggId
    const uniqueResults = allResults.filter(
      (person, index, self) =>
        index === self.findIndex((p) => p.ggId === person.ggId)
    );

    console.log(`Removed duplicates, ${uniqueResults.length} unique results`);

    // Transform and sort by pageRank client-side - prioritize high pageRank
    const results = uniqueResults
      .map((person: any) => ({
        ggId: person.ggId,
        ardaId: person.ardaId || 0,
        name: person.name,
        professionalHeadline: person.professionalHeadline || "",
        picture: person.imageUrl || person.picture,
        pictureThumbnail: person.imageUrl || person.pictureThumbnail,
        location: person.location,
        verified: person.verified || false,
        weight: person.weight || 0,
        pageRank: person.pageRank || 0,
        username: person.username,
        publicId: person.publicId,
        completion: person.completion || 0,
        totalStrength: person.totalStrength || 0,
        isSearchable: person.isSearchable || true,
      }))
      // Sort by pageRank descending - highest first
      .sort((a, b) => {
        const aRank = a.pageRank || 0;
        const bRank = b.pageRank || 0;
        // If pageRanks are equal, sort by totalStrength, then completion
        if (aRank === bRank) {
          if (a.totalStrength !== b.totalStrength) {
            return (b.totalStrength || 0) - (a.totalStrength || 0);
          }
          return (b.completion || 0) - (a.completion || 0);
        }
        return bRank - aRank;
      })
      .slice(0, limit); // Limit to requested number

    console.log(
      `Top ${results.length} ranked results by pageRank:`,
      results.map((r) => ({
        name: r.name,
        username: r.username,
        publicId: r.publicId,
        pageRank: r.pageRank,
        totalStrength: r.totalStrength,
        completion: r.completion,
        headline: r.professionalHeadline,
      }))
    );

    return {
      results,
      total: results.length,
      metadata: {
        query: "torre-ai-talent",
        searchTime: Date.now(),
        cached: false,
      },
    };
  } catch (error) {
    console.error("Torre top ranked fetch failed:", error);
    throw error;
  }
}

export async function getProfile(identifier: string): Promise<ProfileResponse> {
  try {
    // Validate identifier
    if (!identifier || identifier.trim() === "") {
      throw new Error("Identifier is required");
    }

    // Clean identifier (remove any special characters that might cause issues)
    const cleanIdentifier = identifier.trim().toLowerCase();

    console.log(`Fetching profile for identifier: ${cleanIdentifier}`);

    // Get auth token
    const { accessToken } = useAuthStore.getState();

    // Use Next.js proxy API
    console.log(`Fetching profile via proxy for: ${cleanIdentifier}`);

    const headers: Record<string, string> = {
      Accept: "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const proxyResponse = await fetch(`/api/torre/profile/${cleanIdentifier}`, {
      headers,
    });

    if (!proxyResponse.ok) {
      const errorData = await proxyResponse.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Profile '${identifier}' not found on Torre`
      );
    }

    const response = await proxyResponse.json();
    console.log(
      "Raw Torre Profile Response:",
      JSON.stringify(response, null, 2)
    );

    console.log("Profile response structure analysis:", {
      hasPersonField: Boolean(response.person),
      hasDirectFields: Boolean(response.person?.name || response.person?.ggId),
      hasStatsField: Boolean(response.stats),
      hasStrengthsField: Boolean(response.strengths),
      hasExperiencesField: Boolean(response.experiences),
      hasLanguagesField: Boolean(response.languages),
      topLevelKeys: Object.keys(response),
      personKeys: response.person ? Object.keys(response.person) : null,
    });

    // Calculate experience years from jobs/experiences
    const experienceYears = (
      response.experiences ||
      response.jobs ||
      []
    ).reduce((total: number, exp: { fromYear: string; toYear: string }) => {
      if (exp.fromYear && exp.toYear) {
        return total + (parseInt(exp.toYear) - parseInt(exp.fromYear));
      } else if (exp.fromYear && !exp.toYear) {
        return total + (new Date().getFullYear() - parseInt(exp.fromYear));
      }
      return total;
    }, 0);

    // Calculate skills proficiency breakdown
    const skillsProficiencyBreakdown = (response.strengths || []).reduce(
      (
        acc: { [x: string]: any },
        strength: { proficiency: string | number }
      ) => {
        acc[strength.proficiency] = (acc[strength.proficiency] || 0) + 1;
        return acc;
      },
      {
        expert: 0,
        proficient: 0,
        novice: 0,
        "no-experience-interested": 0,
      }
    );

    // Transform Torre response to our format
    const profileData: ProfileResponse = {
      person: {
        ggId: response.person?.ggId || "",
        ardaId: response.person?.subjectId || 0,
        name: response.person?.name || "Unknown",
        professionalHeadline: response.person?.professionalHeadline || "",
        picture: response.person?.picture,
        pictureThumbnail: response.person?.pictureThumbnail,
        completion: response.person?.completion || 0,
        verified: response.person?.verified || false,
        location: response.person?.location,
        links: response.person?.links || [],
        summaryOfBio: response.person?.summaryOfBio,
        publicId: response.person?.publicId,
        created: response.person?.created || "",
        theme: response.person?.theme || "blue200",
      },
      stats: {
        projects: response.stats?.projects || response.projects?.length || 0,
        jobs: response.stats?.jobs || response.jobs?.length || 0,
        education: response.stats?.education || response.education?.length || 0,
        strengths: response.stats?.strengths || response.strengths?.length || 0,
      },
      strengths: (response.strengths || []).map(
        (strength: {
          name: any;
          proficiency: any;
          weight: any;
          hits: any;
          recommendations: any;
          pin: any;
        }) => ({
          name: strength.name,
          proficiency: strength.proficiency,
          weight: strength.weight,
          hits: strength.hits,
          recommendations: strength.recommendations,
          pin: strength.pin,
        })
      ),
      experiences: response.experiences || response.jobs || [],
      languages: response.languages || [],
      processed: {
        skillsCount: response.strengths?.length || 0,
        experienceYears,
        topSkills: (response.strengths || [])
          .slice(0, 10)
          .map((s: any) => s.name),
        completionScore: response.person?.completion || 0,
        industries: [], // Can be derived from experiences if needed
        skillsProficiencyBreakdown,
        experienceSummary: `${response.stats?.jobs || 0} jobs, ${
          response.stats?.education || 0
        } education, ${response.stats?.projects || 0} projects`,
      },
    };

    console.log(
      "Transformed profile data:",
      JSON.stringify(profileData, null, 2)
    );

    return profileData;
  } catch (error: any) {
    console.error("Torre profile fetch failed:", error);

    // Enhanced error handling
    if (error.message?.includes("404")) {
      throw new Error(`Profile '${identifier}' not found on Torre`);
    }

    if (error.message?.includes("011002")) {
      throw new Error(`Profile '${identifier}' not found on Torre`);
    }

    throw error;
  }
}

export async function getSuggestions(query: string): Promise<string[]> {
  if (query.length < 3) return [];

  // Return fallback suggestions since Torre doesn't have a suggestions endpoint
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
  ].filter((suggestion) =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  );

  return fallbackSuggestions.slice(0, 5);
}

export async function getSearchHistory(): Promise<
  Array<{
    id: string;
    query: string;
    filters: Record<string, any>;
    resultsCount: number;
    createdAt: string;
  }>
> {
  // Return empty array for now since we're not using backend
  return [];
}
