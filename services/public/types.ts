export interface LandingPageContent {
  hero?: unknown
  sections?: unknown[]
  [key: string]: unknown
}

export interface PaymentGatewayOption {
  id?: string
  displayName?: string
  name?: string
  code?: string
  country?: string
  [key: string]: unknown
}

export interface PaymentGatewayOptionsResponse {
  country: string
  currency: string
  gateways: PaymentGatewayOption[]
  preferred?: string
}
