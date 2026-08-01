"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/services/query-keys"
import {
  forgotPassword,
  getSession,
  login,
  logout,
  register,
  resendVerification,
  resetPassword,
  validateResetToken,
  verifyEmailOtp,
  verifyGoogle,
} from "./api"

export function useRegisterMutation() {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: register, onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.session }) })
}

export function useLoginMutation() {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: login, onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.session }) })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: logout, onSuccess: () => queryClient.removeQueries({ queryKey: queryKeys.auth.session }) })
}

export function useSessionQuery(enabled = true) {
  return useQuery({ queryKey: queryKeys.auth.session, queryFn: getSession, enabled, retry: false, staleTime: 30_000 })
}

export function useVerifyEmailOtpMutation() {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: verifyEmailOtp, onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.session }) })
}

export function useResendVerificationMutation() {
  return useMutation({ mutationFn: resendVerification })
}

export function useVerifyGoogleMutation() {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: verifyGoogle, onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.session }) })
}

export function useForgotPasswordMutation() {
  return useMutation({ mutationFn: forgotPassword })
}

export function useValidateResetTokenQuery(token: string, enabled = Boolean(token)) {
  return useQuery({
    queryKey: queryKeys.auth.resetToken(token),
    queryFn: () => validateResetToken(token),
    enabled,
  })
}

export function useResetPasswordMutation() {
  return useMutation({ mutationFn: resetPassword })
}
