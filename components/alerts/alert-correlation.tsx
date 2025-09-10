"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, AlertTriangle, Clock } from "lucide-react"
import type { AnomalyDetail } from "@/types/anomaly"

interface CorrelationGroup {
  id: string
  name: string
  anomalies: AnomalyDetail[]
  correlation: number
  pattern: string
  timeWindow: string
}

interface AlertCorrelationProps {
  anomalies: AnomalyDetail[]
}

export function AlertCorrelation({ anomalies }: AlertCorrelationProps) {
  const [selectedTimeWindow, setSelectedTimeWindow] = useState("1h")

  // Generate correlation groups
  const generateCorrelationGroups = (): CorrelationGroup[] => {
    const groups: CorrelationGroup[] = []

    // Temperature-Pressure correlation
    const tempPressureAnomalies = anomalies
      .filter((a) => a.type.includes("Temperature") || a.type.includes("Pressure"))
      .slice(0, 5)

    if (tempPressureAnomalies.length > 1) {
      groups.push({
        id: "temp-pressure",
        name: "Temperature-Pressure Correlation",
        anomalies: tempPressureAnomalies,
        correlation: 0.87,
        pattern: "Inverse correlation detected",
        timeWindow: "15 minutes",
      })
    }

    // Quality-Flow correlation
    const qualityFlowAnomalies = anomalies
      .filter((a) => a.type.includes("Quality") || a.type.includes("Flow"))
      .slice(0, 4)

    if (qualityFlowAnomalies.length > 1) {
      groups.push({
        id: "quality-flow",
        name: "Quality-Flow Correlation",
        anomalies: qualityFlowAnomalies,
        correlation: 0.73,
        pattern: "Direct correlation observed",
        timeWindow: "30 minutes",
      })
    }

    // Energy anomalies cluster
    const energyAnomalies = anomalies.filter((a) => a.type.includes("Energy")).slice(0, 3)

    if (energyAnomalies.length > 1) {
      groups.push({
        id: "energy-cluster",
        name: "Energy System Cluster",
        anomalies: energyAnomalies,
        correlation: 0.92,
        pattern: "Cascading failure pattern",
        timeWindow: "5 minutes",
      })
    }

    return groups
  }

  const correlationGroups = generateCorrelationGroups()

  const getCorrelationColor = (correlation: number) => {
    if (correlation >= 0.8) return "text-red-600 bg-red-50"
    if (correlation >= 0.6) return "text-orange-600 bg-orange-50"
    return "text-yellow-600 bg-yellow-50"
  }

  const getPatternIcon = (pattern: string) => {
    if (pattern.includes("Inverse")) return <TrendingDown className="h-4 w-4" />
    if (pattern.includes("Direct")) return <TrendingUp className="h-4 w-4" />
    return <AlertTriangle className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alert Correlation Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{correlationGroups.length}</p>
                  <p className="text-sm text-muted-foreground">Active Correlations</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.round(
                      (correlationGroups.reduce((acc, g) => acc + g.correlation, 0) / correlationGroups.length) * 100,
                    )}
                    %
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Correlation</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {correlationGroups.reduce((acc, g) => acc + g.anomalies.length, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Related Alerts</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {correlationGroups.map((group) => (
              <Card key={group.id} className="border-l-4 border-l-orange-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold">{group.name}</h4>
                      <Badge className={getCorrelationColor(group.correlation)}>
                        {Math.round(group.correlation * 100)}% correlation
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{group.timeWindow}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Pattern Analysis</p>
                      <div className="flex items-center space-x-2 mb-2">
                        {getPatternIcon(group.pattern)}
                        <span className="text-sm">{group.pattern}</span>
                      </div>
                      <Progress value={group.correlation * 100} className="h-2" />
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Related Anomalies ({group.anomalies.length})</p>
                      <div className="space-y-1">
                        {group.anomalies.slice(0, 3).map((anomaly) => (
                          <div key={anomaly.id} className="flex items-center justify-between text-sm">
                            <span className="truncate">{anomaly.type}</span>
                            <Badge variant="outline" className="ml-2">
                              {anomaly.severity}
                            </Badge>
                          </div>
                        ))}
                        {group.anomalies.length > 3 && (
                          <p className="text-xs text-muted-foreground">+{group.anomalies.length - 3} more</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {correlationGroups.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No significant correlations detected in the current time window.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
