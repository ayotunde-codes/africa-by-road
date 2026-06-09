import { apiClient } from "@/services/http"
import { unwrapData, type ApiEnvelope } from "@/services/response"
import type {
  CommunityMessage,
  CommunityReply,
  CreateMessagePayload,
  CreateReplyPayload,
  LikeResponse,
  ListMessagesParams,
} from "./types"

const COMMUNITY_BASE = "/api/community"

export async function getMessages(params?: ListMessagesParams) {
  const path = params?.q ? `${COMMUNITY_BASE}/messages/search` : `${COMMUNITY_BASE}/messages`
  const { data } = await apiClient.get<CommunityMessage[] | ApiEnvelope<CommunityMessage[]>>(path, { params })
  return unwrapData(data)
}

export async function postMessage(payload: CreateMessagePayload) {
  const { data } = await apiClient.post<CommunityMessage | ApiEnvelope<CommunityMessage>>(
    `${COMMUNITY_BASE}/messages`,
    payload,
  )
  return unwrapData(data)
}

export async function toggleMessageLike(messageId: string) {
  const { data } = await apiClient.post<LikeResponse>(`${COMMUNITY_BASE}/messages/${messageId}/like`)
  return data
}

export async function getReplies(messageId: string) {
  const { data } = await apiClient.get<CommunityReply[] | ApiEnvelope<CommunityReply[]>>(
    `${COMMUNITY_BASE}/messages/${messageId}/replies`,
  )
  return unwrapData(data)
}

export async function postReply(messageId: string, payload: CreateReplyPayload) {
  const { data } = await apiClient.post<CommunityReply>(`${COMMUNITY_BASE}/messages/${messageId}/replies`, payload)
  return data
}

export async function toggleReplyLike(replyId: string) {
  const { data } = await apiClient.post<LikeResponse>(`${COMMUNITY_BASE}/replies/${replyId}/like`)
  return data
}
