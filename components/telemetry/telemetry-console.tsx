"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Settings, Download, AlertTriangle, Gauge, Database, History } from "lucide-react"
import { MetricLineChart } from "@/components/dashboard/metric-line-chart"
import { HeatmapGrid } from "./heatmap-grid"
import { ScatterCorrelation } from "./scatter-correlation"
import { GaugeChart } from "./gauge-chart"
import { AnomalyTimeline } from "./anomaly-timeline"
import { MultiSeriesArea } from "./multi-series-area"
import { AlertThresholdConfig } from "./alert-threshold-config"
import { DataExportPanel } from "./data-export-panel"
import { StreamingControls } from "./streaming-controls"
import { SensorCalibration } from "./sensor-calibration"
import { PerformanceMetrics } from "./performance-metrics"
import { HistoricalReplay } from "./historical-replay"
import { useRealTimeData } from "@/hooks/use-real-time-data"

export function TelemetryConsole() {
  const [isStreaming, setIsStreaming] = useState(true)
  const [selectedMetrics, setSelectedMetrics] = useState("all")
  const [showThresholdConfig, setShowThresholdConfig] = useState(false)
  const [showExportPanel, setShowExportPanel] = useState(false)
  const [showStreamingControls, setShowStreamingControls] = useState(false)
  const [showSensorCalibration, setShowSensorCalibration] = useState(false)
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(false)
  const [showHistoricalReplay, setShowHistoricalReplay] = useState(false)
  const { connectionStatus, lastUpdate } = useRealTimeData(isStreaming)

  const toggleStreaming = () => {
    setIsStreaming(!isStreaming)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Real-Time Telemetry Console</h2>
          <p className="text-muted-foreground">Live monitoring and analysis of plant operations</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${connectionStatus === "connected" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
            />
            <span className="text-sm text-muted-foreground">
              {connectionStatus === "connected" ? "Connected" : "Disconnected"}
            </span>
          </div>

          <Select value={selectedMetrics} onValueChange={setSelectedMetrics}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metrics</SelectItem>
              <SelectItem value="temperature">Temperature Only</SelectItem>
              <SelectItem value="pressure">Pressure Only</SelectItem>
              <SelectItem value="flow">Flow Rate Only</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={toggleStreaming}>
            {isStreaming ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Button variant="outline" size="icon" onClick={() => setShowHistoricalReplay(true)}>
            <History className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={() => setShowStreamingControls(true)}>
            <Settings className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={() => setShowThresholdConfig(true)}>
            <AlertTriangle className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={() => setShowSensorCalibration(true)}>
            <Gauge className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={() => setShowExportPanel(true)}>
            <Download className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={() => setShowPerformanceMetrics(true)}>
            <Database className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {lastUpdate && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Update:</span>
              <Badge variant="outline">{lastUpdate.toLocaleTimeString()}</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {showHistoricalReplay && <HistoricalReplay onClose={() => setShowHistoricalReplay(false)} />}

      {showPerformanceMetrics && <PerformanceMetrics onClose={() => setShowPerformanceMetrics(false)} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GaugeChart title="Energy Efficiency" value={87.3} max={100} unit="%" />
        <GaugeChart title="Overall Quality Score" value={92.1} max={100} unit="%" />
        <GaugeChart title="System Health" value={94.8} max={100} unit="%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricLineChart title="Kiln Temperature (Live)" metricKey="kiln_temperature_live" unit="°C" />
        <MetricLineChart title="System Pressure (Live)" metricKey="system_pressure_live" unit="bar" />
      </div>

      <MultiSeriesArea />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScatterCorrelation />
        <HeatmapGrid />
      </div>

      <AnomalyTimeline />

      {showThresholdConfig && <AlertThresholdConfig onClose={() => setShowThresholdConfig(false)} />}

      {showExportPanel && <DataExportPanel onClose={() => setShowExportPanel(false)} />}

      {showStreamingControls && <StreamingControls onClose={() => setShowStreamingControls(false)} />}

      {showSensorCalibration && <SensorCalibration onClose={() => setShowSensorCalibration(false)} />}
    </div>
  )
}
