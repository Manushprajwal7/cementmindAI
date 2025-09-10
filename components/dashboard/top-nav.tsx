"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, User, ChevronDown } from "lucide-react"
import { NotificationPanel } from "./notification-panel"

export function TopNav() {
  const [selectedPlant, setSelectedPlant] = useState("plant-1")
  const [timeRange, setTimeRange] = useState("live")
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-6 z-50">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">CM</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">CementMind AI</h1>
        </div>

        <Select value={selectedPlant} onValueChange={setSelectedPlant}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Plant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="plant-1">Plant 1 - Main Facility</SelectItem>
            <SelectItem value="plant-2">Plant 2 - North Site</SelectItem>
            <SelectItem value="plant-3">Plant 3 - South Site</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="5m">5 min</SelectItem>
            <SelectItem value="15m">15 min</SelectItem>
            <SelectItem value="1h">1 hour</SelectItem>
            <SelectItem value="24h">24 hours</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <NotificationPanel />
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>J. Smith</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
