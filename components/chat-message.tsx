"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MessageReaction } from "@/components/message-reaction"
import { Smile, Reply, MoreHorizontal, Play } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

export interface Reaction {
  emoji: string
  count: number
  users: string[]
}

export interface Attachment {
  type: "image" | "video" | "audio" | "sticker" | "link"
  url: string
  thumbnail?: string
  name?: string
  duration?: number
}

export interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar: string
  }
  timestamp: Date
  reactions: Reaction[]
  attachments?: Attachment[]
  replyTo?: string
  thread?: Message[]
}

interface ChatMessageProps {
  message: Message
  currentUserId: string
  onReply: (messageId: string) => void
  onReact: (messageId: string, emoji: string) => void
  onOpenThread: (messageId: string) => void
  isThreadMessage?: boolean
}

export function ChatMessage({
  message,
  currentUserId,
  onReply,
  onReact,
  onOpenThread,
  isThreadMessage = false,
}: ChatMessageProps) {
  const [showActions, setShowActions] = useState(false)
  const [showReactionOptions, setShowReactionOptions] = useState(false)
  const isCurrentUser = message.sender.id === currentUserId
  const hasThread = message.thread && message.thread.length > 0
  const formattedTime = formatDistanceToNow(message.timestamp, { addSuffix: true })

  return (
    <div
      className={cn(
        "group relative mb-4 flex gap-3",
        isThreadMessage && "ml-8",
        isCurrentUser ? "flex-row-reverse" : "flex-row",
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.name} />
        <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className={cn("flex-1 space-y-1", isCurrentUser && "text-right")}>
        <div className={cn("flex items-center gap-2", isCurrentUser ? "flex-row-reverse ml-auto" : "")}>
          <span className="font-medium">{message.sender.name}</span>
          <span className="text-xs text-muted-foreground">{formattedTime}</span>
        </div>

        {message.replyTo && (
          <div className="ml-1 border-l-2 border-primary/30 pl-2 text-sm text-muted-foreground">
            <span className="italic">Replying to a message</span>
          </div>
        )}

        <div className="space-y-2">
          {message.content && (
            <p
              className={cn(
                "text-sm rounded-lg p-3 inline-block max-w-[85%]",
                isCurrentUser ? "bg-[#21C55E] text-white rounded-tr-none" : "bg-muted rounded-tl-none",
              )}
            >
              {message.content}
            </p>
          )}

          {message.attachments && message.attachments.length > 0 && (
            <div className={cn("space-y-2", isCurrentUser && "flex flex-col items-end")}>
              {message.attachments.map((attachment, index) => (
                <div key={index} className={cn(isCurrentUser && "flex justify-end")}>
                  {attachment.type === "image" && (
                    <img
                      src={attachment.url || "/placeholder.svg"}
                      alt={attachment.name || "Image"}
                      className="max-h-60 rounded-md object-cover"
                    />
                  )}
                  {attachment.type === "video" && (
                    <div className="relative max-h-60 overflow-hidden rounded-md">
                      <img
                        src={attachment.thumbnail || attachment.url}
                        alt={attachment.name || "Video"}
                        className="w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full bg-black/50 text-white">
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {attachment.type === "audio" && (
                    <div
                      className={cn(
                        "flex items-center gap-2 rounded-md p-2",
                        isCurrentUser ? "bg-[#21C55E] text-white" : "bg-muted",
                      )}
                    >
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Play className="h-4 w-4" />
                      </Button>
                      <div className="h-1 flex-1 rounded-full bg-muted-foreground/30">
                        <div className="h-full w-1/3 rounded-full bg-primary"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.floor(attachment.duration || 0) / 60}:{(attachment.duration || 0) % 60}
                      </span>
                    </div>
                  )}
                  {attachment.type === "sticker" && (
                    <img
                      src={attachment.url || "/placeholder.svg"}
                      alt="Sticker"
                      className="h-24 w-24 object-contain"
                    />
                  )}
                  {attachment.type === "link" && (
                    <Card className="overflow-hidden">
                      <div className="flex">
                        <div className="flex-1 p-3">
                          <h4 className="text-sm font-medium">{attachment.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">{attachment.url}</p>
                        </div>
                        {attachment.thumbnail && (
                          <div className="h-16 w-16">
                            <img
                              src={attachment.thumbnail || "/placeholder.svg"}
                              alt={attachment.name || "Link preview"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {message.reactions.length > 0 && (
          <div className={cn("flex flex-wrap gap-1 pt-1", isCurrentUser ? "justify-end" : "justify-start")}>
            {message.reactions.map((reaction, index) => (
              <MessageReaction
                key={index}
                emoji={reaction.emoji}
                count={reaction.count}
                isActive={reaction.users.includes(currentUserId)}
                onToggle={() => onReact(message.id, reaction.emoji)}
              />
            ))}
          </div>
        )}

        {hasThread && !isThreadMessage && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onOpenThread(message.id)}
          >
            {message.thread?.length} {message.thread?.length === 1 ? "reply" : "replies"}
          </Button>
        )}
      </div>

      {showActions && (
        <div
          className={cn(
            "absolute -top-3 flex items-center gap-1 rounded-md bg-background/80 p-1 backdrop-blur-sm",
            isCurrentUser ? "left-0" : "right-0",
          )}
        >
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation()
              setShowReactionOptions(!showReactionOptions)
            }}
          >
            <Smile className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onReply(message.id)}>
            <Reply className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      )}
      {showReactionOptions && (
        <div
          className={cn(
            "absolute -top-10 flex items-center gap-1 rounded-md bg-background/95 p-1 shadow-md backdrop-blur-sm z-10",
            isCurrentUser ? "left-0" : "right-0",
          )}
        >
          {["👍", "❤️", "😂", "😮", "😢", "👏"].map((emoji) => (
            <Button
              key={emoji}
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => {
                onReact(message.id, emoji)
                setShowReactionOptions(false)
              }}
            >
              {emoji}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
