"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ScatterDataPoint {
  x: number
  y: number
  isAnomaly: boolean
  timestamp: string
}

// Generate mock scatter data
const generateScatterData = (): ScatterDataPoint[] => {
  const data: ScatterDataPoint[] = []
  const now = new Date()

  for (let i = 0; i < 100; i++) {
    const timestamp = new Date(now.getTime() - i * 60000) // Every minute
    const baseTemp = 1450 + Math.sin(i * 0.1) * 50
    const basePressure = 4.2 + Math.sin(i * 0.15) * 0.5

    // Add some noise
    const temp = baseTemp + (Math.random() - 0.5) * 20
    const pressure = basePressure + (Math.random() - 0.5) * 0.3

    // Determine if it's an anomaly (outside normal correlation)
    const expectedPressure = 2.5 + (temp - 1400) * 0.002
    const deviation = Math.abs(pressure - expectedPressure)
    const isAnomaly = deviation > 0.4

    data.push({
      x: temp,
      y: pressure,
      isAnomaly,
      timestamp: timestamp.toLocaleTimeString(),
    })
  }

  return data
}

export function ScatterCorrelation() {
  const data = generateScatterData()
  const normalData = data.filter((d) => !d.isAnomaly)
  const anomalyData = data.filter((d) => d.isAnomaly)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Temperature vs Pressure Correlation</CardTitle>
        <p className="text-sm text-muted-foreground">Real-time correlation analysis with anomaly detection</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                type="number"
                dataKey="x"
                name="Temperature"
                unit="°C"
                domain={["dataMin - 10", "dataMax + 10"]}
                className="text-xs fill-muted-foreground"
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Pressure"
                unit="bar"
                domain={["dataMin - 0.2", "dataMax + 0.2"]}
                className="text-xs fill-muted-foreground"
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)} ${name === "x" ? "°C" : "bar"}`,
                  name === "x" ? "Temperature" : "Pressure",
                ]}
              />
              <Scatter name="Normal" data={normalData} fill="hsl(var(--primary))" />
              <Scatter name="Anomaly" data={anomalyData} fill="hsl(var(--destructive))" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Normal Operation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span>Anomaly Detected</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
