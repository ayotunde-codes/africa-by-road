import { apiClient } from "@/services/http"
import { unwrapData, type ApiEnvelope } from "@/services/response"
import type { Contestant, FavoritePayload, FavoriteResponse } from "./types"

const VOTE_BASE = "/api/vote"

export async function getContestants() {
  const { data } = await apiClient.get<Contestant[] | ApiEnvelope<Contestant[]>>(`${VOTE_BASE}/contestants`)
  return unwrapData(data)
}

export async function getLeaderboard() {
  const { data } = await apiClient.get<Contestant[] | ApiEnvelope<Contestant[]>>(`${VOTE_BASE}/leaderboard`)
  return unwrapData(data)
}

export async function voteFavorite(payload: FavoritePayload) {
  const { data } = await apiClient.post<FavoriteResponse>(`${VOTE_BASE}/favorite`, payload)
  return data
}
