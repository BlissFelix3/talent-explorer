import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login: (user: User, accessToken: string, refreshToken: string) => void
  logout: () => void
  setUser: (user: User) => void
  setAccessToken: (token: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
      setUser: (user) => set({ user }),
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        refreshToken: state.refreshToken,
      }),
    },
  ),
)
