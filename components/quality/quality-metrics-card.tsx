"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface QualityMetricsCardProps {
  title: string
  value: number
  unit: string
  score: number
  target: number
  trend: "improving" | "declining" | "stable"
}

export function QualityMetricsCard({ title, value, unit, score, target, trend }: QualityMetricsCardProps) {
  const deviation = ((value - target) / target) * 100
  const isOnTarget = Math.abs(deviation) <= 5

  const trendIcons = {
    improving: TrendingUp,
    declining: TrendingDown,
    stable: Minus,
  }

  const trendColors = {
    improving: "text-green-600",
    declining: "text-red-600",
    stable: "text-muted-foreground",
  }

  const TrendIcon = trendIcons[trend]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Badge variant={isOnTarget ? "default" : "destructive"} className="text-xs">
          {isOnTarget ? "On Target" : "Off Target"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="text-2xl font-bold text-foreground">
              {value.toFixed(title === "Fineness" ? 0 : 1)}
              <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Target: {target} {unit}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Quality Score</span>
              <span className="font-medium">{score.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all",
                  score >= 90 ? "bg-green-500" : score >= 80 ? "bg-amber-500" : "bg-red-500",
                )}
                style={{ width: `${Math.min(score, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className={cn("flex items-center space-x-1 text-sm", trendColors[trend])}>
              <TrendIcon className="h-4 w-4" />
              <span className="capitalize">{trend}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {deviation > 0 ? "+" : ""}
              {deviation.toFixed(1)}% vs target
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
