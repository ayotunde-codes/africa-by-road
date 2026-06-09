import axios from "axios"

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (axios.isAxiosError<{ message?: string; error?: string }>(error)) {
    return error.response?.data?.message || error.response?.data?.error || error.message || fallback
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}
