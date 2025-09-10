"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { AlertTriangle } from "lucide-react"

interface CriticalAlert {
  id: string
  type: string
  message: string
  timestamp: Date
}

export function LiveEventToast() {
  const [alerts, setAlerts] = useState<CriticalAlert[]>([])

  useEffect(() => {
    // Simulate critical alerts every 30 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of critical alert
        const newAlert: CriticalAlert = {
          id: `critical-${Date.now()}`,
          type: "Critical Temperature Alert",
          message: "Kiln temperature exceeded critical threshold (1600°C)",
          timestamp: new Date(),
        }

        setAlerts((prev) => [...prev, newAlert])

        // Show toast notification
        toast.error(newAlert.message, {
          description: `${newAlert.type} - ${newAlert.timestamp.toLocaleTimeString()}`,
          duration: 10000, // 10 seconds
          action: {
            label: "Acknowledge",
            onClick: () => {
              setAlerts((prev) => prev.filter((alert) => alert.id !== newAlert.id))
            },
          },
          icon: <AlertTriangle className="h-4 w-4" />,
        })
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return null // This component only manages toasts, no UI
}
