"use client"

import { useState } from "react"
import { KPICard } from "./kpi-card"
import { MetricLineChart } from "./metric-line-chart"
import { AlertsStrip } from "./alerts-strip"
import { LogisticsWidget } from "./logistics-widget"
import { DrilldownPanel } from "./drilldown-panel"

// Mock data for demonstration
const kpiData = [
  {
    id: "energy-efficiency",
    title: "Energy Efficiency",
    value: 87.3,
    delta: 2.1,
    unit: "%",
    sparkline: [85, 86, 84, 87, 88, 87, 87.3],
    status: "ok" as const,
  },
  {
    id: "material-flow",
    title: "Material Flow Rate",
    value: 245.8,
    delta: -1.2,
    unit: "t/h",
    sparkline: [250, 248, 246, 245, 244, 246, 245.8],
    status: "warn" as const,
  },
  {
    id: "system-pressure",
    title: "System Pressure",
    value: 4.2,
    delta: 0.3,
    unit: "bar",
    sparkline: [4.1, 4.0, 4.1, 4.2, 4.3, 4.2, 4.2],
    status: "ok" as const,
  },
  {
    id: "quality-score",
    title: "Quality Score",
    value: 92.1,
    delta: -0.8,
    unit: "%",
    sparkline: [93, 92.5, 92.8, 92.2, 91.9, 92.0, 92.1],
    status: "critical" as const,
  },
]

interface DrilldownData {
  metricId: string
  title: string
  currentValue: number
  unit: string
  status: "ok" | "warn" | "critical"
  timeWindow: string
  relatedMetrics: Array<{
    name: string
    value: number
    unit: string
    trend: "up" | "down" | "stable"
  }>
  events: Array<{
    timestamp: string
    type: string
    message: string
    severity: "info" | "warning" | "error"
  }>
}

export function OverviewDashboard() {
  const [drilldownData, setDrilldownData] = useState<DrilldownData | null>(null)

  const handleKPIClick = (kpiId: string) => {
    const kpi = kpiData.find((k) => k.id === kpiId)
    if (!kpi) return

    const mockDrilldownData: DrilldownData = {
      metricId: kpi.id,
      title: kpi.title,
      currentValue: kpi.value,
      unit: kpi.unit,
      status: kpi.status,
      timeWindow: "Last 1 hour",
      relatedMetrics: [
        { name: "Peak Value", value: kpi.value * 1.1, unit: kpi.unit, trend: "up" },
        { name: "Average", value: kpi.value * 0.95, unit: kpi.unit, trend: "stable" },
        { name: "Minimum", value: kpi.value * 0.85, unit: kpi.unit, trend: "down" },
      ],
      events: [
        {
          timestamp: new Date(Date.now() - 300000).toISOString(),
          type: "Threshold",
          message: `${kpi.title} exceeded normal range`,
          severity: kpi.status === "critical" ? "error" : "warning",
        },
        {
          timestamp: new Date(Date.now() - 600000).toISOString(),
          type: "Calibration",
          message: "Sensor calibration completed",
          severity: "info",
        },
      ],
    }
    setDrilldownData(mockDrilldownData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Plant Overview</h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Live Data Stream</span>
        </div>
      </div>

      <AlertsStrip />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => (
          <div key={kpi.id} onClick={() => handleKPIClick(kpi.id)} className="cursor-pointer">
            <KPICard {...kpi} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricLineChart title="Kiln Temperature" metricKey="kiln_temperature" unit="°C" />
        <MetricLineChart title="Material Flow vs Energy" metricKey="material_flow_energy" unit="Mixed" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MetricLineChart title="System Performance Trends" metricKey="system_performance" unit="Various" />
        </div>
        <LogisticsWidget />
      </div>

      <DrilldownPanel data={drilldownData} onClose={() => setDrilldownData(null)} />
    </div>
  )
}
