import { Suspense } from "react"
import { ResetPasswordForm } from "@/features/auth/password-reset/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A1B]" />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
