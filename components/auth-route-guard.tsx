"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AUTH_TOKEN_KEY } from "@/services/http"
import { isPublicRoute } from "@/lib/routes"

export function AuthRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [authorizedPathname, setAuthorizedPathname] = useState<string | null>(null)
  const isPublic = isPublicRoute(pathname)

  useEffect(() => {
    if (isPublic) {
      setAuthorizedPathname(pathname)
      return
    }

    const token = window.localStorage.getItem(AUTH_TOKEN_KEY)

    if (!token) {
      const redirectTo = `${window.location.pathname}${window.location.search}`
      setAuthorizedPathname(null)
      router.replace(`/login?redirectTo=${encodeURIComponent(redirectTo)}`)
      return
    }

    setAuthorizedPathname(pathname)
  }, [isPublic, pathname, router])

  if (!isPublic && authorizedPathname !== pathname) {
    return <div className="min-h-screen bg-[#0A0A1B]" />
  }

  return <>{children}</>
}
