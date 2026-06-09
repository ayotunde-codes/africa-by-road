"use client"

import type React from "react"

import { useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Smile, Paperclip, Mic, Send, X, FileText, Sticker, Play } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ChatInputProps {
  onSendMessage: (content: string, attachments: any[]) => void
  onCancelReply?: () => void
  replyingTo?: {
    id: string
    sender: string
    preview: string
  }
}

const EMOJI_GRID = [
  ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇"],
  ["🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚"],
  ["😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩"],
  ["🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣"],
  ["👍", "👎", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "💪", "❤️"],
]

const STICKER_GRID: string[][] = []

export function ChatInput({ onSendMessage, replyingTo, onCancelReply }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [attachments, setAttachments] = useState<any[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isCommunityPage = pathname === "/community"

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments)
      setMessage("")
      setAttachments([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji)
  }

  const handleStickerSelect = (url: string) => {
    const sticker = {
      type: "sticker",
      url,
    }
    onSendMessage("", [sticker])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newAttachments = Array.from(files).map((file) => {
      const type = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file"

      return {
        type,
        name: file.name,
        url: URL.createObjectURL(file),
        file,
      }
    })

    setAttachments((prev) => [...prev, ...newAttachments])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const startRecording = () => {
    setIsRecording(true)
    let intervalId: NodeJS.Timeout
    // In a real app, we would start recording audio here
    const interval = () => {
      intervalId = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
    interval()

    // Store the interval ID to clear it later
    return () => clearInterval(intervalId)
  }

  const stopRecording = () => {
    setIsRecording(false)
    // In a real app, we would stop recording and add the audio file to attachments
    const audioAttachment = {
      type: "audio",
      url: "#",
      duration: recordingTime,
    }
    setAttachments((prev) => [...prev, audioAttachment])
    setRecordingTime(0)
  }

  return (
    <div className={`border-t bg-background p-4 ${isCommunityPage && isMobile ? "pb-20" : ""}`}>
      {replyingTo && (
        <div className="mb-2 flex items-center justify-between rounded-md bg-muted p-2">
          <div className="flex-1">
            <p className="text-xs font-medium">
              Replying to <span className="text-primary">{replyingTo.sender}</span>
            </p>
            <p className="text-xs text-muted-foreground line-clamp-1">{replyingTo.preview}</p>
          </div>
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onCancelReply}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap justify-end gap-2">
          {attachments.map((attachment, index) => (
            <div key={index} className="relative rounded-md bg-muted p-1">
              {attachment.type === "image" && (
                <img
                  src={attachment.url || "/placeholder.svg"}
                  alt=""
                  className="h-16 w-16 rounded object-cover"
                />
              )}
              {attachment.type === "video" && (
                <div className="relative h-16 w-16">
                  <video src={attachment.url} className="h-full w-full rounded object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                </div>
              )}
              {attachment.type === "audio" && (
                <div className="flex h-8 w-32 items-center gap-1 rounded-md bg-background p-1">
                  <Mic className="h-4 w-4 text-primary" />
                  <div className="text-xs">
                    {Math.floor(attachment.duration / 60)}:{(attachment.duration % 60).toString().padStart(2, "0")}
                  </div>
                </div>
              )}
              {attachment.type === "file" && (
                <div className="flex h-8 w-32 items-center gap-1 rounded-md bg-background p-1">
                  <FileText className="h-4 w-4" />
                  <div className="text-xs truncate">{attachment.name}</div>
                </div>
              )}
              <Button
                size="icon"
                variant="secondary"
                className="absolute -right-2 -top-2 h-5 w-5 rounded-full"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                <Smile className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start" alignOffset={-40}>
              <div className="grid gap-1">
                {EMOJI_GRID.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-1">
                    {row.map((emoji, emojiIndex) => (
                      <Button
                        key={emojiIndex}
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEmojiSelect(emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                <Sticker className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start" alignOffset={-40}>
              <div className="grid gap-2">
                {STICKER_GRID.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2">
                    {row.map((sticker, stickerIndex) => (
                      <Button
                        key={stickerIndex}
                        variant="ghost"
                        className="h-16 w-16 p-0"
                        onClick={() => handleStickerSelect(sticker)}
                      >
                        <img
                          src={sticker || "/placeholder.svg"}
                          alt="Sticker"
                          className="h-full w-full object-contain"
                        />
                      </Button>
                    ))}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
          />
          <Button size="icon" variant="ghost" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="h-5 w-5" />
          </Button>
        </div>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-10 flex-1 resize-none"
        />

        <div>
          {message.trim() || attachments.length > 0 ? (
            <Button size="icon" onClick={handleSend}>
              <Send className="h-5 w-5" />
            </Button>
          ) : isRecording ? (
            <Button size="icon" variant="destructive" onClick={stopRecording}>
              <div className="flex items-center gap-1">
                <span className="text-xs">
                  {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}
                </span>
                <X className="h-4 w-4" />
              </div>
            </Button>
          ) : (
            <Button size="icon" variant="ghost" onClick={startRecording}>
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
