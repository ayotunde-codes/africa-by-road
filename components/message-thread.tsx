"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChatMessage, type Message } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MessageThreadProps {
  isOpen: boolean
  onClose: () => void
  parentMessage: Message
  currentUserId: string
  onSendReply: (messageId: string, content: string, attachments: any[]) => void
  onReact: (messageId: string, emoji: string) => void
}

export function MessageThread({
  isOpen,
  onClose,
  parentMessage,
  currentUserId,
  onSendReply,
  onReact,
}: MessageThreadProps) {
  const handleSendReply = (content: string, attachments: any[]) => {
    onSendReply(parentMessage.id, content, attachments)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 sm:max-h-[80vh]">
        <DialogHeader className="border-b p-4">
          <DialogTitle>Thread</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] px-4 py-2">
          <ChatMessage
            message={parentMessage}
            currentUserId={currentUserId}
            onReply={() => {}}
            onReact={onReact}
            onOpenThread={() => {}}
          />

          <div className="my-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-border"></div>
            <span className="text-xs text-muted-foreground">
              {parentMessage.thread?.length || 0} {parentMessage.thread?.length === 1 ? "reply" : "replies"}
            </span>
            <div className="h-px flex-1 bg-border"></div>
          </div>

          {parentMessage.thread?.map((reply) => (
            <ChatMessage
              key={reply.id}
              message={reply}
              currentUserId={currentUserId}
              onReply={() => {}}
              onReact={onReact}
              onOpenThread={() => {}}
              isThreadMessage
            />
          ))}
        </ScrollArea>
        <ChatInput onSendMessage={handleSendReply} />
      </DialogContent>
    </Dialog>
  )
}
