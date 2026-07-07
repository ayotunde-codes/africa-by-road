"use client"

import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentsForm } from "./documents-form"
import { PaymentStep } from "./payment-step"
import { PersonalInfoForm } from "./personal-info-form"
import { SocialMediaForm } from "./social-media-form"
import type { ContinueRegistrationController, RegistrationTab } from "./types"

interface DesktopRegistrationViewProps {
  controller: ContinueRegistrationController
}

export function DesktopRegistrationView({ controller }: DesktopRegistrationViewProps) {
  const canOpenPayment = controller.personalInfoForm.formState.isSubmitSuccessful
  const canOpenDocuments = controller.socialMediaForm.formState.isSubmitSuccessful

  return (
    <div className="container max-w-3xl mx-auto py-10">
      <Card className="bg-background/95 border-0">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Button variant="ghost" size="sm" className="mr-2 -ml-2" onClick={controller.goToDashboard}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold">Complete Your Registration</CardTitle>
          <CardDescription>Please provide the following information to complete your registration.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={controller.activeTab} onValueChange={(value) => controller.setActiveTab(value as RegistrationTab)}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
              <TabsTrigger value="payment" disabled={!canOpenPayment}>
                Payment
              </TabsTrigger>
              <TabsTrigger value="social-media" disabled={!canOpenPayment}>
                Social Media
              </TabsTrigger>
              <TabsTrigger value="documents" disabled={!canOpenDocuments}>
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal-info">
              <PersonalInfoForm
                form={controller.personalInfoForm}
                isLoading={controller.isLoading}
                onSubmit={controller.onPersonalInfoSubmit}
              />
            </TabsContent>

            <TabsContent value="payment">
              <PaymentStep onContinue={() => controller.setActiveTab("social-media")} />
            </TabsContent>

            <TabsContent value="social-media">
              <SocialMediaForm
                form={controller.socialMediaForm}
                isLoading={controller.isLoading}
                onSubmit={controller.onSocialMediaSubmit}
              />
            </TabsContent>

            <TabsContent value="documents">
              <DocumentsForm
                form={controller.documentUploadForm}
                isLoading={controller.isLoading}
                uploadedDocuments={controller.uploadedDocuments}
                onUpload={controller.handleDocumentUpload}
                onSubmit={controller.onDocumentUploadSubmit}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
