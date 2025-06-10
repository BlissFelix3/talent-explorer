// Mock settings API
export interface UserSettings {
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
  }
  security: {
    twoFactor: boolean
  }
  preferences: {
    theme: "light" | "dark" | "system"
    language: string
  }
}

export const settingsApi = {
  getSettings: async (): Promise<UserSettings> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      notifications: {
        email: true,
        push: true,
        marketing: false,
      },
      security: {
        twoFactor: false,
      },
      preferences: {
        theme: "system",
        language: "en",
      },
    }
  },

  updateSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Mock update - in real app, this would save to database
    return {
      notifications: {
        email: true,
        push: true,
        marketing: false,
      },
      security: {
        twoFactor: false,
      },
      preferences: {
        theme: "system",
        language: "en",
      },
      ...settings,
    }
  },
}
