"use client"

import type { SubmitHandler, UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SOCIAL_FIELDS } from "./constants"
import type { SocialMediaValues } from "./types"

interface SocialMediaFormProps {
  form: UseFormReturn<SocialMediaValues>
  isLoading: boolean
  variant?: "mobile" | "desktop"
  onSubmit: SubmitHandler<SocialMediaValues>
}

export function SocialMediaForm({ form, isLoading, onSubmit, variant = "desktop" }: SocialMediaFormProps) {
  const isMobile = variant === "mobile"
  const inputClass = isMobile ? "bg-[#131326] border-0 h-12 text-white" : ""

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {SOCIAL_FIELDS.map((item) => (
          <FormField
            key={item.name}
            control={form.control}
            name={item.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? "text-white" : ""}>{item.label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={isMobile ? "Enter profile link" : item.placeholder}
                    {...field}
                    className={inputClass}
                  />
                </FormControl>
                {!isMobile && <FormDescription>Your {item.label} profile URL (optional)</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className={isMobile ? "" : "flex justify-end"}>
          <Button type="submit" disabled={isLoading} className={isMobile ? "w-full h-12 bg-primary hover:bg-primary/90 text-white" : ""}>
            {isLoading ? "Saving..." : isMobile ? "Save and continue" : "Save & Continue"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
