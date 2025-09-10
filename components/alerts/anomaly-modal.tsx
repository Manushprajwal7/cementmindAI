"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Clock, User, AlertTriangle, TrendingUp, Settings } from "lucide-react"
import type { AnomalyDetail } from "@/types/anomaly"

interface AnomalyModalProps {
  anomaly: AnomalyDetail
  onClose: () => void
}

export function AnomalyModal({ anomaly, onClose }: AnomalyModalProps) {
  const [selectedAction, setSelectedAction] = useState("")
  const [assignee, setAssignee] = useState(anomaly.assignee || "")
  const [notes, setNotes] = useState("")

  const severityColors = {
    low: "bg-blue-100 text-blue-800 border-blue-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  }

  const statusColors = {
    new: "bg-red-100 text-red-800 border-red-200",
    acknowledged: "bg-amber-100 text-amber-800 border-amber-200",
    investigating: "bg-blue-100 text-blue-800 border-blue-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
  }

  const handleAcknowledge = () => {
    // Implementation for acknowledging the anomaly
    console.log("Acknowledging anomaly:", anomaly.id)
    onClose()
  }

  const handleSnooze = () => {
    // Implementation for snoozing the anomaly
    console.log("Snoozing anomaly:", anomaly.id)
    onClose()
  }

  const handleAssign = () => {
    // Implementation for assigning the anomaly
    console.log("Assigning anomaly:", anomaly.id, "to:", assignee)
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">{anomaly.type}</DialogTitle>
              <DialogDescription className="mt-1">Anomaly ID: {anomaly.id}</DialogDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={severityColors[anomaly.severity]}>
                {anomaly.severity.toUpperCase()}
              </Badge>
              <Badge variant="outline" className={statusColors[anomaly.status]}>
                {anomaly.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Anomaly Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                  <p className="text-sm">{new Date(anomaly.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Confidence</label>
                  <p className="text-sm font-medium">{(anomaly.confidence * 100).toFixed(1)}%</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm mt-1">{anomaly.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Affected Sensors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Affected Sensors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {anomaly.affected_sensors.map((sensor, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{sensor.sensor}</h4>
                      <Badge variant="outline" className="text-xs">
                        {sensor.deviation_percent.toFixed(1)}% deviation
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Current Value:</span>
                        <p className="font-medium">{sensor.current_value.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expected Range:</span>
                        <p className="font-medium">
                          {sensor.expected_range[0]} - {sensor.expected_range[1]}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <p className="font-medium text-red-600">Out of Range</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Potential Causes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Potential Causes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {anomaly.potential_causes.map((cause, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{cause}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recommended Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {anomaly.recommended_actions.map((action, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Button
                        variant={selectedAction === action ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedAction(selectedAction === action ? "" : action)}
                        className="flex-shrink-0"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Apply
                      </Button>
                      <span className="text-sm">{action}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Actions & Assignment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Assign to</label>
                  <Select value={assignee} onValueChange={setAssignee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="j.smith">J. Smith</SelectItem>
                      <SelectItem value="m.johnson">M. Johnson</SelectItem>
                      <SelectItem value="r.davis">R. Davis</SelectItem>
                      <SelectItem value="s.wilson">S. Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Priority</label>
                  <Select defaultValue={anomaly.severity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Notes</label>
                <Textarea
                  placeholder="Add notes about this anomaly..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleSnooze}>
              <Clock className="mr-2 h-4 w-4" />
              Snooze
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleAssign}>
              <User className="mr-2 h-4 w-4" />
              Assign
            </Button>
            <Button onClick={handleAcknowledge}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Acknowledge
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
