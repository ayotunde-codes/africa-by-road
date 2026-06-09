"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/services/query-keys"
import { getMessages, getReplies, postMessage, postReply, toggleMessageLike, toggleReplyLike } from "./api"

export function useMessagesQuery(q?: string) {
  return useQuery({
    queryKey: queryKeys.community.messages(q),
    queryFn: () => getMessages({ q }),
  })
}

export function usePostMessageMutation(q?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postMessage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.community.messages(q) }),
  })
}

export function useToggleMessageLikeMutation(q?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleMessageLike,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.community.messages(q) }),
  })
}

export function useRepliesQuery(messageId: string, enabled = Boolean(messageId)) {
  return useQuery({
    queryKey: queryKeys.community.replies(messageId),
    queryFn: () => getReplies(messageId),
    enabled,
  })
}

export function usePostReplyMutation(messageId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Parameters<typeof postReply>[1]) => postReply(messageId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.community.replies(messageId) }),
  })
}

export function useToggleReplyLikeMutation(messageId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleReplyLike,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.community.replies(messageId) }),
  })
}
