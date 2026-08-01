"use client"

import Link from "next/link"
import type { ReactNode } from "react"

interface AuthPanelProps {
  title: string
  description: string
  children: ReactNode
}

export function AuthPanel({ title, description, children }: AuthPanelProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A1B] relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-0 w-64 h-64">
        <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C0 110.457 89.5431 200 200 200" stroke="#16A349" strokeWidth="2" />
          <path d="M40 0C40 88.3656 111.634 160 200 160" stroke="#16A349" strokeWidth="2" />
          <path d="M80 0C80 66.2742 133.726 120 200 120" stroke="#16A349" strokeWidth="2" />
          <path d="M120 0C120 44.1828 155.817 80 200 80" stroke="#16A349" strokeWidth="2" />
          <path d="M160 0C160 22.0914 177.909 40 200 40" stroke="#16A349" strokeWidth="2" />
        </svg>
      </div>

      <div className="pointer-events-none absolute bottom-0 right-0 w-64 h-64 rotate-180">
        <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C0 110.457 89.5431 200 200 200" stroke="#16A349" strokeWidth="2" />
          <path d="M40 0C40 88.3656 111.634 160 200 160" stroke="#16A349" strokeWidth="2" />
          <path d="M80 0C80 66.2742 133.726 120 200 120" stroke="#16A349" strokeWidth="2" />
          <path d="M120 0C120 44.1828 155.817 80 200 80" stroke="#16A349" strokeWidth="2" />
          <path d="M160 0C160 22.0914 177.909 40 200 40" stroke="#16A349" strokeWidth="2" />
        </svg>
      </div>

      <div className="flex justify-center mt-16 mb-8">
        <Link href="/login" className="text-5xl font-bold">
          <span className="text-gray-400">A</span>
          <span className="text-primary">B</span>
          <span className="text-gray-400">R</span>
        </Link>
      </div>

      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-400">{description}</p>
        </div>
        {children}
      </div>
    </div>
  )
}
