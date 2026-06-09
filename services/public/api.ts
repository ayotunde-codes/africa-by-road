import { apiClient } from "@/services/http"
import { unwrapData, type ApiEnvelope } from "@/services/response"
import type { LandingPageContent, PaymentGatewayOptionsResponse } from "./types"

const PUBLIC_BASE = "/api/public"

export async function getLandingPage() {
  const { data } = await apiClient.get<LandingPageContent | ApiEnvelope<LandingPageContent>>(
    `${PUBLIC_BASE}/landing-page`,
  )
  return unwrapData(data)
}

export async function getPaymentGatewayOptions(country?: string) {
  const { data } = await apiClient.get<ApiEnvelope<PaymentGatewayOptionsResponse>>(
    `${PUBLIC_BASE}/payment-gateway-options`,
    {
    params: { country },
    },
  )
  return unwrapData(data)
}
