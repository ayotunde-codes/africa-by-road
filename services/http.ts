import axios from "axios"

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://africa-by-road-1.onrender.com"
export const AUTH_TOKEN_KEY = "authToken"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config
  }

  const token = window.localStorage.getItem(AUTH_TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export function setAuthToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token)
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}
