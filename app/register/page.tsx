"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useRegisterMutation } from "@/services/auth/client"
import { getApiErrorMessage } from "@/services/errors"

const formSchema = z
  .object({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    phoneNumber: z.string().min(7, {
      message: "Phone number is required.",
    }),
    nationality: z.string().min(2, {
      message: "Nationality is required.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const registerMutation = useRegisterMutation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      nationality: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await registerMutation.mutateAsync({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        nationality: values.nationality,
      })

      toast({
        title: "Registration initiated!",
        description: "Enter the verification code sent to your email.",
      })

      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`)
    } catch (error) {
      toast({
        title: "Registration failed",
        description: getApiErrorMessage(error, "There was a problem with your registration. Please try again."),
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A1B] relative overflow-hidden">
      {/* Decorative corner lines */}
      <div className="absolute top-0 left-0 w-64 h-64">
        <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C0 110.457 89.5431 200 200 200" stroke="#16A349" strokeWidth="2" />
          <path d="M40 0C40 88.3656 111.634 160 200 160" stroke="#16A349" strokeWidth="2" />
          <path d="M80 0C80 66.2742 133.726 120 200 120" stroke="#16A349" strokeWidth="2" />
          <path d="M120 0C120 44.1828 155.817 80 200 80" stroke="#16A349" strokeWidth="2" />
          <path d="M160 0C160 22.0914 177.909 40 200 40" stroke="#16A349" strokeWidth="2" />
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 w-64 h-64 transform rotate-180">
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

      {/* Register Form */}
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create an account</h1>
          <p className="text-gray-400">Join the Africa by Road community today.</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">First name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-[#1A1A2E] border-[#2A2A3E] text-white h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Last name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-[#1A1A2E] border-[#2A2A3E] text-white h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Phone number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+2348012345678"
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
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Nationality</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nigeria"
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
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="bg-[#1A1A2E] border-[#2A2A3E] text-white h-12"
                    />
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
                  <FormLabel className="text-white">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
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
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creating account..." : "Register"}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-8 text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  )
}
