import axios from "axios"

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://africa-by-road-1.onrender.com"

// Remove the legacy JavaScript-readable token once. Authentication now uses
// the backend's httpOnly cookie, which is not exposed to injected scripts.
if (typeof window !== "undefined") {
  window.localStorage.removeItem("authToken")
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})
