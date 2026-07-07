"use client"

import { Bell, ChevronLeft, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileRegistrationHeaderProps {
  onBack: () => void
}

export function MobileRegistrationHeader({ onBack }: MobileRegistrationHeaderProps) {
  return (
    <>
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white" onClick={onBack}>
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Back to Dashboard</span>
          </Button>
          <div className="text-3xl font-bold">
            <span className="text-gray-400">A</span>
            <span className="text-primary">B</span>
            <span className="text-gray-400">R</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-white" type="button" aria-label="Open profile">
            <User className="h-6 w-6" />
          </button>
          <button className="text-white" type="button" aria-label="Open notifications">
            <Bell className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="px-4 mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Complete your registration</h1>
        <p className="text-gray-400 text-sm">
          Please provide the following information to complete your registration.
        </p>
      </div>
    </>
  )
}
