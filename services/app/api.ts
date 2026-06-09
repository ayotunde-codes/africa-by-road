import { apiClient } from "@/services/http"
import type { DashboardResponse } from "./types"

export async function getDashboard() {
  const { data } = await apiClient.get<DashboardResponse>("/api/app/dashboard")
  return data
}
