export const queryKeys = {
  app: {
    dashboard: ["app", "dashboard"] as const,
  },
  auth: {
    resetToken: (token: string) => ["auth", "reset-password", token] as const,
  },
  community: {
    messages: (q?: string) => ["community", "messages", q ?? ""] as const,
    replies: (messageId: string) => ["community", "messages", messageId, "replies"] as const,
  },
  giveaway: {
    spinStatus: ["giveaway", "spin", "status"] as const,
    triviaQuestion: ["giveaway", "trivia", "question"] as const,
    winners: ["giveaway", "winners"] as const,
  },
  profile: {
    detail: ["profile"] as const,
    status: ["profile", "status"] as const,
  },
  public: {
    landingPage: ["public", "landing-page"] as const,
    paymentGatewayOptions: (country?: string) => ["public", "payment-gateway-options", country ?? ""] as const,
  },
  vote: {
    contestants: ["vote", "contestants"] as const,
    leaderboard: ["vote", "leaderboard"] as const,
  },
}
