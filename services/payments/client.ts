"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { checkout, getPaymentKey, paymentWebhook, verifyPayment } from "./api"

export function useCheckoutMutation() {
  return useMutation({ mutationFn: checkout })
}

export function useVerifyPaymentMutation() {
  return useMutation({ mutationFn: verifyPayment })
}

export function usePaymentKeyQuery() {
  return useQuery({
    queryKey: ["payments", "key"],
    queryFn: getPaymentKey,
  })
}

export function usePaymentWebhookMutation() {
  return useMutation({ mutationFn: paymentWebhook })
}
