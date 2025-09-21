"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useEffect, useState } from "react"

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

  // Generate more data points with more variation
  for (let i = 47; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000) // Every 30 minutes
    
    // Create more realistic patterns with trends, cycles, and random variations
    const timeOfDay = (24 + timestamp.getHours()) % 24 // 0-23 hour cycle
    const dayFactor = Math.sin(timeOfDay * Math.PI / 12) * 0.3 + 0.7 // Daily cycle factor
    
    // Base values with cyclical patterns
    const energyBase = 850 + Math.sin(i * 0.2) * 120
    const flowBase = 240 + Math.cos(i * 0.15) * 40
    
    // Add random variations and spikes
    const energyNoise = Math.random() * 80 - 40
    const flowNoise = Math.random() * 30 - 15
    const energySpike = i % 12 === 0 ? (Math.random() > 0.7 ? 150 : 0) : 0
    const flowSpike = i % 10 === 0 ? (Math.random() > 0.7 ? 50 : 0) : 0
    
    // Calculate final values with daily cycle factor
    const energy = (energyBase + energyNoise + energySpike) * dayFactor
    const flow = (flowBase + flowNoise + flowSpike) * dayFactor

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
  const [data, setData] = useState<MultiSeriesData[]>(generateMultiSeriesData())
  
  // Update data every 3 seconds to simulate real-time changes
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = [...data];
      
      // Update the most recent data point with random variations
      if (newData.length > 0) {
        const lastIndex = newData.length - 1;
        newData[lastIndex] = {
          ...newData[lastIndex],
          energy: newData[lastIndex].energy + (Math.random() * 40 - 20),
          flow: newData[lastIndex].flow + (Math.random() * 15 - 7.5),
        };
        
        // Occasionally add a new data point
        if (Math.random() > 0.7) {
          const lastTime = new Date(newData[lastIndex].timestamp);
          const newTime = new Date(lastTime.getTime() + 30 * 60 * 1000);
          
          newData.push({
            time: newTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            energy: newData[lastIndex].energy + (Math.random() * 60 - 30),
            flow: newData[lastIndex].flow + (Math.random() * 20 - 10),
            timestamp: newTime.getTime(),
          });
          
          // Remove oldest data point if we have more than 48
          if (newData.length > 48) {
            newData.shift();
          }
        }
      }
      
      setData(newData);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Energy Consumption vs Material Flow</CardTitle>
        <p className="text-sm text-muted-foreground">Real-time trend analysis with dual-axis visualization <span className="text-green-500 ml-2">(Live Data)</span></p>
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
