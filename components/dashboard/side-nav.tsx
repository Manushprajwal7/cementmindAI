"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Activity,
  AlertTriangle,
  Settings,
  Map,
  FileText,
  ChevronLeft,
  ChevronRight,
  Gauge,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SideNavProps {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { icon: BarChart3, label: "Overview", href: "/" },
  { icon: Activity, label: "Real-Time Telemetry", href: "/telemetry" },
  { icon: AlertTriangle, label: "Anomaly & Alerts", href: "/alerts" },
  { icon: Gauge, label: "Quality Control", href: "/quality" },
  { icon: Map, label: "Logistics Planner", href: "/logistics" },
  { icon: FileText, label: "Reports & Exports", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

export function SideNav({ collapsed, onToggle }: SideNavProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out z-40 overflow-y-auto",
        collapsed ? "w-16" : "w-64",
      )}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--muted-foreground) transparent',
      }}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-sidebar-border">
          <Button variant="ghost" size="icon" onClick={onToggle} className="w-full justify-center">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 p-2 flex flex-col h-full">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link href={item.href} className="block">
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn("w-full justify-start", collapsed ? "px-2" : "px-3")}
                    >
                      <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </Button>
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="mt-auto p-2">
            <div className="text-xs text-muted-foreground text-center">
              {!collapsed && 'CementMind AI v1.0'}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  )
}
