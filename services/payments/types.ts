export interface CheckoutPayload {
  email: string
  phoneNumber: string
  amount?: number
  currency?: string
  country?: string
  [key: string]: unknown
}

export interface CheckoutResponse {
  message?: string
  authorizationUrl?: string
  reference?: string
  [key: string]: unknown
}

export interface VerifyPaymentPayload {
  reference: string
  [key: string]: unknown
}

export interface VerifyPaymentResponse {
  message?: string
  status?: string
  [key: string]: unknown
}

export interface PaymentKeyResponse {
  publicKey: string
}

export interface PaymentWebhookPayload {
  [key: string]: unknown
}
