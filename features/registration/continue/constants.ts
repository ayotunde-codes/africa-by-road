import type { DocumentKey } from "./types"

export const SOCIAL_FIELDS = [
  { name: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
  { name: "facebook", label: "Facebook", placeholder: "https://facebook.com/username" },
  { name: "twitter", label: "X (Twitter)", placeholder: "https://x.com/username" },
  { name: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@username" },
  { name: "youtube", label: "YouTube", placeholder: "https://youtube.com/c/channelname" },
] as const

export const DOCUMENT_REQUIREMENTS: {
  key: DocumentKey
  title: string
  description: string
}[] = [
  {
    key: "governmentId",
    title: "Government Issued ID",
    description: "Upload a valid passport, driver's license, or national ID card.",
  },
  {
    key: "proofOfAddress",
    title: "Proof of Address",
    description: "Upload a utility bill, bank statement, or other proof of address (not older than 3 months).",
  },
  {
    key: "medicalRecords",
    title: "Medical Records",
    description: "Upload your medical records, including vaccinations and any relevant health information.",
  },
]

export const REGISTRATION_TABS = [
  { value: "personal-info", label: "Personal Info" },
  { value: "payment", label: "Payment" },
  { value: "social-media", label: "Social Media" },
  { value: "documents", label: "Documents" },
] as const
