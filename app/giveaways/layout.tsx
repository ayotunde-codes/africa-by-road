import type React from "react"
export default function GiveawaysLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="container mx-auto">{children}</div>
}
