import { apiClient } from "@/services/http"
import { unwrapData, type ApiEnvelope } from "@/services/response"
import type {
  GiveawayWinner,
  SpinResponse,
  SpinStatusResponse,
  TriviaQuestion,
  TriviaSubmitPayload,
  TriviaSubmitResponse,
} from "./types"

const GIVEAWAY_BASE = "/api/giveaway"

export async function getSpinStatus() {
  const { data } = await apiClient.get<SpinStatusResponse | ApiEnvelope<SpinStatusResponse>>(
    `${GIVEAWAY_BASE}/spin/status`,
  )
  return unwrapData(data)
}

export async function spinWheel() {
  const { data } = await apiClient.post<SpinResponse | ApiEnvelope<SpinResponse>>(`${GIVEAWAY_BASE}/spin`)
  return unwrapData(data)
}

export async function getTriviaQuestion() {
  const { data } = await apiClient.get<TriviaQuestion | ApiEnvelope<TriviaQuestion>>(
    `${GIVEAWAY_BASE}/trivia/question`,
  )
  return unwrapData(data)
}

export async function submitTriviaAnswer(payload: TriviaSubmitPayload) {
  const { data } = await apiClient.post<TriviaSubmitResponse | ApiEnvelope<TriviaSubmitResponse>>(
    `${GIVEAWAY_BASE}/trivia/submit`,
    payload,
  )
  return unwrapData(data)
}

export async function getWinners() {
  const { data } = await apiClient.get<GiveawayWinner[] | ApiEnvelope<{ winners: GiveawayWinner[] }>>(
    `${GIVEAWAY_BASE}/winners`,
  )
  const unwrapped = Array.isArray(data) ? data : unwrapData(data)
  return Array.isArray(unwrapped) ? unwrapped : unwrapped.winners
}
