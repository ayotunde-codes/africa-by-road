"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { MobileHeader } from "@/components/mobile-header"
import { useMediaQuery } from "@/hooks/use-media-query"
import { usePathname } from "next/navigation"

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const pathname = usePathname()
  const isMobile = !isDesktop

  // Public routes that don't need the sidebar
  const publicRoutes = ["/login", "/register", "/verification-sent", "/verify-email"]
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/registration")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="flex h-screen overflow-hidden">{children}</div>
  }

  // Only show sidebar on desktop and non-public routes
  const showSidebar = isDesktop && !isPublicRoute

  // Don't add padding for the dashboard page on mobile since it has its own header
  const needsMobileHeaderPadding = isMobile && !isPublicRoute && pathname !== "/dashboard"

  return (
    <div className="flex h-screen overflow-hidden">
      {showSidebar && <Sidebar />}
      <main className="flex-1 overflow-auto">
        <MobileHeader />
        {needsMobileHeaderPadding && <div className="pt-14" />} {/* Padding for mobile header */}
        {children}
        <MobileNav />
      </main>
    </div>
  )
}
