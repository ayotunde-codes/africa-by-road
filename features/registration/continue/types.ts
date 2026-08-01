import type { z } from "zod"
import type {
  documentUploadSchema,
  personalInfoSchema,
  socialMediaSchema,
} from "@/features/registration/schemas"

export type RegistrationTab = "personal-info" | "payment" | "social-media" | "documents"
export type PersonalInfoValues = z.infer<typeof personalInfoSchema>
export type SocialMediaValues = z.infer<typeof socialMediaSchema>
export type DocumentUploadValues = z.infer<typeof documentUploadSchema>
export type DocumentKey = keyof DocumentUploadValues
export type UploadedDocuments = Record<DocumentKey, boolean>

export interface ContinueRegistrationController {
  activeTab: RegistrationTab
  setActiveTab: (tab: RegistrationTab) => void
  isLoading: boolean
  uploadedDocuments: UploadedDocuments
  personalInfoForm: import("react-hook-form").UseFormReturn<PersonalInfoValues>
  socialMediaForm: import("react-hook-form").UseFormReturn<SocialMediaValues>
  documentUploadForm: import("react-hook-form").UseFormReturn<DocumentUploadValues>
  onPersonalInfoSubmit: (values: PersonalInfoValues) => Promise<void>
  onSocialMediaSubmit: (values: SocialMediaValues) => Promise<void>
  onDocumentUploadSubmit: () => Promise<void>
  handleDocumentUpload: (documentType: DocumentKey, file: File) => void
  goToDashboard: () => void
}
