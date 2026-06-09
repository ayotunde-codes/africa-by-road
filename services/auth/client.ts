"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/services/query-keys"
import {
  forgotPassword,
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
  return useMutation({ mutationFn: register })
}

export function useLoginMutation() {
  return useMutation({ mutationFn: login })
}

export function useLogoutMutation() {
  return useMutation({ mutationFn: logout })
}

export function useVerifyEmailOtpMutation() {
  return useMutation({ mutationFn: verifyEmailOtp })
}

export function useResendVerificationMutation() {
  return useMutation({ mutationFn: resendVerification })
}

export function useVerifyGoogleMutation() {
  return useMutation({ mutationFn: verifyGoogle })
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
