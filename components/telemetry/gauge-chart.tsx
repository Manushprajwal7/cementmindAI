"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface GaugeChartProps {
  title: string
  value?: number
  max: number
  unit: string
}

export function GaugeChart({ title, value: initialValue, max, unit }: GaugeChartProps) {
  // Use state to manage the value with random changes
  const [value, setValue] = useState(initialValue || Math.random() * max * 0.8 + max * 0.1)
  
  // Update value randomly every few seconds to simulate real-time data
  useEffect(() => {
    // Comment out real-time data fetching code
    /*
    // This would be the code to fetch real-time data from an API
    const fetchRealTimeData = async () => {
      try {
        const response = await fetch(`/api/telemetry/gauge/${title}`);
        const data = await response.json();
        setValue(data.value);
      } catch (error) {
        console.error('Failed to fetch real-time data:', error);
      }
    };
    */
    
    // Instead, use random data generation
    const interval = setInterval(() => {
      // Generate a random value that's somewhat close to the previous value
      const randomChange = (Math.random() - 0.5) * (max * 0.1)
      const newValue = Math.max(0, Math.min(max, value + randomChange))
      setValue(newValue)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [title, max, value])
  
  const percentage = (value / max) * 100
  const strokeDasharray = 2 * Math.PI * 45 // Circumference for radius 45
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100

  const getColor = (percentage: number) => {
    if (percentage >= 90) return "hsl(var(--chart-1))" // Green
    if (percentage >= 70) return "hsl(var(--chart-4))" // Amber
    return "hsl(var(--destructive))" // Red
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              className="opacity-20"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={getColor(percentage)}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{value.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="text-sm text-muted-foreground">{percentage.toFixed(1)}% of maximum</div>
        </div>
      </CardContent>
    </Card>
  )
}
