"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/services/query-keys"
import {
  getProfile,
  getRegistrationStatus,
  updatePersonalInfo,
  updateSocialProfile,
  uploadDocument,
} from "./api"

export function useProfileQuery() {
  return useQuery({
    queryKey: queryKeys.profile.detail,
    queryFn: getProfile,
  })
}

export function useUpdatePersonalInfoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePersonalInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.detail })
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.status })
    },
  })
}

export function useUpdateSocialProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSocialProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.detail })
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.status })
    },
  })
}

export function useUploadDocumentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.detail })
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.status })
    },
  })
}

export function useRegistrationStatusQuery() {
  return useQuery({
    queryKey: queryKeys.profile.status,
    queryFn: getRegistrationStatus,
  })
}
