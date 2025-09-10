"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, UserPlus, Clock, X, AlertTriangle } from "lucide-react"

interface BulkActionsPanelProps {
  selectedCount: number
  selectedAnomalies: string[]
  onClearSelection: () => void
  onBulkAction: (action: string, data?: any) => void
}

export function BulkActionsPanel({
  selectedCount,
  selectedAnomalies,
  onClearSelection,
  onBulkAction,
}: BulkActionsPanelProps) {
  const [assignee, setAssignee] = useState("")
  const [snoozeTime, setSnoozeTime] = useState("")

  const handleBulkAcknowledge = () => {
    onBulkAction("acknowledge")
  }

  const handleBulkAssign = () => {
    if (assignee) {
      onBulkAction("assign", { assignee })
      setAssignee("")
    }
  }

  const handleBulkSnooze = () => {
    if (snoozeTime) {
      onBulkAction("snooze", { duration: snoozeTime })
      setSnoozeTime("")
    }
  }

  const handleBulkEscalate = () => {
    onBulkAction("escalate")
  }

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {selectedCount} selected
            </Badge>

            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={handleBulkAcknowledge}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Acknowledge
              </Button>

              <div className="flex items-center space-x-1">
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue placeholder="Assign to..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="j.smith">J. Smith</SelectItem>
                    <SelectItem value="m.johnson">M. Johnson</SelectItem>
                    <SelectItem value="a.davis">A. Davis</SelectItem>
                    <SelectItem value="r.wilson">R. Wilson</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={handleBulkAssign} disabled={!assignee}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Assign
                </Button>
              </div>

              <div className="flex items-center space-x-1">
                <Select value={snoozeTime} onValueChange={setSnoozeTime}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue placeholder="Snooze..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15m">15 minutes</SelectItem>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="4h">4 hours</SelectItem>
                    <SelectItem value="24h">24 hours</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={handleBulkSnooze} disabled={!snoozeTime}>
                  <Clock className="mr-2 h-4 w-4" />
                  Snooze
                </Button>
              </div>

              <Button size="sm" variant="destructive" onClick={handleBulkEscalate}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Escalate
              </Button>
            </div>
          </div>

          <Button size="sm" variant="ghost" onClick={onClearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
