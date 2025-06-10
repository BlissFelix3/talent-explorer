import axios from "axios"
import { useAuthStore } from "@/lib/stores/auth-store"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.talentscope.com",
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const { refreshToken, setAccessToken, logout } = useAuthStore.getState()

      if (refreshToken) {
        try {
          const response = await axios.post("/auth/refresh", {
            refreshToken,
          })

          const { accessToken } = response.data
          setAccessToken(accessToken)

          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          logout()
          window.location.href = "/login"
          return Promise.reject(refreshError)
        }
      } else {
        logout()
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  },
)
