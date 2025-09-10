"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react"
import { useState } from "react"

interface Notification {
  id: string
  type: "alert" | "info" | "success"
  title: string
  message: string
  timestamp: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "High Temperature Alert",
    message: "Kiln temperature exceeded 1450°C threshold",
    timestamp: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "Maintenance Scheduled",
    message: "Routine maintenance for Crusher Unit 2 at 14:00",
    timestamp: "15 min ago",
    read: false,
  },
  {
    id: "3",
    type: "success",
    title: "Quality Check Passed",
    message: "Batch #2024-0910-001 meets all quality standards",
    timestamp: "1 hour ago",
    read: true,
  },
]

export function NotificationPanel() {
  const [notifications, setNotifications] = useState(mockNotifications)

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="w-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          <Badge variant="secondary" className="text-xs">
            {notifications.filter((n) => !n.read).length} new
          </Badge>
        </div>
      </div>

      <ScrollArea className="h-80">
        <div className="p-2">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg mb-2 border transition-colors ${
                  notification.read ? "bg-muted/50 border-border" : "bg-card border-primary/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNotification(notification.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {notifications.length > 0 && (
        <div className="p-4 border-t border-border">
          <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={() => setNotifications([])}>
            Clear All
          </Button>
        </div>
      )}
    </div>
  )
}
