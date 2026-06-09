"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/services/query-keys"
import { getContestants, getLeaderboard, voteFavorite } from "./api"

export function useContestantsQuery() {
  return useQuery({
    queryKey: queryKeys.vote.contestants,
    queryFn: getContestants,
  })
}

export function useLeaderboardQuery() {
  return useQuery({
    queryKey: queryKeys.vote.leaderboard,
    queryFn: getLeaderboard,
  })
}

export function useVoteFavoriteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: voteFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vote.contestants })
      queryClient.invalidateQueries({ queryKey: queryKeys.vote.leaderboard })
    },
  })
}
