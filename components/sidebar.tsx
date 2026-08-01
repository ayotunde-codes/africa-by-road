"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Vote, Users, Gift, Menu, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { logNavigationStart } from "@/hooks/use-navigation-diagnostics"
import { useLogoutMutation } from "@/services/auth/client"
import { getApiErrorMessage } from "@/services/errors"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

const NavItem = ({ href, icon, label, isActive }: NavItemProps) => {
  return (
    <Link href={href} className="w-full" onClick={() => logNavigationStart("Sidebar", href)}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 pl-3 font-medium",
          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
        )}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </Link>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [collapsed, setCollapsed] = useState(false)
  const logoutMutation = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      toast({ title: "Logged out", description: "You have been successfully logged out." })
      router.replace("/login")
    } catch (error) {
      toast({ title: "Logout failed", description: getApiErrorMessage(error, "Please try again."), variant: "destructive" })
    }
  }

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/vote",
      label: "Vote",
      icon: <Vote className="h-5 w-5" />,
    },
    {
      href: "/community",
      label: "Community",
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/giveaways",
      label: "Giveaways",
      icon: <Gift className="h-5 w-5" />,
    },
  ]

  return (
    <div
      className={cn(
        "flex h-screen flex-col bg-background/95 border-r transition-all duration-300",
        collapsed ? "w-[80px]" : "w-[250px]",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold">Africa by Road</span>
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="ml-auto">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <div className="space-y-2 px-3">
          {routes.map((route) => (
            <NavItem
              key={route.href}
              href={route.href}
              icon={route.icon}
              label={route.label}
              isActive={pathname === route.href}
            />
          ))}
        </div>
      </div>

      <div className="border-t p-4">
        {!collapsed && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">A</span>
              </div>
              <div>
                <p className="text-sm font-medium">User Profile</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 pl-3 text-red-500 hover:text-red-600 hover:bg-red-100/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        )}
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-100/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}
