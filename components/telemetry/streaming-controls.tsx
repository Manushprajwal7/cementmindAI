"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Save, RotateCcw } from "lucide-react"

interface StreamingControlsProps {
  onClose: () => void
}

export function StreamingControls({ onClose }: StreamingControlsProps) {
  const [bufferSize, setBufferSize] = useState([1000])
  const [samplingRate, setSamplingRate] = useState([2])
  const [autoReconnect, setAutoReconnect] = useState(true)
  const [compressionEnabled, setCompressionEnabled] = useState(true)
  const [dataRetention, setDataRetention] = useState("24h")

  const handleSave = () => {
    // Implementation for saving streaming configuration
    console.log("Saving streaming config:", {
      bufferSize: bufferSize[0],
      samplingRate: samplingRate[0],
      autoReconnect,
      compressionEnabled,
      dataRetention,
    })
    onClose()
  }

  const handleReset = () => {
    setBufferSize([1000])
    setSamplingRate([2])
    setAutoReconnect(true)
    setCompressionEnabled(true)
    setDataRetention("24h")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Streaming Configuration</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Buffer Size */}
          <div className="space-y-2">
            <Label>Buffer Size: {bufferSize[0]} points</Label>
            <Slider
              value={bufferSize}
              onValueChange={setBufferSize}
              max={5000}
              min={100}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>100</span>
              <span>5000</span>
            </div>
          </div>

          {/* Sampling Rate */}
          <div className="space-y-2">
            <Label>Sampling Rate: {samplingRate[0]}s</Label>
            <Slider
              value={samplingRate}
              onValueChange={setSamplingRate}
              max={10}
              min={0.5}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.5s</span>
              <span>10s</span>
            </div>
          </div>

          {/* Data Retention */}
          <div className="space-y-2">
            <Label>Data Retention</Label>
            <Select value={dataRetention} onValueChange={setDataRetention}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="6h">6 Hours</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Switches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-reconnect">Auto Reconnect</Label>
              <Switch id="auto-reconnect" checked={autoReconnect} onCheckedChange={setAutoReconnect} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="compression">Data Compression</Label>
              <Switch id="compression" checked={compressionEnabled} onCheckedChange={setCompressionEnabled} />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
