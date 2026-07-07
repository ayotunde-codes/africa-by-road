"use client"

import { MobileNav } from "@/components/mobile-nav"
import { DocumentsForm } from "./documents-form"
import { MobileRegistrationHeader } from "./mobile-registration-header"
import { PaymentStep } from "./payment-step"
import { PersonalInfoForm } from "./personal-info-form"
import { REGISTRATION_TABS } from "./constants"
import { SocialMediaForm } from "./social-media-form"
import type { ContinueRegistrationController, RegistrationTab } from "./types"

interface MobileRegistrationViewProps {
  controller: ContinueRegistrationController
}

export function MobileRegistrationView({ controller }: MobileRegistrationViewProps) {
  const canOpenPayment = controller.personalInfoForm.formState.isSubmitSuccessful
  const canOpenDocuments = controller.socialMediaForm.formState.isSubmitSuccessful

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-white pb-20">
      <MobileRegistrationHeader onBack={controller.goToDashboard} />
      <div className="px-4 mb-6">
        <div className="bg-[#131326] rounded-lg overflow-hidden">
          <div className="flex">
            {REGISTRATION_TABS.map((tab) => (
              <MobileTabButton
                key={tab.value}
                tab={tab.value}
                label={tab.label}
                activeTab={controller.activeTab}
                disabled={isTabDisabled(tab.value, canOpenPayment, canOpenDocuments)}
                onSelect={controller.setActiveTab}
              />
            ))}
          </div>
        </div>
      </div>

      {controller.activeTab === "personal-info" && (
        <div className="px-4 pb-6">
          <PersonalInfoForm
            form={controller.personalInfoForm}
            isLoading={controller.isLoading}
            onSubmit={controller.onPersonalInfoSubmit}
            variant="mobile"
          />
        </div>
      )}

      {controller.activeTab === "payment" && (
        <PaymentStep variant="mobile" onContinue={() => controller.setActiveTab("social-media")} />
      )}

      {controller.activeTab === "social-media" && (
        <div className="px-4 pb-6">
          <SocialMediaForm
            form={controller.socialMediaForm}
            isLoading={controller.isLoading}
            onSubmit={controller.onSocialMediaSubmit}
            variant="mobile"
          />
        </div>
      )}

      {controller.activeTab === "documents" && (
        <div className="px-4 pb-6">
          <DocumentsForm
            form={controller.documentUploadForm}
            isLoading={controller.isLoading}
            uploadedDocuments={controller.uploadedDocuments}
            onUpload={controller.handleDocumentUpload}
            onSubmit={controller.onDocumentUploadSubmit}
            variant="mobile"
          />
        </div>
      )}

      <MobileNav />
    </div>
  )
}

function MobileTabButton({
  tab,
  label,
  activeTab,
  disabled,
  onSelect,
}: {
  tab: RegistrationTab
  label: string
  activeTab: RegistrationTab
  disabled: boolean
  onSelect: (tab: RegistrationTab) => void
}) {
  return (
    <button
      className={`flex-1 py-3 text-center text-sm ${activeTab === tab ? "bg-[#1E1E3F] text-white" : "text-gray-400"}`}
      onClick={() => onSelect(tab)}
      disabled={disabled}
      type="button"
    >
      {label}
    </button>
  )
}

function isTabDisabled(tab: RegistrationTab, canOpenPayment: boolean, canOpenDocuments: boolean) {
  if (tab === "personal-info") return false
  if (tab === "documents") return !canOpenDocuments
  return !canOpenPayment
}
