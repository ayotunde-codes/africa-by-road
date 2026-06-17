"use client"

import { usePathname, useRouter } from "next/navigation"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useState, useEffect } from "react"
import { isChromelessRoute } from "@/lib/routes"

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted || !isMobile) {
    return null
  }

  if (isChromelessRoute(pathname)) {
    return null
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22 8.52V3.98C22 2.57 21.36 2 19.77 2H15.73C14.14 2 13.5 2.57 13.5 3.98V8.51C13.5 9.93 14.14 10.49 15.73 10.49H19.77C21.36 10.5 22 9.93 22 8.52Z"
            fill={active ? "#16A349" : "none"}
            stroke={active ? "#16A349" : "currentColor"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 19.77V15.73C22 14.14 21.36 13.5 19.77 13.5H15.73C14.14 13.5 13.5 14.14 13.5 15.73V19.77C13.5 21.36 14.14 22 15.73 22H19.77C21.36 22 22 21.36 22 19.77Z"
            fill={active ? "#16A349" : "none"}
            stroke={active ? "#16A349" : "currentColor"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5 8.52V3.98C10.5 2.57 9.86 2 8.27 2H4.23C2.64 2 2 2.57 2 3.98V8.51C2 9.93 2.64 10.49 4.23 10.49H8.27C9.86 10.5 10.5 9.93 10.5 8.52Z"
            fill={active ? "#16A349" : "none"}
            stroke={active ? "#16A349" : "currentColor"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.5 19.77V15.73C10.5 14.14 9.86 13.5 8.27 13.5H4.23C2.64 13.5 2 14.14 2 15.73V19.77C2 21.36 2.64 22 4.23 22H8.27C9.86 22 10.5 21.36 10.5 19.77Z"
            fill={active ? "#16A349" : "none"}
            stroke={active ? "#16A349" : "currentColor"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "Vote",
      href: "/vote",
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14.5 10.65H9.5"
            stroke={active ? "#16A349" : "currentColor"}
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8.21V13.21"
            stroke={active ? "#16A349" : "currentColor"}
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke={active ? "#16A349" : "currentColor"}
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      name: "Community",
      href: "/community",
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z"
            fill={active ? "#16A349" : "none"}
            stroke={active ? "#16A349" : "currentColor"}
            strokeWidth="1.5"
          />
          <circle cx="7" cy="12" r="1" fill={active ? "white" : "currentColor"} />
          <circle cx="12" cy="12" r="1" fill={active ? "white" : "currentColor"} />
          <circle cx="17" cy="12" r="1" fill={active ? "white" : "currentColor"} />
        </svg>
      ),
    },
    {
      name: "Giveaways",
      href: "/giveaways",
      icon: (active: boolean) => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19.97 10H3.97V18C3.97 21 4.97 22 7.97 22H15.97C18.97 22 19.97 21 19.97 18V10Z"
            fill={active ? "#16A349" : "none"}
            stroke={active ? "#16A349" : "currentColor"}
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21.5 7V8C21.5 9.1 20.97 10 19.5 10H4.5C2.97 10 2.5 9.1 2.5 8V7C2.5 5.9 2.97 5 4.5 5H19.5C20.97 5 21.5 5.9 21.5 7Z"
            fill={active ? "#16A349" : "none"}
            stroke={active ? "#16A349" : "currentColor"}
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.64 5H6.12C5.78 4.63 5.79 4.06 6.15 3.7L7.57 2.28C7.94 1.91 8.55 1.91 8.92 2.28L11.64 5Z"
            fill={active ? "#16A349" : "none"}
            stroke={active ? "#16A349" : "currentColor"}
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.87 5H12.35L15.07 2.28C15.44 1.91 16.05 1.91 16.42 2.28L17.84 3.7C18.2 4.06 18.21 4.63 17.87 5Z"
            fill={active ? "#16A349" : "none"}
            stroke={active ? "#16A349" : "currentColor"}
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.94 10V15.14C8.94 15.94 9.82 16.41 10.49 15.98L11.43 15.36C11.77 15.14 12.2 15.14 12.53 15.36L13.42 15.96C14.08 16.4 14.97 15.93 14.97 15.13V10H8.94Z"
            fill={active ? "#16A349" : "none"}
            stroke={active ? "#16A349" : "currentColor"}
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0A0A1B] border-t border-[#2A2A3E] flex justify-around py-2 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <button
            key={item.name}
            className={`flex flex-col items-center p-2 ${isActive ? "text-primary" : "text-gray-400"}`}
            onClick={() => router.push(item.href)}
          >
            {item.icon(isActive)}
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        )
      })}
    </div>
  )
}
