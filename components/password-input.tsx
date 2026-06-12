"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type">

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({ className, disabled, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const label = isVisible ? "Hide password" : "Show password"

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={isVisible ? "text" : "password"}
        disabled={disabled}
        className={cn("pr-12", className)}
        {...props}
      />
      <button
        type="button"
        aria-label={label}
        aria-pressed={isVisible}
        disabled={disabled}
        onClick={() => setIsVisible((current) => !current)}
        className="absolute inset-y-0 right-0 flex h-full w-12 items-center justify-center rounded-r-md text-gray-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        {isVisible ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
      </button>
    </div>
  )
})
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
