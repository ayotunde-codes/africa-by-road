"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { AuthPanel } from "@/features/auth/password-reset/auth-panel"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { logDiagnostic } from "@/hooks/use-navigation-diagnostics"
import { getApiErrorMessage } from "@/services/errors"
import { useForgotPasswordMutation } from "@/services/auth/client"

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

export function ForgotPasswordForm() {
  const { toast } = useToast()
  const forgotPasswordMutation = useForgotPasswordMutation()
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    logDiagnostic("[auth] forgot password request started")
    try {
      await forgotPasswordMutation.mutateAsync(values)
      toast({
        title: "Reset link sent",
        description: "Check your email for the password reset link.",
      })
      logDiagnostic("[auth] forgot password request completed")
    } catch (error) {
      toast({
        title: "Reset request failed",
        description: getApiErrorMessage(error, "We could not send a reset link. Please try again."),
        variant: "destructive",
      })
      logDiagnostic("[auth] forgot password request failed")
    }
  }

  return (
    <AuthPanel title="Forgot password" description="Enter your email and we will send reset instructions.">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Email address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="name@email.com"
                    {...field}
                    className="bg-[#1A1A2E] border-[#2A2A3E] text-white h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </Form>
      <div className="text-center mt-8 text-gray-300">
        Remembered it?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      </div>
    </AuthPanel>
  )
}
