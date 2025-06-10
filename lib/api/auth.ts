export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  accessToken: string
  refreshToken: string
}

// Mock authentication - simulate API calls
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation
    if (data.email === "demo@talentscope.com" && data.password === "password") {
      return {
        user: {
          id: "1",
          name: "Demo User",
          email: data.email,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        accessToken: "mock-access-token-" + Date.now(),
        refreshToken: "mock-refresh-token-" + Date.now(),
      }
    }

    throw new Error("Invalid credentials")
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      user: {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      accessToken: "mock-access-token-" + Date.now(),
      refreshToken: "mock-refresh-token-" + Date.now(),
    }
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (refreshToken.startsWith("mock-refresh-token")) {
      return {
        accessToken: "mock-access-token-" + Date.now(),
      }
    }

    throw new Error("Invalid refresh token")
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
  },
}
