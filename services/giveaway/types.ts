export interface SpinStatusResponse {
  canSpin?: boolean
  canAnswerTrivia?: boolean
  spinsRemaining?: number
  [key: string]: unknown
}

export interface SpinResponse {
  message: string
  prize?: string
  won?: boolean
  [key: string]: unknown
}

export interface TriviaQuestion {
  id: string
  question: string
  options: string[]
}

export interface TriviaSubmitPayload {
  questionId: string
  selectedAnswer: number
}

export interface TriviaSubmitResponse {
  message: string
  correct?: boolean
  prize?: string
}

export interface GiveawayWinner {
  id?: string
  name: string
  avatar?: string
  prize: string
  time?: string
  game?: string
}
