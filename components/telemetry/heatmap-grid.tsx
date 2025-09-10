"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HeatmapData {
  hour: number
  day: string
  limestone: number
  clay: number
  iron_ore: number
  gypsum: number
}

// Generate mock heatmap data
const generateHeatmapData = (): HeatmapData[] => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const data: HeatmapData[] = []

  days.forEach((day, dayIndex) => {
    for (let hour = 0; hour < 24; hour++) {
      data.push({
        hour,
        day,
        limestone: 65 + Math.random() * 10,
        clay: 20 + Math.random() * 5,
        iron_ore: 8 + Math.random() * 3,
        gypsum: 5 + Math.random() * 2,
      })
    }
  })

  return data
}

export function HeatmapGrid() {
  const data = generateHeatmapData()
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const getIntensityColor = (value: number, material: string) => {
    const normalizedValue = Math.min(Math.max(value, 0), 100) / 100

    switch (material) {
      case "limestone":
        return `rgba(74, 74, 74, ${0.2 + normalizedValue * 0.8})` // Gray scale
      case "clay":
        return `rgba(199, 75, 47, ${0.2 + normalizedValue * 0.8})` // Red scale
      case "iron_ore":
        return `rgba(139, 69, 19, ${0.2 + normalizedValue * 0.8})` // Brown scale
      case "gypsum":
        return `rgba(214, 194, 156, ${0.2 + normalizedValue * 0.8})` // Sand scale
      default:
        return `rgba(74, 74, 74, ${0.2 + normalizedValue * 0.8})`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Raw Material Composition Heatmap</CardTitle>
        <p className="text-sm text-muted-foreground">Material percentages over the past week</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {["limestone", "clay", "iron_ore", "gypsum"].map((material) => (
            <div key={material} className="space-y-2">
              <h4 className="text-sm font-medium capitalize">{material.replace("_", " ")}</h4>
              <div className="grid grid-cols-24 gap-1">
                {hours.map((hour) => (
                  <div key={hour} className="text-xs text-center text-muted-foreground">
                    {hour % 6 === 0 ? hour : ""}
                  </div>
                ))}
                {days.map((day) =>
                  hours.map((hour) => {
                    const dataPoint = data.find((d) => d.day === day && d.hour === hour)
                    const value = dataPoint ? (dataPoint[material as keyof HeatmapData] as number) : 0
                    return (
                      <div
                        key={`${day}-${hour}`}
                        className="aspect-square rounded-sm border border-border/20 cursor-pointer hover:border-border transition-colors"
                        style={{
                          backgroundColor: getIntensityColor(value, material),
                        }}
                        title={`${day} ${hour}:00 - ${value.toFixed(1)}%`}
                      />
                    )
                  }),
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
