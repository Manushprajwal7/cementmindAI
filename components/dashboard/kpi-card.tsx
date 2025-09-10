"use client"

import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardProps {
  id: string
  title: string
  value: number
  delta: number
  unit: string
  sparkline: number[]
  status: "ok" | "warn" | "critical"
}

export function KPICard({ title, value, delta, unit, sparkline, status }: KPICardProps) {
  const statusColors = {
    ok: "bg-green-100 text-green-800 border-green-200",
    warn: "bg-amber-100 text-amber-800 border-amber-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  }

  const deltaIcon = delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus
  const deltaColor = delta > 0 ? "text-green-600" : delta < 0 ? "text-red-600" : "text-muted-foreground"

  // Simple sparkline using CSS
  const maxValue = Math.max(...sparkline)
  const minValue = Math.min(...sparkline)
  const range = maxValue - minValue || 1

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Badge variant="outline" className={cn("text-xs", statusColors[status])}>
          {status.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold text-foreground">
            {value.toFixed(1)}
            <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className={cn("flex items-center space-x-1 text-sm", deltaColor)}>
            {React.createElement(deltaIcon, { className: "h-4 w-4" })}
            <span>{Math.abs(delta).toFixed(1)}%</span>
          </div>

          <div className="flex items-end space-x-1 h-8">
            {sparkline.map((point, index) => {
              const height = ((point - minValue) / range) * 24 + 4
              return <div key={index} className="w-1 bg-primary/60 rounded-sm" style={{ height: `${height}px` }} />
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
