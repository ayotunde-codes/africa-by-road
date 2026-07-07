"use client"

import { Button } from "@/components/ui/button"

interface PaymentStepProps {
  variant?: "mobile" | "desktop"
  onContinue: () => void
}

export function PaymentStep({ onContinue, variant = "desktop" }: PaymentStepProps) {
  const isMobile = variant === "mobile"

  return (
    <div className={isMobile ? "px-4 pb-6" : "space-y-6"}>
      <div className={isMobile ? "bg-[#131326] rounded-lg p-6 mb-6" : "bg-primary/10 rounded-lg p-6"}>
        <h3 className={isMobile ? "text-xl font-bold mb-2" : "text-lg font-bold mb-2"}>Registration Fee</h3>
        <p className={isMobile ? "text-gray-400 mb-4" : "text-muted-foreground mb-4"}>
          You can continue registration without completing payment here.
        </p>
        <div className={isMobile ? "text-3xl font-bold mb-4" : "flex justify-between items-center"}>
          <span className={isMobile ? "" : "text-2xl font-bold"}>$50.00 USD</span>
        </div>
      </div>

      <div className={isMobile ? "" : "flex justify-end"}>
        <Button onClick={onContinue} className={isMobile ? "w-full h-12 bg-primary hover:bg-primary/90 text-white" : ""}>
          Continue
        </Button>
      </div>
    </div>
  )
}
