"use client"

import type React from "react"

import { useState } from "react"
import { TopNav } from "./top-nav"
import { SideNav } from "./side-nav"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />
      <div className="flex flex-1 overflow-hidden relative pt-16">
        <SideNav collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out overflow-y-auto h-[calc(100vh-4rem)]",
            sidebarCollapsed ? "ml-16" : "lg:ml-64"
          )}
        >
          <div className="p-6 max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
