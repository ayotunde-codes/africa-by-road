"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { PasswordInput } from "@/components/password-input"
import { useToast } from "@/components/ui/use-toast"
import { useLoginMutation } from "@/services/auth/client"
import { getApiErrorMessage } from "@/services/errors"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
  rememberMe: z.boolean().optional(),
})

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const loginMutation = useLoginMutation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      })

      toast({
        title: "Login successful!",
        description: "Welcome back to Africa by Road.",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Login failed",
        description: getApiErrorMessage(error, "Invalid email or password. Please try again."),
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A1B] relative overflow-hidden">
      {/* Decorative corner lines */}
      <div className="pointer-events-none absolute top-0 left-0 w-64 h-64">
        <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C0 110.457 89.5431 200 200 200" stroke="#16A349" strokeWidth="2" />
          <path d="M40 0C40 88.3656 111.634 160 200 160" stroke="#16A349" strokeWidth="2" />
          <path d="M80 0C80 66.2742 133.726 120 200 120" stroke="#16A349" strokeWidth="2" />
          <path d="M120 0C120 44.1828 155.817 80 200 80" stroke="#16A349" strokeWidth="2" />
          <path d="M160 0C160 22.0914 177.909 40 200 40" stroke="#16A349" strokeWidth="2" />
        </svg>
      </div>

      <div className="pointer-events-none absolute bottom-0 right-0 w-64 h-64 transform rotate-180">
        <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C0 110.457 89.5431 200 200 200" stroke="#16A349" strokeWidth="2" />
          <path d="M40 0C40 88.3656 111.634 160 200 160" stroke="#16A349" strokeWidth="2" />
          <path d="M80 0C80 66.2742 133.726 120 200 120" stroke="#16A349" strokeWidth="2" />
          <path d="M120 0C120 44.1828 155.817 80 200 80" stroke="#16A349" strokeWidth="2" />
          <path d="M160 0C160 22.0914 177.909 40 200 40" stroke="#16A349" strokeWidth="2" />
        </svg>
      </div>

      {/* Logo */}
      <div className="flex justify-center mt-16 mb-8">
        <div className="text-5xl font-bold">
          <span className="text-gray-400">A</span>
          <span className="text-primary">B</span>
          <span className="text-gray-400">R</span>
        </div>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Login</h1>
          <p className="text-gray-400">Welcome back to Africa by Road.</p>
        </div>

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
                      placeholder="name@email.com"
                      {...field}
                      className="bg-[#1A1A2E] border-[#2A2A3E] text-white h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="current-password"
                      placeholder="••••••••"
                      {...field}
                      className="bg-[#1A1A2E] border-[#2A2A3E] text-white h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-gray-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label htmlFor="rememberMe" className="text-sm font-medium text-gray-300 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                )}
              />
              <Link href="/forgot-password" className="text-sm text-white hover:text-primary">
                Forgot password
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-8 text-gray-300">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  )
}
