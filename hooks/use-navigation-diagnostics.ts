"use client"

import { useEffect, useRef } from "react"

const canLog = process.env.NODE_ENV !== "production"

export function useNavigationDiagnostics(scope: string, pathname: string) {
  const renderCount = useRef(0)
  const previousPathname = useRef(pathname)

  useEffect(() => {
    if (!canLog) {
      return
    }

    renderCount.current += 1
    logDiagnostic("[render]", {
      scope,
      pathname,
      renderCount: renderCount.current,
    })
  })

  useEffect(() => {
    if (!canLog) {
      return
    }

    if (previousPathname.current !== pathname) {
      logDiagnostic("[navigation] route settled", {
        from: previousPathname.current,
        to: pathname,
      })
      previousPathname.current = pathname
      return
    }

    logDiagnostic("[navigation] initial route", { scope, pathname })
  }, [pathname, scope])
}

export function logNavigationStart(source: string, href: string) {
  logDiagnostic("[navigation] route requested", {
    source,
    href,
    atMs: Math.round(performance.now()),
  })
}

export function logDiagnostic(message: string, details?: Record<string, unknown>) {
  if (!canLog) {
    return
  }

  console.debug(message, details)

  fetch("/api/dev-diagnostics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, details }),
    keepalive: true,
  }).catch(() => undefined)
}
