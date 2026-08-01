"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSessionQuery } from "@/services/auth/client"
import { isPublicRoute } from "@/lib/routes"
import { logDiagnostic } from "@/hooks/use-navigation-diagnostics"

export function AuthRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [authorizedPathname, setAuthorizedPathname] = useState<string | null>(null)
  const isPublic = isPublicRoute(pathname)
  const sessionQuery = useSessionQuery(!isPublic)

  useEffect(() => {
    logDiagnostic("[auth-guard] checking route", { pathname, isPublic })

    if (isPublic) {
      setAuthorizedPathname(pathname)
      logDiagnostic("[auth-guard] public route allowed", { pathname })
      return
    }

    if (sessionQuery.isError) {
      const redirectTo = `${window.location.pathname}${window.location.search}`
      setAuthorizedPathname(null)
      logDiagnostic("[auth-guard] no session, redirecting", { pathname, redirectTo })
      router.replace(`/login?redirectTo=${encodeURIComponent(redirectTo)}`)
      return
    }

    if (sessionQuery.isSuccess) {
      setAuthorizedPathname(pathname)
      logDiagnostic("[auth-guard] protected route allowed", { pathname })
    }
  }, [isPublic, pathname, router, sessionQuery.isError, sessionQuery.isSuccess])

  if (!isPublic && authorizedPathname !== pathname) {
    return <div className="min-h-screen bg-[#0A0A1B]" />
  }

  return <>{children}</>
}
