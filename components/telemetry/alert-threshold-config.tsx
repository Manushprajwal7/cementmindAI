"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Trash2, Save } from "lucide-react"

interface ThresholdRule {
  id: string
  sensor: string
  parameter: string
  condition: "above" | "below" | "outside_range"
  value: number
  maxValue?: number
  severity: "low" | "medium" | "high" | "critical"
  enabled: boolean
  description: string
}

interface AlertThresholdConfigProps {
  onClose: () => void
}

export function AlertThresholdConfig({ onClose }: AlertThresholdConfigProps) {
  const [thresholds, setThresholds] = useState<ThresholdRule[]>([
    {
      id: "1",
      sensor: "Kiln Temperature",
      parameter: "temperature",
      condition: "above",
      value: 1500,
      severity: "high",
      enabled: true,
      description: "High temperature alert for kiln safety",
    },
    {
      id: "2",
      sensor: "System Pressure",
      parameter: "pressure",
      condition: "below",
      value: 2.5,
      severity: "medium",
      enabled: true,
      description: "Low pressure warning for system efficiency",
    },
  ])

  const [newThreshold, setNewThreshold] = useState<Partial<ThresholdRule>>({
    sensor: "",
    parameter: "",
    condition: "above",
    value: 0,
    severity: "medium",
    enabled: true,
    description: "",
  })

  const addThreshold = () => {
    if (newThreshold.sensor && newThreshold.parameter && newThreshold.value) {
      const threshold: ThresholdRule = {
        id: Date.now().toString(),
        sensor: newThreshold.sensor!,
        parameter: newThreshold.parameter!,
        condition: newThreshold.condition!,
        value: newThreshold.value!,
        maxValue: newThreshold.maxValue,
        severity: newThreshold.severity!,
        enabled: newThreshold.enabled!,
        description: newThreshold.description!,
      }
      setThresholds([...thresholds, threshold])
      setNewThreshold({
        sensor: "",
        parameter: "",
        condition: "above",
        value: 0,
        severity: "medium",
        enabled: true,
        description: "",
      })
    }
  }

  const removeThreshold = (id: string) => {
    setThresholds(thresholds.filter((t) => t.id !== id))
  }

  const toggleThreshold = (id: string) => {
    setThresholds(thresholds.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)))
  }

  const severityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Alert Threshold Configuration</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Thresholds */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Thresholds</h3>
            {thresholds.map((threshold) => (
              <Card key={threshold.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Switch checked={threshold.enabled} onCheckedChange={() => toggleThreshold(threshold.id)} />
                    <div>
                      <div className="font-medium">{threshold.sensor}</div>
                      <div className="text-sm text-muted-foreground">
                        {threshold.condition} {threshold.value}
                        {threshold.maxValue && ` - ${threshold.maxValue}`}
                      </div>
                    </div>
                    <Badge className={severityColors[threshold.severity]}>{threshold.severity}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeThreshold(threshold.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Add New Threshold */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Add New Threshold</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sensor">Sensor</Label>
                <Select
                  value={newThreshold.sensor}
                  onValueChange={(value) => setNewThreshold({ ...newThreshold, sensor: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sensor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kiln Temperature">Kiln Temperature</SelectItem>
                    <SelectItem value="System Pressure">System Pressure</SelectItem>
                    <SelectItem value="Flow Rate">Flow Rate</SelectItem>
                    <SelectItem value="Energy Consumption">Energy Consumption</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={newThreshold.condition}
                  onValueChange={(value: any) => setNewThreshold({ ...newThreshold, condition: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Above</SelectItem>
                    <SelectItem value="below">Below</SelectItem>
                    <SelectItem value="outside_range">Outside Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="value">Threshold Value</Label>
                <Input
                  type="number"
                  value={newThreshold.value}
                  onChange={(e) => setNewThreshold({ ...newThreshold, value: Number.parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={newThreshold.severity}
                  onValueChange={(value: any) => setNewThreshold({ ...newThreshold, severity: value })}
                >
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
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  value={newThreshold.description}
                  onChange={(e) => setNewThreshold({ ...newThreshold, description: e.target.value })}
                  placeholder="Describe this threshold rule"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={addThreshold}>
                <Plus className="mr-2 h-4 w-4" />
                Add Threshold
              </Button>
            </div>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
