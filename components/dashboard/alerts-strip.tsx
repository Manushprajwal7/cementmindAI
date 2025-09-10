"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, X, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AlertItem {
  id: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  message: string
  timestamp: string
  acknowledged: boolean
}

const mockAlerts: AlertItem[] = [
  {
    id: "1",
    type: "Temperature Anomaly",
    severity: "critical",
    message: "Kiln temperature exceeded threshold (1520°C) in Zone 3",
    timestamp: "2 min ago",
    acknowledged: false,
  },
  {
    id: "2",
    type: "Flow Rate Warning",
    severity: "medium",
    message: "Material flow rate below optimal range (220 t/h)",
    timestamp: "5 min ago",
    acknowledged: false,
  },
  {
    id: "3",
    type: "Pressure Alert",
    severity: "high",
    message: "System pressure fluctuation detected in main line",
    timestamp: "8 min ago",
    acknowledged: true,
  },
]

export function AlertsStrip() {
  const activeAlerts = mockAlerts.filter((alert) => !alert.acknowledged)

  if (activeAlerts.length === 0) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <AlertTriangle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          All systems operating normally. No active alerts.
        </AlertDescription>
      </Alert>
    )
  }

  const severityColors = {
    low: "bg-blue-100 text-blue-800 border-blue-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Active Alerts</h3>
        <Badge variant="destructive" className="animate-pulse">
          {activeAlerts.length} Active
        </Badge>
      </div>

      <div className="space-y-2">
        {activeAlerts.map((alert) => (
          <Alert
            key={alert.id}
            className={cn("border-l-4", {
              "border-l-blue-500": alert.severity === "low",
              "border-l-amber-500": alert.severity === "medium",
              "border-l-orange-500": alert.severity === "high",
              "border-l-red-500": alert.severity === "critical",
            })}
          >
            <AlertTriangle className="h-4 w-4" />
            <div className="flex items-center justify-between w-full">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">{alert.type}</span>
                  <Badge variant="outline" className={cn("text-xs", severityColors[alert.severity])}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {alert.timestamp}
                  </div>
                </div>
                <AlertDescription className="text-sm">{alert.message}</AlertDescription>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button variant="outline" size="sm">
                  Acknowledge
                </Button>
                <Button variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Alert>
        ))}
      </div>
    </div>
  )
}
