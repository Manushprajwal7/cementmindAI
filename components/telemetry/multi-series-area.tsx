"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface MultiSeriesData {
  time: string
  energy: number
  flow: number
  timestamp: number
}

// Generate mock multi-series data
const generateMultiSeriesData = (): MultiSeriesData[] => {
  const now = new Date()
  const data: MultiSeriesData[] = []

  for (let i = 47; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000) // Every 30 minutes
    const energy = 850 + Math.sin(i * 0.2) * 100 + Math.random() * 50
    const flow = 240 + Math.sin(i * 0.15) * 30 + Math.random() * 20

    data.push({
      time: timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      energy: Number(energy.toFixed(1)),
      flow: Number(flow.toFixed(1)),
      timestamp: timestamp.getTime(),
    })
  }

  return data
}

export function MultiSeriesArea() {
  const data = generateMultiSeriesData()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Energy Consumption vs Material Flow</CardTitle>
        <p className="text-sm text-muted-foreground">24-hour trend analysis with dual-axis visualization</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs fill-muted-foreground" />
              <YAxis yAxisId="left" className="text-xs fill-muted-foreground" />
              <YAxis yAxisId="right" orientation="right" className="text-xs fill-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                formatter={(value: number, name: string) => [
                  `${value} ${name === "energy" ? "kW" : "t/h"}`,
                  name === "energy" ? "Energy Consumption" : "Material Flow Rate",
                ]}
              />
              <Legend />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="energy"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#energyGradient)"
                name="Energy (kW)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="flow"
                stroke="hsl(var(--secondary))"
                fillOpacity={1}
                fill="url(#flowGradient)"
                name="Flow Rate (t/h)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
