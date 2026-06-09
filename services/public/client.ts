"use client"

import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/services/query-keys"
import { getLandingPage, getPaymentGatewayOptions } from "./api"

export function useLandingPageQuery() {
  return useQuery({
    queryKey: queryKeys.public.landingPage,
    queryFn: getLandingPage,
  })
}

export function usePaymentGatewayOptionsQuery(country?: string) {
  return useQuery({
    queryKey: queryKeys.public.paymentGatewayOptions(country),
    queryFn: () => getPaymentGatewayOptions(country),
  })
}
