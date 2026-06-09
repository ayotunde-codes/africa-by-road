"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, AlertCircle, CheckCircle, Clock, ChevronRight, HelpCircle } from "lucide-react"
import { ImageCarousel } from "@/components/image-carousel"
import { useRouter } from "next/navigation"
import { useRegistrationStatusQuery } from "@/services/profile/client"

export default function DashboardPage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  const registrationStatusQuery = useRegistrationStatusQuery()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const registrationStatus = {
    personalInfo: false,
    paymentComplete: false,
    socialMediaLinks: false,
    documentsUploaded: false,
    registrationComplete: false,
    overallProgress: 0,
    requirementProgress: 0,
    ...(!registrationStatusQuery.isError ? registrationStatusQuery.data : {}),
  }

  const registrationRequirements: {
    id: string | number
    title: string
    description: string
    status: string
    dueDate?: string
  }[] = []

  if (!isMounted) {
    return null
  }

  // Mobile view based on the design
  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#0A0A1B] text-white pb-20">
        {/* Header */}
        <div className="flex justify-between items-center p-4">
          <div className="text-3xl font-bold">
            <span className="text-gray-400">A</span>
            <span className="text-primary">B</span>
            <span className="text-gray-400">R</span>
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

        {/* Registration Progress Card */}
        <Card className="mx-4 mb-6 bg-[#131326] border-0 overflow-hidden">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="relative w-20 h-20 mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#2A2A3E" strokeWidth="10" strokeLinecap="round" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#16A349"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45 * (registrationStatus.overallProgress / 100)} ${
                    2 * Math.PI * 45 * (1 - registrationStatus.overallProgress / 100)
                  }`}
                  strokeDashoffset={2 * Math.PI * 45 * 0.25}
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50"
                  y="55"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="20"
                  fontWeight="bold"
                >
                  {registrationStatus.overallProgress}%
                </text>
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Complete Your Registration</h2>
            <p className="text-gray-400 text-sm mb-4">
              Your registration is incomplete. Please complete all required steps to access all features.
            </p>
            <Button
              className="bg-primary hover:bg-primary/90 text-white w-full"
              onClick={() => router.push("/registration/continue")}
            >
              Complete registration
            </Button>
          </CardContent>
        </Card>

        {/* Qualification Progress */}
        <div className="px-4 mb-6">
          <h2 className="text-xl font-bold mb-4">Qualification Progress</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium">Registration</span>
              <span className="text-xs text-primary">Completed</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#2A2A3E] flex items-center justify-center mb-2">
                <HelpCircle className="h-6 w-6 text-gray-400" />
              </div>
              <span className="text-sm font-medium">Requirements Assessment</span>
              <span className="text-xs text-gray-400">Pending</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#2A2A3E] flex items-center justify-center mb-2">
                <HelpCircle className="h-6 w-6 text-gray-400" />
              </div>
              <span className="text-sm font-medium">Personality Assessment</span>
              <span className="text-xs text-gray-400">Pending</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#2A2A3E] flex items-center justify-center mb-2">
                <HelpCircle className="h-6 w-6 text-gray-400" />
              </div>
              <span className="text-sm font-medium">Online Interview</span>
              <span className="text-xs text-gray-400">Pending</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#2A2A3E] flex items-center justify-center mb-2">
                <HelpCircle className="h-6 w-6 text-gray-400" />
              </div>
              <span className="text-sm font-medium">Shortlisted</span>
              <span className="text-xs text-gray-400">Pending</span>
            </div>
          </div>
        </div>

        {/* Requirement Assessment Card */}
        <Card className="mx-4 mb-6 bg-[#131326] border-0 overflow-hidden">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="relative w-20 h-20 mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#2A2A3E" strokeWidth="10" strokeLinecap="round" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#16A349"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45 * (registrationStatus.requirementProgress / 100)} ${
                    2 * Math.PI * 45 * (1 - registrationStatus.requirementProgress / 100)
                  }`}
                  strokeDashoffset={2 * Math.PI * 45 * 0.25}
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50"
                  y="55"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="20"
                  fontWeight="bold"
                >
                  {registrationStatus.requirementProgress}%
                </text>
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Complete Requirement Assessment</h2>
            <p className="text-gray-400 text-sm mb-4">
              Please complete all required documents and information in the Registration Requirements section below.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white w-full">Start Assessment</Button>
          </CardContent>
        </Card>

        {/* Registration Requirements */}
        <div className="px-4 mb-6">
          <h2 className="text-xl font-bold mb-4">Registration Requirements</h2>
          <div className="space-y-4">
            {registrationRequirements.length === 0 && (
              <div className="p-4 bg-[#131326] rounded-lg text-sm text-gray-400">
                No registration requirements are available yet.
              </div>
            )}
            {registrationRequirements.map((requirement) => (
              <Link key={requirement.id} href={`/registration/requirements/${requirement.id}`}>
                <div className="flex items-center justify-between p-4 bg-[#131326] rounded-lg">
                  <div className="flex items-start gap-3">
                    {requirement.status === "completed" ? (
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-gray-500 flex-shrink-0 mt-0.5"></div>
                    )}
                    <div>
                      <h3 className="font-medium text-white">{requirement.title}</h3>
                      <p className="text-sm text-gray-400">{requirement.description}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Due: {requirement.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Desktop view (existing code)
  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Registration Alert */}
      {!registrationStatus.registrationComplete && (
        <Card className="bg-primary/10 border-primary/20 border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold">Complete Your Registration</h3>
                  <p className="text-muted-foreground">
                    Your registration is incomplete. Please complete all required steps to access all features.
                  </p>
                </div>
              </div>
              <Link href="/registration/continue">
                <Button className="whitespace-nowrap">
                  Continue Registration
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hero Banner with Carousel */}
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-primary/20 to-primary/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-4">EXPLORE AFRICA BY ROAD</h2>
            <p className="text-lg mb-6">
              Join our community of road travelers exploring the beauty and diversity of Africa.
            </p>
            <Button className="w-fit">
              Join Community
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <ImageCarousel
              images={[
                {
                  src: "/images/martyrs-memorial.png",
                  alt: "Martyrs' Memorial in Algeria",
                  caption: "Martyrs' Memorial, Algeria",
                },
                {
                  src: "/images/voortrekker-night.png",
                  alt: "Voortrekker Monument at night",
                  caption: "Voortrekker Monument at night, South Africa",
                },
                {
                  src: "/images/voortrekker-day.png",
                  alt: "Voortrekker Monument during day",
                  caption: "Voortrekker Monument, South Africa",
                },
              ]}
            />
          </div>
        </div>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Qualification Progress</h2>
        </div>
        <Card className="bg-background/95 border-0 p-6">
          <div className="space-y-8">
            <div className="flex justify-between">
              <div className="text-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto z-10 relative">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute top-1/2 left-[50%] w-full h-1 bg-primary -z-10"></div>
                </div>
                <p className="mt-2 font-medium text-sm">Registration</p>
                <p className="text-xs text-primary">Completed</p>
              </div>

              <div className="text-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mx-auto z-10 relative">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div className="absolute top-1/2 right-[50%] w-full h-1 bg-primary -z-10"></div>
                  <div className="absolute top-1/2 left-[50%] w-full h-1 bg-muted -z-10"></div>
                </div>
                <p className="mt-2 font-medium text-sm">Requirements Assessment</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>

              <div className="text-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mx-auto z-10 relative">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div className="absolute top-1/2 right-[50%] w-full h-1 bg-muted -z-10"></div>
                  <div className="absolute top-1/2 left-[50%] w-full h-1 bg-muted -z-10"></div>
                </div>
                <p className="mt-2 font-medium text-sm">Personality Assessment</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>

              <div className="text-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mx-auto z-10 relative">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <div className="absolute top-1/2 right-[50%] w-full h-1 bg-muted -z-10"></div>
                  <div className="absolute top-1/2 left-[50%] w-full h-1 bg-muted -z-10"></div>
                </div>
                <p className="mt-2 font-medium text-sm">Online Interview</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>

              <div className="text-center">
                <div className="relative">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mx-auto z-10 relative">
                    <span className="text-sm font-bold">5</span>
                  </div>
                  <div className="absolute top-1/2 right-[50%] w-full h-1 bg-muted -z-10"></div>
                </div>
                <p className="mt-2 font-medium text-sm">Shortlisted</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold">Next Step: Complete Requirements Assessment</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please complete all required documents and information in the Registration Requirements section
                    below.
                  </p>
                  <Button className="mt-3" size="sm">
                    Start Assessment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Registration Requirements Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Registration Requirements</h2>
          <Button variant="ghost">View All</Button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {registrationRequirements.length === 0 && (
            <Card className="bg-background/95 border-0">
              <CardContent className="p-6 text-sm text-muted-foreground">
                No registration requirements are available yet.
              </CardContent>
            </Card>
          )}
          {registrationRequirements.map((requirement) => (
            <Card key={requirement.id} className="bg-background/95 border-0">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex items-start gap-4">
                    {requirement.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                    )}
                    <div>
                      <h3 className="font-bold">{requirement.title}</h3>
                      <p className="text-sm text-muted-foreground">{requirement.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Due: {requirement.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:ml-auto">
                    <Badge className={requirement.status === "completed" ? "bg-primary" : "bg-amber-500"}>
                      {requirement.status === "completed" ? "Completed" : "Required"}
                    </Badge>
                    <Link href={`/registration/requirements/${requirement.id}`}>
                      <Button variant="outline" size="sm">
                        {requirement.status === "completed" ? "View" : "Complete"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
