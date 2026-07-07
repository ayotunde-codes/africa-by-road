"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { SubmitHandler, UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { COUNTRY_OPTIONS } from "./constants"
import type { PersonalInfoValues } from "./types"

interface PersonalInfoFormProps {
  form: UseFormReturn<PersonalInfoValues>
  isLoading: boolean
  variant?: "mobile" | "desktop"
  onSubmit: SubmitHandler<PersonalInfoValues>
}

const desktopNameFields = [
  { name: "firstName", label: "First Name", placeholder: "John" },
  { name: "middleName", label: "Middle Name (Optional)", placeholder: "David" },
  { name: "lastName", label: "Last Name", placeholder: "Doe" },
] as const

const mobileNameFields = [
  { name: "firstName", label: "First name", placeholder: "Enter first name" },
  { name: "lastName", label: "Last name", placeholder: "Enter last name" },
] as const

const addressFields = [
  { name: "state", label: "State/Province", placeholder: "State or Province" },
  { name: "city", label: "City", placeholder: "City" },
  { name: "address", label: "Residential Address", placeholder: "123 Main St" },
] as const

export function PersonalInfoForm({ form, isLoading, onSubmit, variant = "desktop" }: PersonalInfoFormProps) {
  const isMobile = variant === "mobile"
  const inputClass = isMobile ? "bg-[#131326] border-0 h-12 text-white" : ""
  const labelClass = isMobile ? "text-white" : ""
  const nameFields = isMobile ? mobileNameFields : desktopNameFields

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className={isMobile ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 md:grid-cols-3 gap-6"}>
          {nameFields.map((item) => (
            <FormField
              key={item.name}
              control={form.control}
              name={item.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>{item.label}</FormLabel>
                  <FormControl>
                    <Input placeholder={item.placeholder} {...field} className={inputClass} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className={labelClass}>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={`w-full pl-3 text-left font-normal ${isMobile ? inputClass : ""} ${
                        !field.value && (isMobile ? "text-gray-400" : "text-muted-foreground")
                      }`}
                    >
                      {field.value ? format(field.value, "PPP") : <span>{isMobile ? "Select DOB" : "Pick a date"}</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className={isMobile ? "w-auto p-0 bg-[#1E1E3F]" : "w-auto p-0"} align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                    className={isMobile ? "bg-[#1E1E3F] text-white" : ""}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isMobile && <Separator />}
        <div className={isMobile ? "space-y-6" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Country</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder={isMobile ? "Select country" : "Select a country"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className={isMobile ? "bg-[#1E1E3F] text-white border-0" : ""}>
                    {COUNTRY_OPTIONS.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {addressFields.map((item) => (
            <FormField
              key={item.name}
              control={form.control}
              name={item.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>{item.label}</FormLabel>
                  <FormControl>
                    <Input placeholder={isMobile && item.name === "address" ? "123 Main" : item.placeholder} {...field} className={inputClass} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className={isMobile ? "" : "flex justify-end"}>
          <Button type="submit" disabled={isLoading} className={isMobile ? "w-full h-12 bg-primary hover:bg-primary/90 text-white" : ""}>
            {isLoading ? "Saving..." : isMobile ? "Save and continue" : "Save & Continue"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
