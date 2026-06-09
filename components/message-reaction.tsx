"use client"
import { cn } from "@/lib/utils"

interface MessageReactionProps {
  emoji: string
  count: number
  isActive?: boolean
  onToggle?: () => void
}

export function MessageReaction({ emoji, count, isActive = false, onToggle }: MessageReactionProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs transition-colors",
        isActive
          ? "border-primary bg-primary/10 text-primary"
          : "border-muted-foreground/20 bg-background hover:bg-muted",
      )}
    >
      <span className="mr-1">{emoji}</span>
      <span>{count}</span>
    </button>
  )
}
