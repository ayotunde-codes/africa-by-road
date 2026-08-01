"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  documentUploadSchema,
  personalInfoSchema,
  socialMediaSchema,
} from "@/features/registration/schemas"
import { useToast } from "@/components/ui/use-toast"
import { getApiErrorMessage } from "@/services/errors"
import {
  useUpdatePersonalInfoMutation,
  useUpdateSocialProfileMutation,
  useUploadDocumentMutation,
} from "@/services/profile/client"
import type {
  DocumentKey,
  DocumentUploadValues,
  PersonalInfoValues,
  RegistrationTab,
  SocialMediaValues,
} from "./types"

export function useContinueRegistration() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<RegistrationTab>("personal-info")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState<DocumentUploadValues>({
    governmentId: false,
    proofOfAddress: false,
    medicalRecords: false,
  })
  const updatePersonalInfoMutation = useUpdatePersonalInfoMutation()
  const updateSocialProfileMutation = useUpdateSocialProfileMutation()
  const uploadDocumentMutation = useUploadDocumentMutation()

  const personalInfoForm = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      country: "",
      state: "",
      city: "",
      address: "",
    },
  })

  const socialMediaForm = useForm<SocialMediaValues>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: { instagram: "", facebook: "", twitter: "", tiktok: "", youtube: "" },
  })

  const documentUploadForm = useForm<DocumentUploadValues>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: uploadedDocuments,
  })

  const onPersonalInfoSubmit = async (values: PersonalInfoValues) => {
    setIsLoading(true)
    try {
      await updatePersonalInfoMutation.mutateAsync({
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth.toISOString(),
        nationality: values.country,
        state: values.state,
        city: values.city,
        residentialAddress: values.address,
      })
      toast({ title: "Personal information saved", description: "Your personal information has been saved successfully." })
      setActiveTab("social-media")
    } catch (error) {
      toast({
        title: "Error",
        description: getApiErrorMessage(error, "There was an error saving your personal information."),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSocialMediaSubmit = async (values: SocialMediaValues) => {
    setIsLoading(true)
    try {
      await updateSocialProfileMutation.mutateAsync(values)
      toast({ title: "Social media links saved", description: "Your social media links have been saved successfully." })
      setActiveTab("documents")
    } catch (error) {
      toast({
        title: "Error",
        description: getApiErrorMessage(error, "There was an error saving your social media links."),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDocumentUpload = (documentType: DocumentKey, file: File) => {
    setIsLoading(true)
    uploadDocumentMutation
      .mutateAsync({ documentType, file })
      .then(() => {
        setUploadedDocuments((prev) => ({ ...prev, [documentType]: true }))
        documentUploadForm.setValue(documentType, true)
        toast({
          title: "Document uploaded",
          description: `Your ${documentType.replace(/([A-Z])/g, " $1").toLowerCase()} has been uploaded successfully.`,
        })
      })
      .catch((error) => {
        toast({
          title: "Upload failed",
          description: getApiErrorMessage(error, "There was an error uploading your document."),
          variant: "destructive",
        })
      })
      .finally(() => setIsLoading(false))
  }

  const onDocumentUploadSubmit = async () => {
    setIsLoading(true)
    try {
      toast({ title: "Registration complete", description: "Your registration has been completed successfully." })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: getApiErrorMessage(error, "There was an error completing your registration."),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    activeTab,
    setActiveTab,
    isLoading,
    uploadedDocuments,
    personalInfoForm,
    socialMediaForm,
    documentUploadForm,
    onPersonalInfoSubmit,
    onSocialMediaSubmit,
    onDocumentUploadSubmit,
    handleDocumentUpload,
    goToDashboard: () => router.push("/dashboard"),
  }
}
