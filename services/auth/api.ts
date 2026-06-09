import { apiClient, clearAuthToken, setAuthToken } from "@/services/http"
import type {
  ApiMessageResponse,
  AuthResponse,
  EmailPayload,
  GoogleVerifyPayload,
  GoogleVerifyResponse,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "./types"

const AUTH_BASE = "/api/auth"

export async function register(payload: RegisterPayload) {
  const { data } = await apiClient.post<AuthResponse>(`${AUTH_BASE}/register`, payload)
  setAuthToken(data.token)
  return data
}

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<AuthResponse>(`${AUTH_BASE}/login`, payload)
  setAuthToken(data.token)
  return data
}

export async function logout() {
  const { data } = await apiClient.post<ApiMessageResponse>(`${AUTH_BASE}/logout`)
  clearAuthToken()
  return data
}

export async function verifyEmailOtp(payload: VerifyOtpPayload) {
  const { data } = await apiClient.post<VerifyOtpResponse>(`${AUTH_BASE}/verify-email/confirm-otp`, payload)
  return data
}

export async function resendVerification(payload: EmailPayload) {
  const { data } = await apiClient.post<ApiMessageResponse>(`${AUTH_BASE}/resend-verification`, payload)
  return data
}

export async function verifyGoogle(payload: GoogleVerifyPayload) {
  const { data } = await apiClient.post<GoogleVerifyResponse>(`${AUTH_BASE}/google/verify`, payload)
  setAuthToken(data.data.token)
  return data
}

export async function forgotPassword(payload: EmailPayload) {
  const { data } = await apiClient.post<ApiMessageResponse>(`${AUTH_BASE}/forgot-password`, payload)
  return data
}

export async function validateResetToken(token: string) {
  const { data } = await apiClient.get<ApiMessageResponse>(`${AUTH_BASE}/reset-password`, {
    params: { token },
  })
  return data
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const { data } = await apiClient.post<ApiMessageResponse>(`${AUTH_BASE}/reset-password`, payload)
  return data
}
