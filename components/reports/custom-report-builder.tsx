"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Eye, Save, BarChart3, PieChart, LineChart } from "lucide-react"

interface ReportField {
  id: string
  name: string
  type: "metric" | "chart" | "table" | "text"
  source: string
  config?: any
}

interface CustomReport {
  id: string
  name: string
  description: string
  fields: ReportField[]
  filters: any[]
  layout: "single-column" | "two-column" | "grid"
}

const availableMetrics = [
  { id: "production_volume", name: "Production Volume", source: "production" },
  { id: "quality_score", name: "Quality Score", source: "quality" },
  { id: "energy_consumption", name: "Energy Consumption", source: "sensors" },
  { id: "truck_efficiency", name: "Truck Efficiency", source: "logistics" },
  { id: "anomaly_count", name: "Anomaly Count", source: "alerts" },
  { id: "downtime_hours", name: "Downtime Hours", source: "maintenance" },
]

const availableCharts = [
  { id: "production_trend", name: "Production Trend", type: "line" },
  { id: "quality_distribution", name: "Quality Distribution", type: "pie" },
  { id: "energy_usage", name: "Energy Usage", type: "bar" },
  { id: "delivery_performance", name: "Delivery Performance", type: "bar" },
]

export function CustomReportBuilder() {
  const [currentReport, setCurrentReport] = useState<CustomReport>({
    id: "",
    name: "",
    description: "",
    fields: [],
    filters: [],
    layout: "single-column",
  })
  const [activeTab, setActiveTab] = useState("design")
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [selectedCharts, setSelectedCharts] = useState<string[]>([])

  const addField = (type: "metric" | "chart" | "table" | "text", source?: string) => {
    const newField: ReportField = {
      id: Date.now().toString(),
      name: type === "metric" ? `New ${type}` : `New ${type}`,
      type,
      source: source || "production",
    }

    setCurrentReport((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
    }))
  }

  const removeField = (fieldId: string) => {
    setCurrentReport((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== fieldId),
    }))
  }

  const updateField = (fieldId: string, updates: Partial<ReportField>) => {
    setCurrentReport((prev) => ({
      ...prev,
      fields: prev.fields.map((field) => (field.id === fieldId ? { ...field, ...updates } : field)),
    }))
  }

  const saveReport = () => {
    console.log("[v0] Saving custom report:", currentReport)
    // Simulate save
  }

  const previewReport = () => {
    console.log("[v0] Previewing report:", currentReport)
    // Simulate preview
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Custom Report Builder</h3>
          <p className="text-muted-foreground">Design and build custom reports with drag-and-drop interface</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={previewReport}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={saveReport} className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            Save Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="data">Data Sources</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
                <CardDescription>Basic report settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Report Name</label>
                  <Input
                    placeholder="Enter report name"
                    value={currentReport.name}
                    onChange={(e) => setCurrentReport((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Enter report description"
                    value={currentReport.description}
                    onChange={(e) => setCurrentReport((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Layout</label>
                  <Select
                    value={currentReport.layout}
                    onValueChange={(value: any) => setCurrentReport((prev) => ({ ...prev, layout: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-column">Single Column</SelectItem>
                      <SelectItem value="two-column">Two Column</SelectItem>
                      <SelectItem value="grid">Grid Layout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Component Library */}
            <Card>
              <CardHeader>
                <CardTitle>Component Library</CardTitle>
                <CardDescription>Drag components to build your report</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Metrics</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" onClick={() => addField("metric")} className="justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      KPI Card
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => addField("table")} className="justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Data Table
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Charts</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addField("chart", "line")}
                      className="justify-start"
                    >
                      <LineChart className="w-4 h-4 mr-2" />
                      Line Chart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addField("chart", "bar")}
                      className="justify-start"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Bar Chart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addField("chart", "pie")}
                      className="justify-start"
                    >
                      <PieChart className="w-4 h-4 mr-2" />
                      Pie Chart
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Content</h4>
                  <Button size="sm" variant="outline" onClick={() => addField("text")} className="justify-start w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Text Block
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Report Canvas */}
            <Card>
              <CardHeader>
                <CardTitle>Report Canvas</CardTitle>
                <CardDescription>Your report layout</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 min-h-96">
                  {currentReport.fields.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <p className="text-muted-foreground">Drag components here to build your report</p>
                    </div>
                  ) : (
                    currentReport.fields.map((field) => (
                      <div key={field.id} className="border rounded-lg p-4 bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {field.type === "metric" && <BarChart3 className="w-4 h-4" />}
                            {field.type === "chart" && <LineChart className="w-4 h-4" />}
                            {field.type === "table" && <BarChart3 className="w-4 h-4" />}
                            <span className="font-medium">{field.name}</span>
                            <Badge variant="secondary">{field.type}</Badge>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => removeField(field.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Input
                            placeholder="Component name"
                            value={field.name}
                            onChange={(e) => updateField(field.id, { name: e.target.value })}
                          />
                          <Select
                            value={field.source}
                            onValueChange={(value) => updateField(field.id, { source: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select data source" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="production">Production</SelectItem>
                              <SelectItem value="quality">Quality</SelectItem>
                              <SelectItem value="logistics">Logistics</SelectItem>
                              <SelectItem value="sensors">Sensors</SelectItem>
                              <SelectItem value="alerts">Alerts</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Metrics</CardTitle>
                <CardDescription>Select metrics to include in your report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableMetrics.map((metric) => (
                    <div key={metric.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={metric.id}
                        checked={selectedMetrics.includes(metric.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedMetrics((prev) => [...prev, metric.id])
                          } else {
                            setSelectedMetrics((prev) => prev.filter((id) => id !== metric.id))
                          }
                        }}
                      />
                      <div className="flex-1">
                        <label htmlFor={metric.id} className="text-sm font-medium cursor-pointer">
                          {metric.name}
                        </label>
                        <p className="text-xs text-muted-foreground">Source: {metric.source}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Charts</CardTitle>
                <CardDescription>Select charts to include in your report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableCharts.map((chart) => (
                    <div key={chart.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={chart.id}
                        checked={selectedCharts.includes(chart.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCharts((prev) => [...prev, chart.id])
                          } else {
                            setSelectedCharts((prev) => prev.filter((id) => id !== chart.id))
                          }
                        }}
                      />
                      <div className="flex-1">
                        <label htmlFor={chart.id} className="text-sm font-medium cursor-pointer">
                          {chart.name}
                        </label>
                        <p className="text-xs text-muted-foreground">Type: {chart.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="filters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Filters</CardTitle>
              <CardDescription>Configure filters for your report data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Date Range</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-7-days">Last 7 days</SelectItem>
                        <SelectItem value="last-30-days">Last 30 days</SelectItem>
                        <SelectItem value="last-quarter">Last quarter</SelectItem>
                        <SelectItem value="custom">Custom range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Plant Location</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select plant" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Plants</SelectItem>
                        <SelectItem value="plant-1">Plant 1 - Main</SelectItem>
                        <SelectItem value="plant-2">Plant 2 - North</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Production Line</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select line" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Lines</SelectItem>
                        <SelectItem value="line-1">Line 1</SelectItem>
                        <SelectItem value="line-2">Line 2</SelectItem>
                        <SelectItem value="line-3">Line 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Filter
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>Preview how your report will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center min-h-96">
                <p className="text-muted-foreground mb-4">Report preview will be displayed here</p>
                <p className="text-sm text-muted-foreground">Report: {currentReport.name || "Untitled Report"}</p>
                <p className="text-sm text-muted-foreground">Components: {currentReport.fields.length}</p>
                <p className="text-sm text-muted-foreground">Layout: {currentReport.layout}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
