"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, Gauge, CheckCircle, AlertCircle, Play } from "lucide-react"

interface SensorCalibrationProps {
  onClose: () => void
}

interface CalibrationStatus {
  sensor: string
  status: "good" | "warning" | "error"
  lastCalibrated: string
  accuracy: number
  drift: number
}

export function SensorCalibration({ onClose }: SensorCalibrationProps) {
  const [calibrationData, setCalibrationData] = useState<CalibrationStatus[]>([
    {
      sensor: "Kiln Temperature Sensor 1",
      status: "good",
      lastCalibrated: "2024-01-15",
      accuracy: 99.2,
      drift: 0.3,
    },
    {
      sensor: "Pressure Sensor A",
      status: "warning",
      lastCalibrated: "2024-01-10",
      accuracy: 96.8,
      drift: 1.2,
    },
    {
      sensor: "Flow Meter B",
      status: "error",
      lastCalibrated: "2024-01-05",
      accuracy: 92.1,
      drift: 3.8,
    },
  ])

  const [calibratingSensor, setCalibratingSensor] = useState<string | null>(null)
  const [calibrationProgress, setCalibrationProgress] = useState(0)

  const startCalibration = (sensor: string) => {
    setCalibratingSensor(sensor)
    setCalibrationProgress(0)

    // Simulate calibration progress
    const interval = setInterval(() => {
      setCalibrationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setCalibratingSensor(null)
          // Update sensor status
          setCalibrationData((prev) =>
            prev.map((s) =>
              s.sensor === sensor
                ? {
                    ...s,
                    status: "good" as const,
                    accuracy: 99.5,
                    drift: 0.1,
                    lastCalibrated: new Date().toISOString().split("T")[0],
                  }
                : s,
            ),
          )
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-amber-100 text-amber-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Gauge className="h-5 w-5" />
            <span>Sensor Calibration</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {calibrationData.map((sensor) => (
            <Card key={sensor.sensor} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(sensor.status)}
                  <div>
                    <div className="font-medium">{sensor.sensor}</div>
                    <div className="text-sm text-muted-foreground">Last calibrated: {sensor.lastCalibrated}</div>
                  </div>
                  <Badge className={getStatusColor(sensor.status)}>{sensor.status}</Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">Accuracy: {sensor.accuracy}%</div>
                    <div className="text-sm text-muted-foreground">Drift: {sensor.drift}%</div>
                  </div>
                  {calibratingSensor === sensor.sensor ? (
                    <div className="w-32">
                      <Progress value={calibrationProgress} className="h-2" />
                      <div className="text-xs text-center mt-1">{calibrationProgress}%</div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startCalibration(sensor.sensor)}
                      disabled={calibratingSensor !== null}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Calibrate
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {/* Manual Calibration */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">Manual Calibration</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="reference-value">Reference Value</Label>
                <Input id="reference-value" type="number" placeholder="Enter known value" />
              </div>
              <div>
                <Label htmlFor="measured-value">Measured Value</Label>
                <Input id="measured-value" type="number" placeholder="Current reading" />
              </div>
              <div className="flex items-end">
                <Button className="w-full">Apply Calibration</Button>
              </div>
            </div>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
