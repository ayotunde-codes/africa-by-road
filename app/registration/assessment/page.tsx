"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, Circle, ClipboardCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

const demoRequirements = [
  {
    id: "travel-readiness",
    title: "Travel readiness",
    description: "Confirm you have valid travel documents and can join the route schedule.",
  },
  {
    id: "vehicle-access",
    title: "Vehicle access",
    description: "Confirm access to a roadworthy vehicle or approved travel partner arrangement.",
  },
  {
    id: "health-safety",
    title: "Health and safety",
    description: "Confirm emergency contact details and basic medical readiness for the trip.",
  },
]

export default function RequirementsAssessmentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [completedItems, setCompletedItems] = useState<string[]>([])

  const progress = useMemo(
    () => Math.round((completedItems.length / demoRequirements.length) * 100),
    [completedItems.length]
  )

  const toggleRequirement = (id: string) => {
    setCompletedItems((currentItems) =>
      currentItems.includes(id) ? currentItems.filter((itemId) => itemId !== id) : [...currentItems, id]
    )
  }

  const handleSubmit = () => {
    toast({
      title: "Assessment submitted",
      description: "Demo requirement assessment has been recorded for preview.",
    })
    router.push("/dashboard")
  }

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <Card className="bg-background/95 border-0">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Requirements Assessment</CardTitle>
              <CardDescription>
                Complete this demo checklist so the assessment flow can be previewed end to end.
              </CardDescription>
            </div>
            <Badge className="w-fit bg-primary">{progress}% complete</Badge>
          </div>
          <Progress value={progress} />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {demoRequirements.map((requirement) => {
              const isComplete = completedItems.includes(requirement.id)

              return (
                <button
                  key={requirement.id}
                  type="button"
                  onClick={() => toggleRequirement(requirement.id)}
                  className="flex w-full items-start gap-4 rounded-lg border bg-background p-4 text-left transition-colors hover:bg-muted/50"
                >
                  {isComplete ? (
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  ) : (
                    <Circle className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  )}
                  <span className="space-y-1">
                    <span className="block font-semibold">{requirement.title}</span>
                    <span className="block text-sm text-muted-foreground">{requirement.description}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="rounded-lg bg-primary/10 p-4">
            <div className="flex items-start gap-3">
              <ClipboardCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <h2 className="font-semibold">Demo assessment</h2>
                <p className="text-sm text-muted-foreground">
                  This screen is wired for the demo. Backend scoring can replace these local checklist items later.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => router.push("/dashboard")}>
              Save for later
            </Button>
            <Button onClick={handleSubmit} disabled={completedItems.length === 0}>
              Submit assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
