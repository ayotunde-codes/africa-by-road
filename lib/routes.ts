const PUBLIC_ROUTES = ["/", "/login", "/register", "/verification-sent", "/verify-email"]
const CHROMELESS_ROUTES = ["/login", "/register", "/verification-sent", "/verify-email"]

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`)
}

export function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => matchesRoute(pathname, route))
}

export function isChromelessRoute(pathname: string) {
  return CHROMELESS_ROUTES.some((route) => matchesRoute(pathname, route)) || matchesRoute(pathname, "/registration")
}

export function getSafeRedirectPath(redirectTo: string | null, fallback = "/dashboard") {
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return fallback
  }

  return redirectTo
}
