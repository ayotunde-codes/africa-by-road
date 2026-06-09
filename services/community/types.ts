export interface CommunityUser {
  id?: string
  _id?: string
  name?: string
  firstName?: string
  lastName?: string
  email?: string
  avatar?: string
}

export interface CommunityReaction {
  emoji?: string
  count?: number
  users?: string[]
}

export interface CommunityAttachment {
  type: "image" | "video" | "audio" | "sticker" | "link" | "file"
  url: string
  thumbnail?: string
  name?: string
  duration?: number
}

export interface CommunityMessage {
  id?: string
  _id?: string
  content: string
  sender?: CommunityUser
  author?: CommunityUser
  timestamp?: string
  createdAt?: string
  reactions?: CommunityReaction[]
  attachments?: CommunityAttachment[]
  replyTo?: string
  likeCount?: number
  replyCount?: number
}

export interface CommunityReply extends CommunityMessage {
  messageId?: string
}

export interface ListMessagesParams {
  q?: string
}

export interface CreateMessagePayload {
  content: string
  attachments?: CommunityAttachment[]
  replyTo?: string
}

export interface CreateReplyPayload {
  content: string
  attachments?: CommunityAttachment[]
}

export interface LikeResponse {
  message: string
  liked?: boolean
}
