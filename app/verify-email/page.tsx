"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CheckCircle, MailCheck, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useResendVerificationMutation, useVerifyEmailOtpMutation } from "@/services/auth/client"
import { getApiErrorMessage } from "@/services/errors"

const otpSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  otp: z.string().min(4, { message: "Enter the verification code." }),
})

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const verifyMutation = useVerifyEmailOtpMutation()
  const resendMutation = useResendVerificationMutation()

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
      otp: "",
    },
  })

  async function onSubmit(values: z.infer<typeof otpSchema>) {
    try {
      await verifyMutation.mutateAsync(values)
      toast({
        title: "Email verified",
        description: "Your email has been verified. Please log in to continue.",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Verification failed",
        description: getApiErrorMessage(error, "Invalid or expired verification code."),
        variant: "destructive",
      })
    }
  }

  async function handleResend() {
    const email = form.getValues("email")
    const parsed = z.string().email().safeParse(email)

    if (!parsed.success) {
      form.setError("email", { message: "Enter your email before resending the code." })
      return
    }

    try {
      await resendMutation.mutateAsync({ email })
      toast({
        title: "Code resent",
        description: "A fresh verification code has been sent to your email.",
      })
    } catch (error) {
      toast({
        title: "Could not resend code",
        description: getApiErrorMessage(error, "Please try again."),
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card className="bg-background/95 border-0">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {verifyMutation.isSuccess ? (
              <CheckCircle className="h-16 w-16 text-primary" />
            ) : verifyMutation.isError ? (
              <XCircle className="h-16 w-16 text-destructive" />
            ) : verifyMutation.isPending ? (
              <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            ) : (
              <MailCheck className="h-16 w-16 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">
            Enter the verification code sent to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="name@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification code</FormLabel>
                    <FormControl>
                      <Input placeholder="482916" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={verifyMutation.isPending}>
                {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button variant="ghost" className="w-full" onClick={handleResend} disabled={resendMutation.isPending}>
            {resendMutation.isPending ? "Resending..." : "Resend verification code"}
          </Button>
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
            Return to Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
