"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function GiveawayDetailPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/giveaways" className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Giveaways
        </Link>
      </div>

      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Giveaway details are not available because the backend does not currently expose a giveaway detail endpoint.
        </CardContent>
      </Card>
    </div>
  )
}
