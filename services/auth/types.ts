export interface ApiMessageResponse {
  message: string
}

export interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role?: string
  isEmailVerified: boolean
}

export interface RegisterPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber: string
  nationality: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse extends ApiMessageResponse {
  token: string
  user: AuthUser
}

export interface VerifyOtpPayload {
  email: string
  otp: string
}

export type VerifyOtpResponse = AuthResponse

export interface EmailPayload {
  email: string
}

export interface GoogleVerifyPayload {
  idToken: string
}

export interface GoogleVerifyResponse extends ApiMessageResponse {
  data: {
    token: string
    user: AuthUser
  }
}

export interface ResetPasswordPayload {
  token: string
  newPassword: string
}
