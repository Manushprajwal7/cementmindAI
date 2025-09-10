"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Settings2, RotateCcw } from "lucide-react"
import type { QualityPrediction } from "@/types/quality"

interface ManualAdjustmentsProps {
  qualityData: QualityPrediction
  onDataChange: (data: QualityPrediction) => void
}

export function ManualAdjustments({ qualityData, onDataChange }: ManualAdjustmentsProps) {
  const [processParams, setProcessParams] = useState({
    kilnTemp: 1480,
    millSpeed: 16.2,
    airFlow: 85.5,
    feedRate: 245,
  })

  const [materialComposition, setMaterialComposition] = useState({
    limestone: 78.5,
    clay: 15.2,
    ironOre: 2.1,
    gypsum: 4.2,
  })

  const handleProcessParamChange = (param: string, value: number) => {
    setProcessParams((prev) => ({ ...prev, [param]: value }))
  }

  const handleMaterialChange = (material: string, value: number) => {
    setMaterialComposition((prev) => ({ ...prev, [material]: value }))
  }

  const resetToDefaults = () => {
    setProcessParams({
      kilnTemp: 1480,
      millSpeed: 16.2,
      airFlow: 85.5,
      feedRate: 245,
    })
    setMaterialComposition({
      limestone: 78.5,
      clay: 15.2,
      ironOre: 2.1,
      gypsum: 4.2,
    })
  }

  const totalComposition = Object.values(materialComposition).reduce((sum, val) => sum + val, 0)

  return (
    <div className="space-y-6">
      {/* Process Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings2 className="h-5 w-5" />
              <span>Process Parameters</span>
            </div>
            <Button variant="outline" size="sm" onClick={resetToDefaults}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="kilnTemp">Kiln Temperature (°C)</Label>
              <div className="space-y-2">
                <Slider
                  value={[processParams.kilnTemp]}
                  onValueChange={([value]) => handleProcessParamChange("kilnTemp", value)}
                  min={1400}
                  max={1600}
                  step={5}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">1400°C</span>
                  <Input
                    id="kilnTemp"
                    type="number"
                    value={processParams.kilnTemp}
                    onChange={(e) => handleProcessParamChange("kilnTemp", Number(e.target.value))}
                    className="w-20 h-8 text-center"
                  />
                  <span className="text-muted-foreground">1600°C</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="millSpeed">Mill Speed (rpm)</Label>
              <div className="space-y-2">
                <Slider
                  value={[processParams.millSpeed]}
                  onValueChange={([value]) => handleProcessParamChange("millSpeed", value)}
                  min={14}
                  max={20}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">14 rpm</span>
                  <Input
                    id="millSpeed"
                    type="number"
                    value={processParams.millSpeed}
                    onChange={(e) => handleProcessParamChange("millSpeed", Number(e.target.value))}
                    className="w-20 h-8 text-center"
                    step="0.1"
                  />
                  <span className="text-muted-foreground">20 rpm</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="airFlow">Air Flow (%)</Label>
              <div className="space-y-2">
                <Slider
                  value={[processParams.airFlow]}
                  onValueChange={([value]) => handleProcessParamChange("airFlow", value)}
                  min={70}
                  max={100}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">70%</span>
                  <Input
                    id="airFlow"
                    type="number"
                    value={processParams.airFlow}
                    onChange={(e) => handleProcessParamChange("airFlow", Number(e.target.value))}
                    className="w-20 h-8 text-center"
                    step="0.5"
                  />
                  <span className="text-muted-foreground">100%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="feedRate">Feed Rate (t/h)</Label>
              <div className="space-y-2">
                <Slider
                  value={[processParams.feedRate]}
                  onValueChange={([value]) => handleProcessParamChange("feedRate", value)}
                  min={200}
                  max={300}
                  step={1}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">200 t/h</span>
                  <Input
                    id="feedRate"
                    type="number"
                    value={processParams.feedRate}
                    onChange={(e) => handleProcessParamChange("feedRate", Number(e.target.value))}
                    className="w-20 h-8 text-center"
                  />
                  <span className="text-muted-foreground">300 t/h</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Material Composition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Material Composition</span>
            <Badge variant={totalComposition === 100 ? "default" : "destructive"}>
              Total: {totalComposition.toFixed(1)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(materialComposition).map(([material, percentage]) => (
              <div key={material} className="space-y-3">
                <Label htmlFor={material} className="capitalize">
                  {material} (%)
                </Label>
                <div className="space-y-2">
                  <Slider
                    value={[percentage]}
                    onValueChange={([value]) => handleMaterialChange(material, value)}
                    min={0}
                    max={material === "limestone" ? 85 : material === "clay" ? 20 : 10}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">0%</span>
                    <Input
                      id={material}
                      type="number"
                      value={percentage}
                      onChange={(e) => handleMaterialChange(material, Number(e.target.value))}
                      className="w-20 h-8 text-center"
                      step="0.1"
                    />
                    <span className="text-muted-foreground">
                      {material === "limestone" ? "85%" : material === "clay" ? "20%" : "10%"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalComposition !== 100 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                Warning: Material composition must total 100%. Current total: {totalComposition.toFixed(1)}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
