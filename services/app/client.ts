"use client"

import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/services/query-keys"
import { getDashboard } from "./api"

export function useDashboardQuery() {
  return useQuery({
    queryKey: queryKeys.app.dashboard,
    queryFn: getDashboard,
  })
}
