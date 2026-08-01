"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { MobileHeader } from "@/components/mobile-header"
import { useMediaQuery } from "@/hooks/use-media-query"
import { usePathname } from "next/navigation"
import { AuthRouteGuard } from "@/components/auth-route-guard"
import { isChromelessRoute } from "@/lib/routes"
import { useNavigationDiagnostics } from "@/hooks/use-navigation-diagnostics"

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const pathname = usePathname()
  const isMobile = !isDesktop
  useNavigationDiagnostics("AppLayoutWrapper", pathname)

  const isChromeless = isChromelessRoute(pathname)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="flex h-screen overflow-hidden">{children}</div>
  }

  // Only show sidebar on desktop and non-public routes
  const showSidebar = isDesktop && !isChromeless

  // Don't add padding for the dashboard page on mobile since it has its own header
  const needsMobileHeaderPadding = isMobile && !isChromeless && pathname !== "/dashboard"

  return (
    <AuthRouteGuard>
      <div className="flex h-screen overflow-hidden">
        {showSidebar && <Sidebar />}
        <main className="flex-1 overflow-auto">
          <MobileHeader />
          {needsMobileHeaderPadding && <div className="pt-14" />} {/* Padding for mobile header */}
          {children}
          <MobileNav />
        </main>
      </div>
    </AuthRouteGuard>
  )
}
