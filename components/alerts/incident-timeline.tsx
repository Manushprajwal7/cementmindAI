"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, AlertTriangle, CheckCircle2, User, MessageSquare } from "lucide-react"
import type { AnomalyDetail } from "@/types/anomaly"

interface TimelineEvent {
  id: string
  timestamp: string
  type: "alert" | "action" | "comment" | "escalation"
  title: string
  description: string
  user?: string
  severity?: "low" | "medium" | "high" | "critical"
  anomalyId?: string
}

interface IncidentTimelineProps {
  anomalies: AnomalyDetail[]
}

export function IncidentTimeline({ anomalies }: IncidentTimelineProps) {
  const [timeRange, setTimeRange] = useState("24h")
  const [eventFilter, setEventFilter] = useState("all")

  // Generate timeline events from anomalies
  const generateTimelineEvents = (): TimelineEvent[] => {
    const events: TimelineEvent[] = []

    anomalies.slice(0, 20).forEach((anomaly, index) => {
      // Alert event
      events.push({
        id: `alert-${anomaly.id}`,
        timestamp: anomaly.timestamp,
        type: "alert",
        title: `${anomaly.type} Detected`,
        description: anomaly.description,
        severity: anomaly.severity,
        anomalyId: anomaly.id,
      })

      // Action events
      if (anomaly.status !== "new") {
        const actionTime = new Date(new Date(anomaly.timestamp).getTime() + 5 * 60 * 1000)
        events.push({
          id: `action-${anomaly.id}`,
          timestamp: actionTime.toISOString(),
          type: "action",
          title: `Alert ${anomaly.status}`,
          description: `Status changed to ${anomaly.status}`,
          user: anomaly.assignee || "System",
          anomalyId: anomaly.id,
        })
      }

      // Random comments
      if (Math.random() > 0.7) {
        const commentTime = new Date(new Date(anomaly.timestamp).getTime() + 10 * 60 * 1000)
        events.push({
          id: `comment-${anomaly.id}`,
          timestamp: commentTime.toISOString(),
          type: "comment",
          title: "Investigation Update",
          description: "Checked equipment calibration, values within normal range",
          user: "J. Smith",
          anomalyId: anomaly.id,
        })
      }
    })

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const timelineEvents = generateTimelineEvents()

  const filteredEvents = timelineEvents.filter((event) => {
    if (eventFilter === "all") return true
    return event.type === eventFilter
  })

  const getEventIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-4 w-4" />
      case "action":
        return <CheckCircle2 className="h-4 w-4" />
      case "comment":
        return <MessageSquare className="h-4 w-4" />
      case "escalation":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-200"
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Incident Timeline</CardTitle>
            <div className="flex space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="6h">Last 6 Hours</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                </SelectContent>
              </Select>
              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="alert">Alerts</SelectItem>
                  <SelectItem value="action">Actions</SelectItem>
                  <SelectItem value="comment">Comments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="flex space-x-4">
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full border-2 ${getSeverityColor(event.severity)}`}>
                    {getEventIcon(event.type)}
                  </div>
                  {index < filteredEvents.length - 1 && <div className="w-px h-8 bg-border mt-2" />}
                </div>

                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">{event.title}</h4>
                    <div className="flex items-center space-x-2">
                      {event.severity && (
                        <Badge variant="outline" className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{event.description}</p>

                  {event.user && (
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{event.user}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
