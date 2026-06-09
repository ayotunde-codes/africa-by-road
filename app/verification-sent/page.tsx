import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function VerificationSentPage() {
  return (
    <div className="container max-w-md mx-auto py-10">
      <Card className="bg-background/95 border-0">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Verification Email Sent</CardTitle>
          <CardDescription className="text-center">
            We've sent a verification code to your email address.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Please check your inbox and enter the verification code to complete your registration. If you don't see the
            email, check your spam folder.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link href="/verify-email">Enter Verification Code</Link>
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Didn't receive the email?{" "}
            <Link href="#" className="text-primary hover:underline">
              Resend verification email
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
