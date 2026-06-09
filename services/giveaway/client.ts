"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/services/query-keys"
import { getSpinStatus, getTriviaQuestion, getWinners, spinWheel, submitTriviaAnswer } from "./api"

export function useSpinStatusQuery() {
  return useQuery({
    queryKey: queryKeys.giveaway.spinStatus,
    queryFn: getSpinStatus,
  })
}

export function useSpinWheelMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: spinWheel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.giveaway.spinStatus }),
  })
}

export function useTriviaQuestionQuery() {
  return useQuery({
    queryKey: queryKeys.giveaway.triviaQuestion,
    queryFn: getTriviaQuestion,
  })
}

export function useSubmitTriviaAnswerMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitTriviaAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.giveaway.spinStatus })
      queryClient.invalidateQueries({ queryKey: queryKeys.giveaway.triviaQuestion })
    },
  })
}

export function useWinnersQuery() {
  return useQuery({
    queryKey: queryKeys.giveaway.winners,
    queryFn: getWinners,
  })
}
