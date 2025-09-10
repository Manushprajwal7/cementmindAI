"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { useState } from "react"

interface AnomalyEvent {
  id: string
  timestamp: Date
  type: string
  severity: "low" | "medium" | "high" | "critical"
  confidence: number
  description: string
}

// Generate mock anomaly events
const generateAnomalyEvents = (): AnomalyEvent[] => {
  const now = new Date()
  const events: AnomalyEvent[] = []

  const anomalyTypes = [
    "Temperature Spike",
    "Pressure Drop",
    "Flow Irregularity",
    "Energy Anomaly",
    "Quality Deviation",
  ]

  const severities: Array<"low" | "medium" | "high" | "critical"> = ["low", "medium", "high", "critical"]

  for (let i = 0; i < 20; i++) {
    const timestamp = new Date(now.getTime() - i * 15 * 60 * 1000) // Every 15 minutes
    const type = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]

    events.push({
      id: `anomaly-${i}`,
      timestamp,
      type,
      severity,
      confidence: 0.6 + Math.random() * 0.4,
      description: `${type} detected in system monitoring`,
    })
  }

  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function AnomalyTimeline() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const events = generateAnomalyEvents()

  const severityColors = {
    low: "bg-blue-500",
    medium: "bg-amber-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
  }

  const severityTextColors = {
    low: "text-blue-700 bg-blue-100",
    medium: "text-amber-700 bg-amber-100",
    high: "text-orange-700 bg-orange-100",
    critical: "text-red-700 bg-red-100",
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Anomaly Timeline</CardTitle>
            <p className="text-sm text-muted-foreground">Historical anomaly events with replay controls</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

            {/* Timeline events */}
            <div className="space-y-4">
              {events.slice(0, 10).map((event, index) => (
                <div key={event.id} className="relative flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div
                    className={`relative z-10 w-3 h-3 rounded-full ${severityColors[event.severity]} ring-4 ring-background`}
                  />

                  {/* Event content */}
                  <div className="flex-1 min-w-0 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-foreground">{event.type}</h4>
                        <Badge variant="outline" className={severityTextColors[event.severity]}>
                          {event.severity}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{event.timestamp.toLocaleTimeString()}</div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>Confidence: {(event.confidence * 100).toFixed(1)}%</span>
                      <span>ID: {event.id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {events.slice(0, 10).length} of {events.length} events
            </div>
            <Button variant="outline" size="sm">
              Load More Events
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
