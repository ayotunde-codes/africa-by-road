export interface Contestant {
  id?: string
  _id?: string
  name: string
  country?: string
  bio?: string
  image?: string
  imageUrl?: string
  votes?: number
  [key: string]: unknown
}

export interface FavoritePayload {
  contestantId: string
}

export interface FavoriteResponse {
  message: string
  contestant?: Contestant
}
