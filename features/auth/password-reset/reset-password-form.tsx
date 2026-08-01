"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { PasswordInput } from "@/components/password-input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { AuthPanel } from "@/features/auth/password-reset/auth-panel"
import { logDiagnostic } from "@/hooks/use-navigation-diagnostics"
import { getApiErrorMessage } from "@/services/errors"
import { useResetPasswordMutation, useValidateResetTokenQuery } from "@/services/auth/client"

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const { toast } = useToast()
  const resetPasswordMutation = useResetPasswordMutation()
  const tokenQuery = useValidateResetTokenQuery(token, Boolean(token))
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  useEffect(() => {
    logDiagnostic("[auth] reset token validation state", {
      hasToken: Boolean(token),
      status: tokenQuery.status,
    })
  }, [token, tokenQuery.status])

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    if (!token) {
      toast({ title: "Missing reset token", description: "Open the reset link from your email.", variant: "destructive" })
      return
    }

    try {
      await resetPasswordMutation.mutateAsync({ token, newPassword: values.password })
      toast({ title: "Password reset", description: "You can now log in with your new password." })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Reset failed",
        description: getApiErrorMessage(error, "We could not reset your password. Please try again."),
        variant: "destructive",
      })
    }
  }

  const isBlocked = !token || tokenQuery.isError

  return (
    <AuthPanel title="Reset password" description="Create a new password for your account.">
      {isBlocked ? (
        <div className="rounded-md border border-[#2A2A3E] bg-[#1A1A2E] p-4 text-center text-sm text-gray-300">
          This reset link is missing or expired. Request a new one from the forgot password page.
        </div>
      ) : null}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">New password</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} className="bg-[#1A1A2E] border-[#2A2A3E] text-white h-12" />
                </FormControl>
                <FormDescription className="text-gray-500">Must be at least 8 characters long.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Confirm new password</FormLabel>
                <FormControl>
                  <PasswordInput autoComplete="new-password" {...field} className="bg-[#1A1A2E] border-[#2A2A3E] text-white h-12" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-white" disabled={isBlocked || resetPasswordMutation.isPending}>
            {resetPasswordMutation.isPending ? "Resetting..." : "Reset password"}
          </Button>
        </form>
      </Form>
      <div className="text-center mt-8 text-gray-300">
        Need a new link?{" "}
        <Link href="/forgot-password" className="text-primary hover:underline">
          Request one
        </Link>
      </div>
    </AuthPanel>
  )
}
