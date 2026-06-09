"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function PostPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link href="/community" className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Community
        </Link>
      </div>

      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          This post cannot be loaded because the backend does not currently expose a community message detail endpoint.
        </CardContent>
      </Card>
    </div>
  )
}
