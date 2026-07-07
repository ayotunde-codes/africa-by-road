"use client"

import { useMediaQuery } from "@/hooks/use-media-query"
import { DesktopRegistrationView } from "@/features/registration/continue/desktop-registration-view"
import { MobileRegistrationView } from "@/features/registration/continue/mobile-registration-view"
import { useContinueRegistration } from "@/features/registration/continue/use-continue-registration"

export default function ContinueRegistrationPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const controller = useContinueRegistration()

  if (isMobile) {
    return <MobileRegistrationView controller={controller} />
  }

  return <DesktopRegistrationView controller={controller} />
}
