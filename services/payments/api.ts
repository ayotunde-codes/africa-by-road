import { apiClient } from "@/services/http"
import { unwrapData, type ApiEnvelope } from "@/services/response"
import type {
  CheckoutPayload,
  CheckoutResponse,
  PaymentKeyResponse,
  PaymentWebhookPayload,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "./types"

const PAYMENTS_BASE = "/api/payments"

export async function checkout(payload: CheckoutPayload) {
  const { data } = await apiClient.post<CheckoutResponse>(`${PAYMENTS_BASE}/checkout`, payload)
  return data
}

export async function verifyPayment(payload: VerifyPaymentPayload) {
  const { data } = await apiClient.post<VerifyPaymentResponse>(`${PAYMENTS_BASE}/verify`, payload)
  return data
}

export async function getPaymentKey() {
  const { data } = await apiClient.get<PaymentKeyResponse | ApiEnvelope<PaymentKeyResponse>>(`${PAYMENTS_BASE}/key`)
  return unwrapData(data)
}

export async function paymentWebhook(payload: PaymentWebhookPayload) {
  const { data } = await apiClient.post<VerifyPaymentResponse>(`${PAYMENTS_BASE}/webhook`, payload)
  return data
}
