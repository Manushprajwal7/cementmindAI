"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Download, FileText, Table, BarChart3 } from "lucide-react"

interface DataExportPanelProps {
  onClose: () => void
}

export function DataExportPanel({ onClose }: DataExportPanelProps) {
  const [exportFormat, setExportFormat] = useState("csv")
  const [timeRange, setTimeRange] = useState("1h")
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["temperature", "pressure", "flow_rate"])

  const metrics = [
    { id: "temperature", label: "Kiln Temperature", unit: "°C" },
    { id: "pressure", label: "System Pressure", unit: "bar" },
    { id: "flow_rate", label: "Flow Rate", unit: "m³/h" },
    { id: "energy", label: "Energy Consumption", unit: "kWh" },
    { id: "quality", label: "Quality Metrics", unit: "%" },
    { id: "emissions", label: "Emissions", unit: "ppm" },
  ]

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics((prev) => (prev.includes(metricId) ? prev.filter((id) => id !== metricId) : [...prev, metricId]))
  }

  const handleExport = () => {
    // Implementation for data export
    console.log("Exporting data:", {
      format: exportFormat,
      timeRange,
      metrics: selectedMetrics,
    })
    onClose()
  }

  const formatIcons = {
    csv: Table,
    json: FileText,
    pdf: FileText,
    excel: BarChart3,
  }

  const FormatIcon = formatIcons[exportFormat as keyof typeof formatIcons]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Export Telemetry Data</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Format */}
          <div>
            <Label className="text-base font-semibold">Export Format</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {Object.entries(formatIcons).map(([format, Icon]) => (
                <Card
                  key={format}
                  className={`cursor-pointer transition-colors ${
                    exportFormat === format ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setExportFormat(format)}
                >
                  <CardContent className="flex items-center space-x-3 pt-4">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{format.toUpperCase()}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div>
            <Label className="text-base font-semibold">Time Range</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15m">Last 15 minutes</SelectItem>
                <SelectItem value="1h">Last 1 hour</SelectItem>
                <SelectItem value="6h">Last 6 hours</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Metrics Selection */}
          <div>
            <Label className="text-base font-semibold">Select Metrics</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {metrics.map((metric) => (
                <div key={metric.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={metric.id}
                    checked={selectedMetrics.includes(metric.id)}
                    onCheckedChange={() => handleMetricToggle(metric.id)}
                  />
                  <Label htmlFor={metric.id} className="text-sm">
                    {metric.label}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {metric.unit}
                    </Badge>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Export Summary */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between text-sm">
                <span>Selected metrics:</span>
                <Badge variant="outline">{selectedMetrics.length} metrics</Badge>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span>Estimated file size:</span>
                <Badge variant="outline">~2.4 MB</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
