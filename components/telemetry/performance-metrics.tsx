"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, Activity, Zap, Database, Wifi } from "lucide-react"

interface PerformanceMetricsProps {
  onClose: () => void
}

interface PerformanceData {
  latency: number
  throughput: number
  memoryUsage: number
  cpuUsage: number
  networkBandwidth: number
  dataPoints: number
  errorRate: number
  uptime: number
}

export function PerformanceMetrics({ onClose }: PerformanceMetricsProps) {
  const [metrics, setMetrics] = useState<PerformanceData>({
    latency: 45,
    throughput: 1250,
    memoryUsage: 68,
    cpuUsage: 34,
    networkBandwidth: 85,
    dataPoints: 15420,
    errorRate: 0.02,
    uptime: 99.8,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        latency: 40 + Math.random() * 20,
        throughput: 1200 + Math.random() * 100,
        memoryUsage: 60 + Math.random() * 20,
        cpuUsage: 30 + Math.random() * 15,
        networkBandwidth: 80 + Math.random() * 15,
        dataPoints: prev.dataPoints + Math.floor(Math.random() * 10),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getPerformanceStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return "good"
    if (value <= thresholds.warning) return "warning"
    return "error"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "warning":
        return "text-amber-600"
      case "error":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>System Performance Metrics</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Real-time Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Latency</span>
              </div>
              <div className="mt-2">
                <div
                  className={`text-2xl font-bold ${getStatusColor(getPerformanceStatus(metrics.latency, { good: 50, warning: 100 }))}`}
                >
                  {metrics.latency.toFixed(1)}ms
                </div>
                <Badge variant="outline" className="mt-1">
                  {getPerformanceStatus(metrics.latency, { good: 50, warning: 100 })}
                </Badge>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Throughput</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-foreground">{metrics.throughput.toFixed(0)}</div>
                <div className="text-sm text-muted-foreground">points/sec</div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Bandwidth</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-foreground">{metrics.networkBandwidth.toFixed(1)}%</div>
                <Progress value={metrics.networkBandwidth} className="mt-2 h-2" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Uptime</span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-green-600">{metrics.uptime}%</div>
                <div className="text-sm text-muted-foreground">24h average</div>
              </div>
            </Card>
          </div>

          {/* Resource Usage */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Resource Usage</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Memory Usage</span>
                  <span>{metrics.memoryUsage.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.memoryUsage} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>CPU Usage</span>
                  <span>{metrics.cpuUsage.toFixed(1)}%</span>
                </div>
                <Progress value={metrics.cpuUsage} className="h-2" />
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{metrics.dataPoints.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Data Points Processed</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{(metrics.errorRate * 100).toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">Error Rate</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-muted-foreground">Monitoring Active</div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
