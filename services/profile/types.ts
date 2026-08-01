export interface Profile {
  id?: string
  email?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  nationality?: string
  bio?: string
  avatar?: string
  [key: string]: unknown
}

export interface PersonalInfoPayload {
  firstName?: string
  middleName?: string
  lastName?: string
  dateOfBirth?: string
  country?: string
  state?: string
  city?: string
  address?: string
  residentialAddress?: string
  phoneNumber?: string
  nationality?: string
}

export interface SocialProfilePayload {
  instagram?: string
  facebook?: string
  twitter?: string
  tiktok?: string
  youtube?: string
}

export interface DocumentUploadPayload {
  documentType: string
  file: File
}

export interface ProfileResponse {
  message?: string
  profile?: Profile
}

export interface ProfileEnvelope {
  message: string
  profile: Profile
}

export interface RegistrationStatus {
  personalInfo?: boolean
  paymentComplete?: boolean
  socialMediaLinks?: boolean
  documentsUploaded?: boolean
  registrationComplete?: boolean
  overallProgress?: number
  requirementProgress?: number
  [key: string]: unknown
}
