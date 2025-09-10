"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GaugeChartProps {
  title: string
  value: number
  max: number
  unit: string
}

export function GaugeChart({ title, value, max, unit }: GaugeChartProps) {
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
