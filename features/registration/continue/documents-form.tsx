"use client"

import { CheckCircle2, Upload } from "lucide-react"
import { useRef } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { DOCUMENT_REQUIREMENTS } from "./constants"
import type { DocumentKey, DocumentUploadValues, UploadedDocuments } from "./types"

interface DocumentsFormProps {
  form: UseFormReturn<DocumentUploadValues>
  isLoading: boolean
  uploadedDocuments: UploadedDocuments
  variant?: "mobile" | "desktop"
  onUpload: (documentType: DocumentKey, file: File) => void
  onSubmit: () => Promise<void>
}

export function DocumentsForm({
  form,
  isLoading,
  uploadedDocuments,
  onUpload,
  onSubmit,
  variant = "desktop",
}: DocumentsFormProps) {
  const isMobile = variant === "mobile"
  const allUploaded = DOCUMENT_REQUIREMENTS.every((item) => uploadedDocuments[item.key])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className={isMobile ? "mb-6 text-center" : "space-y-4"}>
          <h3 className={isMobile ? "text-xl font-bold mb-2" : "text-lg font-bold"}>Required Documents</h3>
          <p className={isMobile ? "text-gray-400 text-sm" : "text-muted-foreground"}>
            Please upload the following documents to complete your registration.
          </p>
        </div>

        <div className={isMobile ? "space-y-6" : "grid grid-cols-1 gap-6"}>
          {DOCUMENT_REQUIREMENTS.map((document) =>
            isMobile ? (
              <MobileDocumentCard
                key={document.key}
                document={document}
                isLoading={isLoading}
                uploaded={uploadedDocuments[document.key]}
                onUpload={onUpload}
              />
            ) : (
              <DesktopDocumentCard
                key={document.key}
                document={document}
                isLoading={isLoading}
                uploaded={uploadedDocuments[document.key]}
                onUpload={onUpload}
              />
            ),
          )}
        </div>

        <div className={isMobile ? "" : "flex justify-end"}>
          <Button
            type="submit"
            disabled={isLoading || !allUploaded}
            className={isMobile ? "w-full h-12 bg-primary hover:bg-primary/90 text-white" : ""}
          >
            {isLoading ? "Completing..." : "Complete Registration"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

function MobileDocumentCard({
  document,
  uploaded,
  isLoading,
  onUpload,
}: {
  document: (typeof DOCUMENT_REQUIREMENTS)[number]
  uploaded: boolean
  isLoading: boolean
  onUpload: (documentType: DocumentKey, file: File) => void
}) {
  return (
    <div>
      <h4 className="font-bold mb-1">{document.title}</h4>
      <p className="text-xs text-gray-400 mb-2">{document.description}</p>
      <div className="bg-[#131326] rounded-lg p-6 flex flex-col items-center justify-center">
        <Upload className="h-6 w-6 text-gray-400 mb-2" />
        <p className="text-sm text-center mb-1">Choose a file or drag & drop it here</p>
        <p className="text-xs text-gray-400 mb-3">JPEG, PNG, PDF, up to 5MB</p>
        <DocumentUploadButton
          document={document}
          uploaded={uploaded}
          isLoading={isLoading}
          onUpload={onUpload}
          className="bg-transparent border-white text-white hover:bg-white/10"
        />
      </div>
    </div>
  )
}

function DesktopDocumentCard({
  document,
  uploaded,
  isLoading,
  onUpload,
}: {
  document: (typeof DOCUMENT_REQUIREMENTS)[number]
  uploaded: boolean
  isLoading: boolean
  onUpload: (documentType: DocumentKey, file: File) => void
}) {
  return (
    <div className="border rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-bold">{document.title}</h4>
          <p className="text-sm text-muted-foreground">{document.description}</p>
        </div>
        {uploaded ? (
          <div className="flex items-center text-primary">
            <CheckCircle2 className="mr-2 h-5 w-5" />
            <span>Uploaded</span>
          </div>
        ) : (
          <DocumentUploadButton document={document} uploaded={uploaded} isLoading={isLoading} onUpload={onUpload} />
        )}
      </div>
    </div>
  )
}

function DocumentUploadButton({
  document,
  uploaded,
  isLoading,
  onUpload,
  className,
}: {
  document: (typeof DOCUMENT_REQUIREMENTS)[number]
  uploaded: boolean
  isLoading: boolean
  onUpload: (documentType: DocumentKey, file: File) => void
  className?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,application/pdf"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onUpload(document.key, file)
          event.currentTarget.value = ""
        }}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={isLoading || uploaded}
        className={className}
      >
        {!uploaded && <Upload className="mr-2 h-4 w-4" />}
        {uploaded ? "Uploaded" : isLoading ? "Uploading..." : "Upload"}
      </Button>
    </>
  )
}
