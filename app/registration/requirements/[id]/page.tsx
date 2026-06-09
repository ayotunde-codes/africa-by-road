"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Upload, CheckCircle2 } from "lucide-react"

export default function RequirementPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const requirementId = params.id
  const requirement = {
    title: "Requirement unavailable",
    description: "This requirement could not be loaded.",
    longDescription: "The backend does not currently expose a requirement detail endpoint.",
    action: "Return to Dashboard",
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      toast({
        title: "Requirement unavailable",
        description: "The backend does not currently expose a requirement completion endpoint.",
        variant: "destructive",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error completing this requirement.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async () => {
    setIsLoading(true)
    try {
      toast({
        title: "Upload unavailable",
        description: "The backend does not currently expose this requirement upload endpoint.",
        variant: "destructive",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <div className="mb-6">
        <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <Card className="bg-background/95 border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{requirement.title}</CardTitle>
          <CardDescription>{requirement.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/10 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2">Requirement Details</h3>
            <p className="text-muted-foreground">{requirement.longDescription}</p>
          </div>

          {requirementId === "2" && (
            <div className="border rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold">Travel Insurance Document</h4>
                  <p className="text-sm text-muted-foreground">
                    Upload your travel insurance policy document (PDF format preferred).
                  </p>
                </div>
                {isComplete ? (
                  <div className="flex items-center text-primary">
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    <span>Uploaded</span>
                  </div>
                ) : (
                  <Button variant="outline" onClick={handleUpload} disabled={isLoading}>
                    <Upload className="mr-2 h-4 w-4" />
                    {isLoading ? "Uploading..." : "Upload"}
                  </Button>
                )}
              </div>
            </div>
          )}

          {requirementId === "3" && (
            <div className="border rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold">Vehicle Registration</h4>
                  <p className="text-sm text-muted-foreground">
                    Upload your vehicle registration document and add vehicle details.
                  </p>
                </div>
                {isComplete ? (
                  <div className="flex items-center text-primary">
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    <span>Uploaded</span>
                  </div>
                ) : (
                  <Button variant="outline" onClick={handleUpload} disabled={isLoading}>
                    <Upload className="mr-2 h-4 w-4" />
                    {isLoading ? "Uploading..." : "Upload"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {isComplete ? (
            <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
          ) : (
            <Button onClick={handleComplete} disabled={isLoading}>
              {isLoading ? "Processing..." : requirement.action}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
