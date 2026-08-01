import { NextResponse } from "next/server"

interface DiagnosticEntry {
  message: string
  details?: Record<string, unknown>
  receivedAt: string
}

const diagnostics = globalThis as typeof globalThis & {
  __abrDiagnostics?: DiagnosticEntry[]
}

function getDiagnostics() {
  diagnostics.__abrDiagnostics ??= []
  return diagnostics.__abrDiagnostics
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 })
  }

  return NextResponse.json({ entries: getDiagnostics().slice(-100) })
}

export async function DELETE() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 })
  }

  diagnostics.__abrDiagnostics = []
  return NextResponse.json({ ok: true })
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 })
  }

  const payload = (await request.json().catch(() => null)) as {
    message?: string
    details?: Record<string, unknown>
  } | null

  if (!payload?.message) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  getDiagnostics().push({
    message: payload.message,
    details: payload.details,
    receivedAt: new Date().toISOString(),
  })

  return NextResponse.json({ ok: true })
}
