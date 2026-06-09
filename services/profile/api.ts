import { apiClient } from "@/services/http"
import type {
  DocumentUploadPayload,
  PersonalInfoPayload,
  Profile,
  ProfileEnvelope,
  ProfileResponse,
  RegistrationStatus,
  SocialProfilePayload,
} from "./types"

const PROFILE_BASE = "/api/profile"

export async function getProfile(): Promise<Profile> {
  const { data } = await apiClient.get<Profile | ProfileEnvelope>(PROFILE_BASE)
  if ("profile" in data && typeof data.profile === "object" && data.profile !== null) {
    return data.profile as Profile
  }

  return data as Profile
}

export async function updatePersonalInfo(payload: PersonalInfoPayload) {
  const { data } = await apiClient.put<ProfileResponse>(`${PROFILE_BASE}/personal`, payload)
  return data
}

export async function updateSocialProfile(payload: SocialProfilePayload) {
  const { data } = await apiClient.put<ProfileResponse>(`${PROFILE_BASE}/social`, payload)
  return data
}

export async function uploadDocumentUrl(payload: DocumentUploadPayload) {
  const { data } = await apiClient.put<ProfileResponse>(`${PROFILE_BASE}/documents`, {
    type: payload.documentType,
    url: payload.url,
  })
  return data
}

export async function getRegistrationStatus() {
  const { data } = await apiClient.get<RegistrationStatus>(`${PROFILE_BASE}/status`)
  return data
}
