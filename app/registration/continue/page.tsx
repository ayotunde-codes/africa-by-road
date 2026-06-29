"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { documentUploadSchema, personalInfoSchema, socialMediaSchema } from "@/features/registration/schemas"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Upload, CheckCircle2, ChevronLeft } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { MobileNav } from "@/components/mobile-nav"
import { getApiErrorMessage } from "@/services/errors"
import {
  useUpdatePersonalInfoMutation,
  useUpdateSocialProfileMutation,
  useUploadDocumentUrlMutation,
} from "@/services/profile/client"

export default function ContinueRegistrationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("personal-info")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedDocuments, setUploadedDocuments] = useState({
    governmentId: false,
    proofOfAddress: false,
    medicalRecords: false,
  })
  const isMobile = useMediaQuery("(max-width: 768px)")
  const updatePersonalInfoMutation = useUpdatePersonalInfoMutation()
  const updateSocialProfileMutation = useUpdateSocialProfileMutation()
  const uploadDocumentUrlMutation = useUploadDocumentUrlMutation()

  // Personal Information Form
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
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

  // Social Media Form
  const socialMediaForm = useForm<z.infer<typeof socialMediaSchema>>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      instagram: "",
      facebook: "",
      twitter: "",
      tiktok: "",
      youtube: "",
    },
  })

  // Document Upload Form
  const documentUploadForm = useForm<z.infer<typeof documentUploadSchema>>({
    resolver: zodResolver(documentUploadSchema),
    defaultValues: {
      governmentId: false,
      proofOfAddress: false,
      medicalRecords: false,
    },
  })

  // Handle Personal Information Form Submit
  const onPersonalInfoSubmit = async (values: z.infer<typeof personalInfoSchema>) => {
    setIsLoading(true)
    try {
      await updatePersonalInfoMutation.mutateAsync({
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth.toISOString(),
        country: values.country,
        state: values.state,
        city: values.city,
        residentialAddress: values.address,
      })
      toast({
        title: "Personal information saved",
        description: "Your personal information has been saved successfully.",
      })
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

  // Handle Social Media Form Submit
  const onSocialMediaSubmit = async (values: z.infer<typeof socialMediaSchema>) => {
    setIsLoading(true)
    try {
      await updateSocialProfileMutation.mutateAsync(values)
      toast({
        title: "Social media links saved",
        description: "Your social media links have been saved successfully.",
      })
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

  // Handle Document Upload
  const handleDocumentUpload = (documentType: keyof typeof uploadedDocuments) => {
    setIsLoading(true)

    uploadDocumentUrlMutation
      .mutateAsync({
        documentType,
        url: "/placeholder.svg",
      })
      .then(() => {
      setUploadedDocuments((prev) => ({
        ...prev,
        [documentType]: true,
      }))

      documentUploadForm.setValue(documentType, true)

      setIsLoading(false)

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
      .finally(() => {
        setIsLoading(false)
      })
  }

  // Handle Document Upload Form Submit
  const onDocumentUploadSubmit = async (values: z.infer<typeof documentUploadSchema>) => {
    setIsLoading(true)
    try {
      toast({
        title: "Registration complete",
        description: "Your registration has been completed successfully.",
      })
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

  // Mobile view
  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#0A0A1B] text-white pb-20">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white" onClick={() => router.push("/dashboard")}>
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Back to Dashboard</span>
            </Button>
            <div className="text-3xl font-bold">
              <span className="text-gray-400">A</span>
              <span className="text-primary">B</span>
              <span className="text-gray-400">R</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-white">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
              >
                <path
                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="text-white">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
              >
                <path
                  d="M12.02 2.91C8.71 2.91 6.02 5.6 6.02 8.91V11.8C6.02 12.41 5.76 13.34 5.45 13.86L4.3 15.77C3.59 16.95 4.08 18.26 5.38 18.7C9.69 20.14 14.34 20.14 18.65 18.7C19.86 18.3 20.39 16.87 19.73 15.77L18.58 13.86C18.28 13.34 18.02 12.41 18.02 11.8V8.91C18.02 5.61 15.32 2.91 12.02 2.91Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                />
                <path
                  d="M13.87 3.2C13.56 3.11 13.24 3.04 12.91 3C11.95 2.88 11.03 2.95 10.17 3.2C10.46 2.46 11.18 1.94 12.02 1.94C12.86 1.94 13.58 2.46 13.87 3.2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.02 19.06C15.02 20.71 13.67 22.06 12.02 22.06C11.2 22.06 10.44 21.72 9.9 21.18C9.36 20.64 9.02 19.88 9.02 19.06"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="px-4 mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Complete your registration</h1>
          <p className="text-gray-400 text-sm">
            Please provide the following information to complete your registration.
          </p>
        </div>

        {/* Tabs */}
        <div className="px-4 mb-6">
          <div className="bg-[#131326] rounded-lg overflow-hidden">
            <div className="flex">
              <button
                className={`flex-1 py-3 text-center text-sm ${
                  activeTab === "personal-info" ? "bg-[#1E1E3F] text-white" : "text-gray-400"
                }`}
                onClick={() => setActiveTab("personal-info")}
              >
                Personal Info
              </button>
              <button
                className={`flex-1 py-3 text-center text-sm ${
                  activeTab === "payment" ? "bg-[#1E1E3F] text-white" : "text-gray-400"
                }`}
                onClick={() => personalInfoForm.formState.isSubmitSuccessful && setActiveTab("payment")}
                disabled={!personalInfoForm.formState.isSubmitSuccessful}
              >
                Payment
              </button>
              <button
                className={`flex-1 py-3 text-center text-sm ${
                  activeTab === "social-media" ? "bg-[#1E1E3F] text-white" : "text-gray-400"
                }`}
                onClick={() => personalInfoForm.formState.isSubmitSuccessful && setActiveTab("social-media")}
                disabled={!personalInfoForm.formState.isSubmitSuccessful}
              >
                Social Media
              </button>
              <button
                className={`flex-1 py-3 text-center text-sm ${
                  activeTab === "documents" ? "bg-[#1E1E3F] text-white" : "text-gray-400"
                }`}
                onClick={() => socialMediaForm.formState.isSubmitSuccessful && setActiveTab("documents")}
                disabled={!socialMediaForm.formState.isSubmitSuccessful}
              >
                Documents
              </button>
            </div>
          </div>
        </div>

        {/* Personal Info Tab */}
        {activeTab === "personal-info" && (
          <div className="px-4 pb-6">
            <Form {...personalInfoForm}>
              <form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormField
                      control={personalInfoForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">First name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter first name"
                              {...field}
                              className="bg-[#131326] border-0 h-12 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={personalInfoForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Last name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter last name"
                              {...field}
                              className="bg-[#131326] border-0 h-12 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={personalInfoForm.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-white">Date of Birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal h-12 bg-[#131326] border-0 text-white ${
                                !field.value && "text-gray-400"
                              }`}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Select DOB</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-[#1E1E3F]" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                            initialFocus
                            className="bg-[#1E1E3F] text-white"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalInfoForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#131326] border-0 h-12 text-white">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#1E1E3F] text-white border-0">
                          <SelectItem value="nigeria">Nigeria</SelectItem>
                          <SelectItem value="kenya">Kenya</SelectItem>
                          <SelectItem value="south_africa">South Africa</SelectItem>
                          <SelectItem value="ghana">Ghana</SelectItem>
                          <SelectItem value="egypt">Egypt</SelectItem>
                          <SelectItem value="morocco">Morocco</SelectItem>
                          <SelectItem value="tanzania">Tanzania</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalInfoForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">State/Province</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="State or Province"
                          {...field}
                          className="bg-[#131326] border-0 h-12 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalInfoForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} className="bg-[#131326] border-0 h-12 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={personalInfoForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Residential Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main" {...field} className="bg-[#131326] border-0 h-12 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
                >
                  {isLoading ? "Saving..." : "Save and continue"}
                </Button>
              </form>
            </Form>
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === "payment" && (
          <div className="px-4 pb-6">
            <div className="bg-[#131326] rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-2">Registration Fee</h3>
              <p className="text-gray-400 mb-4">You can continue registration without completing payment here.</p>
              <div className="text-3xl font-bold mb-4">$50.00 USD</div>
            </div>

            <Button
              onClick={() => setActiveTab("social-media")}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
            >
              Continue
            </Button>
          </div>
        )}

        {/* Social Media Tab */}
        {activeTab === "social-media" && (
          <div className="px-4 pb-6">
            <Form {...socialMediaForm}>
              <form onSubmit={socialMediaForm.handleSubmit(onSocialMediaSubmit)} className="space-y-6">
                <FormField
                  control={socialMediaForm.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Instagram</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter profile link"
                          {...field}
                          className="bg-[#131326] border-0 h-12 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={socialMediaForm.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Facebook</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter profile link"
                          {...field}
                          className="bg-[#131326] border-0 h-12 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={socialMediaForm.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">X (Twitter)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter profile link"
                          {...field}
                          className="bg-[#131326] border-0 h-12 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={socialMediaForm.control}
                  name="tiktok"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">TikTok</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter profile link"
                          {...field}
                          className="bg-[#131326] border-0 h-12 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={socialMediaForm.control}
                  name="youtube"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">YouTube</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter profile link"
                          {...field}
                          className="bg-[#131326] border-0 h-12 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
                >
                  {isLoading ? "Saving..." : "Save and continue"}
                </Button>
              </form>
            </Form>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="px-4 pb-6">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-bold mb-2">Required Documents</h3>
              <p className="text-gray-400 text-sm">
                Please upload the following documents to complete your registration.
              </p>
            </div>

            <Form {...documentUploadForm}>
              <form onSubmit={documentUploadForm.handleSubmit(onDocumentUploadSubmit)} className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold mb-1">Government Issued ID</h4>
                    <p className="text-xs text-gray-400 mb-2">
                      Upload a valid passport, driver's license, or national ID card.
                    </p>
                    <div className="bg-[#131326] rounded-lg p-6 flex flex-col items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-400 mb-2" />
                      <p className="text-sm text-center mb-1">Choose a file or drag & drop it here</p>
                      <p className="text-xs text-gray-400 mb-3">JPEG, PNG, PDF, up to 5MB</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleDocumentUpload("governmentId")}
                        disabled={isLoading || uploadedDocuments.governmentId}
                        className="bg-transparent border-white text-white hover:bg-white/10"
                      >
                        {uploadedDocuments.governmentId ? "Uploaded" : "Browse File"}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-1">Proof of Address</h4>
                    <p className="text-xs text-gray-400 mb-2">
                      Upload a utility bill, bank statement, or other proof of address (not older than 3 months).
                    </p>
                    <div className="bg-[#131326] rounded-lg p-6 flex flex-col items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-400 mb-2" />
                      <p className="text-sm text-center mb-1">Choose a file or drag & drop it here</p>
                      <p className="text-xs text-gray-400 mb-3">JPEG, PNG, PDF, up to 5MB</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleDocumentUpload("proofOfAddress")}
                        disabled={isLoading || uploadedDocuments.proofOfAddress}
                        className="bg-transparent border-white text-white hover:bg-white/10"
                      >
                        {uploadedDocuments.proofOfAddress ? "Uploaded" : "Browse File"}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-1">Medical Records</h4>
                    <p className="text-xs text-gray-400 mb-2">
                      Upload your medical records, including vaccinations and any relevant health information.
                    </p>
                    <div className="bg-[#131326] rounded-lg p-6 flex flex-col items-center justify-center">
                      <Upload className="h-6 w-6 text-gray-400 mb-2" />
                      <p className="text-sm text-center mb-1">Choose a file or drag & drop it here</p>
                      <p className="text-xs text-gray-400 mb-3">JPEG, PNG, PDF, up to 5MB</p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleDocumentUpload("medicalRecords")}
                        disabled={isLoading || uploadedDocuments.medicalRecords}
                        className="bg-transparent border-white text-white hover:bg-white/10"
                      >
                        {uploadedDocuments.medicalRecords ? "Uploaded" : "Browse File"}
                      </Button>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !uploadedDocuments.governmentId ||
                    !uploadedDocuments.proofOfAddress ||
                    !uploadedDocuments.medicalRecords
                  }
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
                >
                  {isLoading ? "Completing..." : "Complete Registration"}
                </Button>
              </form>
            </Form>
          </div>
        )}
        <MobileNav />
      </div>
    )
  }

  // Desktop view (existing code)
  return (
    <div className="container max-w-3xl mx-auto py-10">
      <Card className="bg-background/95 border-0">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Button variant="ghost" size="sm" className="mr-2 -ml-2" onClick={() => router.push("/dashboard")}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold">Complete Your Registration</CardTitle>
          <CardDescription>Please provide the following information to complete your registration.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
              <TabsTrigger value="payment" disabled={!personalInfoForm.formState.isSubmitSuccessful}>
                Payment
              </TabsTrigger>
              <TabsTrigger value="social-media" disabled={!personalInfoForm.formState.isSubmitSuccessful}>
                Social Media
              </TabsTrigger>
              <TabsTrigger value="documents" disabled={!socialMediaForm.formState.isSubmitSuccessful}>
                Documents
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal-info">
              <Form {...personalInfoForm}>
                <form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={personalInfoForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalInfoForm.control}
                      name="middleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle Name (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="David" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalInfoForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={personalInfoForm.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${
                                  !field.value && "text-muted-foreground"
                                }`}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={personalInfoForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="nigeria">Nigeria</SelectItem>
                              <SelectItem value="kenya">Kenya</SelectItem>
                              <SelectItem value="south_africa">South Africa</SelectItem>
                              <SelectItem value="ghana">Ghana</SelectItem>
                              <SelectItem value="egypt">Egypt</SelectItem>
                              <SelectItem value="morocco">Morocco</SelectItem>
                              <SelectItem value="tanzania">Tanzania</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalInfoForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="State or Province" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={personalInfoForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={personalInfoForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Residential Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save & Continue"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment">
              <div className="space-y-6">
                <div className="bg-primary/10 rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-2">Registration Fee</h3>
                  <p className="text-muted-foreground mb-4">
                    You can continue registration without completing payment here.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">$50.00 USD</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setActiveTab("social-media")}>Continue</Button>
                </div>
              </div>
            </TabsContent>

            {/* Social Media Tab */}
            <TabsContent value="social-media">
              <Form {...socialMediaForm}>
                <form onSubmit={socialMediaForm.handleSubmit(onSocialMediaSubmit)} className="space-y-6">
                  <FormField
                    control={socialMediaForm.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input placeholder="https://instagram.com/username" {...field} />
                        </FormControl>
                        <FormDescription>Your Instagram profile URL (optional)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={socialMediaForm.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input placeholder="https://facebook.com/username" {...field} />
                        </FormControl>
                        <FormDescription>Your Facebook profile URL (optional)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={socialMediaForm.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>X (Twitter)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://x.com/username" {...field} />
                        </FormControl>
                        <FormDescription>Your X (Twitter) profile URL (optional)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={socialMediaForm.control}
                    name="tiktok"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TikTok</FormLabel>
                        <FormControl>
                          <Input placeholder="https://tiktok.com/@username" {...field} />
                        </FormControl>
                        <FormDescription>Your TikTok profile URL (optional)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={socialMediaForm.control}
                    name="youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube</FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtube.com/c/channelname" {...field} />
                        </FormControl>
                        <FormDescription>Your YouTube channel URL (optional)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save & Continue"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents">
              <Form {...documentUploadForm}>
                <form onSubmit={documentUploadForm.handleSubmit(onDocumentUploadSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">Required Documents</h3>
                    <p className="text-muted-foreground">
                      Please upload the following documents to complete your registration.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="border rounded-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-bold">Government Issued ID</h4>
                          <p className="text-sm text-muted-foreground">
                            Upload a valid passport, driver's license, or national ID card.
                          </p>
                        </div>
                        {uploadedDocuments.governmentId ? (
                          <div className="flex items-center text-primary">
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            <span>Uploaded</span>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleDocumentUpload("governmentId")}
                            disabled={isLoading}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {isLoading ? "Uploading..." : "Upload"}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="border rounded-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-bold">Proof of Address</h4>
                          <p className="text-sm text-muted-foreground">
                            Upload a utility bill, bank statement, or other proof of address (not older than 3 months).
                          </p>
                        </div>
                        {uploadedDocuments.proofOfAddress ? (
                          <div className="flex items-center text-primary">
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            <span>Uploaded</span>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleDocumentUpload("proofOfAddress")}
                            disabled={isLoading}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {isLoading ? "Uploading..." : "Upload"}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="border rounded-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-bold">Medical Records</h4>
                          <p className="text-sm text-muted-foreground">
                            Upload your medical records, including vaccinations and any relevant health information.
                          </p>
                        </div>
                        {uploadedDocuments.medicalRecords ? (
                          <div className="flex items-center text-primary">
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            <span>Uploaded</span>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleDocumentUpload("medicalRecords")}
                            disabled={isLoading}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {isLoading ? "Uploading..." : "Upload"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={
                        isLoading ||
                        !uploadedDocuments.governmentId ||
                        !uploadedDocuments.proofOfAddress ||
                        !uploadedDocuments.medicalRecords
                      }
                    >
                      {isLoading ? "Completing..." : "Complete Registration"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
