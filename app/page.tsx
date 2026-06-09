"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page when the root page is accessed
    router.replace("/login")
  }, [router])

  // Return null or a loading indicator while redirecting
  return null
}
