"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage, type Message } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { Search, Users, Bell, Info, Hash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"
import { MessageThread } from "@/components/message-thread"
import { getApiErrorMessage } from "@/services/errors"
import { useMessagesQuery, usePostMessageMutation, usePostReplyMutation, useToggleMessageLikeMutation } from "@/services/community/client"
import type { CommunityMessage } from "@/services/community/types"

const currentUserId = "current-user"

function mapApiMessage(message: CommunityMessage): Message {
  const sender = message.sender ?? message.author
  const senderName =
    sender?.name ||
    [sender?.firstName, sender?.lastName].filter(Boolean).join(" ") ||
    sender?.email ||
    "Community Member"

  return {
    id: message.id ?? message._id ?? uuidv4(),
    content: message.content,
    sender: {
      id: sender?.id ?? sender?._id ?? "unknown",
      name: senderName,
      avatar: sender?.avatar ?? "/placeholder.svg",
    },
    timestamp: new Date(message.timestamp ?? message.createdAt ?? Date.now()),
    reactions:
      message.reactions?.map((reaction) => ({
        emoji: reaction.emoji ?? "👍",
        count: reaction.count ?? reaction.users?.length ?? 0,
        users: reaction.users ?? [],
      })) ?? [],
    attachments: message.attachments?.filter((attachment) => attachment.type !== "file") as Message["attachments"],
    replyTo: message.replyTo,
  }
}

export default function CommunityPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [replyingTo, setReplyingTo] = useState<{ id: string; sender: string; preview: string } | null>(null)
  const [threadMessage, setThreadMessage] = useState<Message | null>(null)
  const onlineUsers = messages.length
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const messagesQuery = useMessagesQuery()
  const postMessageMutation = usePostMessageMutation()
  const toggleMessageLikeMutation = useToggleMessageLikeMutation()
  const postReplyMutation = usePostReplyMutation(threadMessage?.id ?? "")

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (messagesQuery.data && messagesQuery.data.length > 0) {
      setMessages(messagesQuery.data.map(mapApiMessage))
    }
  }, [messagesQuery.data])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (content: string, attachments: any[]) => {
    try {
      const savedMessage = await postMessageMutation.mutateAsync({
        content,
        attachments,
        replyTo: replyingTo?.id,
      })
      setMessages([...messages, mapApiMessage(savedMessage)])
      setReplyingTo(null)
    } catch (error) {
      toast({
        title: "Message failed",
        description: getApiErrorMessage(error, "We could not send your message."),
        variant: "destructive",
      })
    }
  }

  const handleReply = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId)
    if (message) {
      setReplyingTo({
        id: messageId,
        sender: message.sender.name,
        preview: message.content || (message.attachments ? "Attachment" : ""),
      })
    }
  }

  const handleReact = (messageId: string, emoji: string) => {
    toggleMessageLikeMutation.mutate(messageId, {
      onError: (error) => {
        toast({
          title: "Reaction not synced",
          description: getApiErrorMessage(error, "Your reaction could not be synced with the server."),
          variant: "destructive",
        })
      },
    })

    setMessages((prevMessages) =>
      prevMessages.map((message) => {
        if (message.id === messageId) {
          const existingReactionIndex = message.reactions.findIndex((r) => r.emoji === emoji)

          if (existingReactionIndex > -1) {
            const existingReaction = message.reactions[existingReactionIndex]
            const userIndex = existingReaction.users.indexOf(currentUserId)

            if (userIndex > -1) {
              // User already reacted, remove their reaction
              const updatedUsers = existingReaction.users.filter((id) => id !== currentUserId)
              const updatedReactions = [...message.reactions]

              if (updatedUsers.length === 0) {
                // No users left, remove the reaction
                updatedReactions.splice(existingReactionIndex, 1)
              } else {
                // Update the users and count
                updatedReactions[existingReactionIndex] = {
                  ...existingReaction,
                  users: updatedUsers,
                  count: updatedUsers.length,
                }
              }

              return { ...message, reactions: updatedReactions }
            } else {
              // User hasn't reacted, add their reaction
              const updatedReaction = {
                ...existingReaction,
                users: [...existingReaction.users, currentUserId],
                count: existingReaction.count + 1,
              }

              const updatedReactions = [...message.reactions]
              updatedReactions[existingReactionIndex] = updatedReaction

              return { ...message, reactions: updatedReactions }
            }
          } else {
            // Reaction doesn't exist yet, add it
            return {
              ...message,
              reactions: [...message.reactions, { emoji, count: 1, users: [currentUserId] }],
            }
          }
        } else if (message.thread) {
          // Check if the reaction is for a message in a thread
          const updatedThread = message.thread.map((threadMessage) => {
            if (threadMessage.id === messageId) {
              const existingReactionIndex = threadMessage.reactions.findIndex((r) => r.emoji === emoji)

              if (existingReactionIndex > -1) {
                const existingReaction = threadMessage.reactions[existingReactionIndex]
                const userIndex = existingReaction.users.indexOf(currentUserId)

                if (userIndex > -1) {
                  // User already reacted, remove their reaction
                  const updatedUsers = existingReaction.users.filter((id) => id !== currentUserId)
                  const updatedReactions = [...threadMessage.reactions]

                  if (updatedUsers.length === 0) {
                    // No users left, remove the reaction
                    updatedReactions.splice(existingReactionIndex, 1)
                  } else {
                    // Update the users and count
                    updatedReactions[existingReactionIndex] = {
                      ...existingReaction,
                      users: updatedUsers,
                      count: updatedUsers.length,
                    }
                  }

                  return { ...threadMessage, reactions: updatedReactions }
                } else {
                  // User hasn't reacted, add their reaction
                  const updatedReaction = {
                    ...existingReaction,
                    users: [...existingReaction.users, currentUserId],
                    count: existingReaction.count + 1,
                  }

                  const updatedReactions = [...threadMessage.reactions]
                  updatedReactions[existingReactionIndex] = updatedReaction

                  return { ...threadMessage, reactions: updatedReactions }
                }
              } else {
                // Reaction doesn't exist yet, add it
                return {
                  ...threadMessage,
                  reactions: [...threadMessage.reactions, { emoji, count: 1, users: [currentUserId] }],
                }
              }
            }
            return threadMessage
          })

          return { ...message, thread: updatedThread }
        }

        return message
      }),
    )
  }

  const handleOpenThread = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId)
    if (message) {
      setThreadMessage(message)
    }
  }

  const handleSendReply = async (messageId: string, content: string, attachments: any[]) => {
    try {
      const savedReply = await postReplyMutation.mutateAsync({
        content,
        attachments,
      })
      const newReply = mapApiMessage(savedReply)

      toast({
        title: "Reply sent",
        description: "Your reply has been added to the thread.",
      })

      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.id === messageId) {
            return {
              ...message,
              thread: [...(message.thread || []), newReply],
            }
          }
          return message
        }),
      )
    } catch (error) {
      toast({
        title: "Reply failed",
        description: getApiErrorMessage(error, "Your reply could not be sent."),
        variant: "destructive",
      })
    }
  }

  const handleNotificationClick = () => {
    // Mark all notifications as read
    setUnreadNotifications(0)

    toast({
      title: "Notifications cleared",
      description: "All messages have been marked as read.",
    })
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Channel Header */}
        <div className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center">
            <Hash className="mr-2 h-5 w-5" />
            <h3 className="font-medium">General</h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Input placeholder="Search messages..." className="h-8 w-[200px] rounded-full bg-muted pl-8" />
              <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted-foreground" />
            </div>

            <Button size="icon" variant="ghost" className="relative">
              <Users className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#21C55E] text-[10px] font-bold text-white">
                {onlineUsers}
              </span>
            </Button>

            <Button size="icon" variant="ghost" className="relative" onClick={handleNotificationClick}>
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadNotifications}
                </span>
              )}
            </Button>

            <Button size="icon" variant="ghost">
              <Info className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messagesQuery.isLoading && <div className="text-sm text-muted-foreground">Loading messages...</div>}
            {messagesQuery.isError && <div className="text-sm text-destructive">Unable to load community messages.</div>}
            {!messagesQuery.isLoading && !messagesQuery.isError && messages.length === 0 && (
              <div className="text-sm text-muted-foreground">No community messages yet.</div>
            )}
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                currentUserId={currentUserId}
                onReply={handleReply}
                onReact={handleReact}
                onOpenThread={handleOpenThread}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          replyingTo={replyingTo ?? undefined}
          onCancelReply={() => setReplyingTo(null)}
        />
      </div>

      {/* Thread Modal */}
      {threadMessage && (
        <MessageThread
          isOpen={!!threadMessage}
          onClose={() => setThreadMessage(null)}
          parentMessage={threadMessage}
          currentUserId={currentUserId}
          onSendReply={handleSendReply}
          onReact={handleReact}
        />
      )}
    </div>
  )
}
