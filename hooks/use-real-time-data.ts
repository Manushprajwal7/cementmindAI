"use client"

import { useState, useEffect, useCallback } from "react"

interface SensorReading {
  timestamp: string
  kiln_temperature: number
  system_pressure: number
  material_flow_rate: number
  oxygen_level: number
  energy_consumption: number
}

interface AnomalyDetail {
  timestamp: string
  confidence: number
  affected_sensors: Array<{
    sensor: string
    current_value: number
    expected_range: [number, number]
    deviation_percent: number
  }>
  severity: "low" | "medium" | "high" | "critical"
  potential_causes: string[]
  recommended_actions: string[]
}

interface AnalysisResult {
  timestamp: string
  system_status: string
  alerts: Array<{
    id: string
    type: string
    severity: "low" | "medium" | "high" | "critical"
    message: string
    anomaly_details?: AnomalyDetail
  }>
  recommendations: {
    quality_control?: {
      predicted_fineness: number
      predicted_setting_time: number
      predicted_strength: number
      corrections: {
        process_adjustments: Record<string, number>
        material_adjustments: Record<string, number>
        estimated_impact: Record<string, number>
      }
    }
    logistics?: {
      truck_scheduling: {
        predicted_demand: number[]
        optimal_schedule: Record<number, number>
        total_trucks_needed: number
        peak_demand_hours: number[]
      }
      performance_metrics: {
        current_supply_efficiency: number
        inventory_turnover: number
        average_delay: number
      }
      improvement_opportunities: string[]
    }
  }
  performance_metrics: {
    energy_efficiency: number
    material_flow_rate: number
    system_pressure: number
    kiln_temperature: number
    quality_score: number
    anomaly_confidence: number
  }
}

interface WebSocketEvents {
  "analysis.update": AnalysisResult
  "alert.new": AnalysisResult["alerts"][0]
  "logistics.update": AnalysisResult["recommendations"]["logistics"]
  "quality.prediction": AnalysisResult["recommendations"]["quality_control"]
}

type ConnectionStatus = "connected" | "disconnected" | "connecting"

export function useRealTimeData(enabled = true, plantId = "plant-1") {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected")
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [currentData, setCurrentData] = useState<AnalysisResult | null>(null)
  const [dataHistory, setDataHistory] = useState<AnalysisResult[]>([])

  const generateMockData = useCallback((): AnalysisResult => {
    const now = new Date()
    const hasAnomaly = Math.random() > 0.8

    return {
      timestamp: now.toISOString(),
      system_status: hasAnomaly ? "warning" : "normal",
      alerts: hasAnomaly
        ? [
            {
              id: `alert-${Date.now()}`,
              type: "temperature_anomaly",
              severity: Math.random() > 0.5 ? "high" : "medium",
              message: "Kiln temperature deviation detected",
              anomaly_details: {
                timestamp: now.toISOString(),
                confidence: 0.85 + Math.random() * 0.1,
                affected_sensors: [
                  {
                    sensor: "kiln_temperature",
                    current_value: 1520 + Math.random() * 50,
                    expected_range: [1450, 1500],
                    deviation_percent: 5 + Math.random() * 10,
                  },
                ],
                severity: "high",
                potential_causes: ["Fuel flow irregularity", "Air intake blockage"],
                recommended_actions: ["Adjust fuel flow rate", "Check air intake system"],
              },
            },
          ]
        : [],
      recommendations: {
        quality_control: {
          predicted_fineness: 3400 + Math.random() * 100,
          predicted_setting_time: 180 + Math.random() * 20,
          predicted_strength: 42 + Math.random() * 3,
          corrections: {
            process_adjustments: {
              kiln_speed: 0.95 + Math.random() * 0.1,
              air_flow: 1.02 + Math.random() * 0.06,
            },
            material_adjustments: {
              limestone_percent: 78 + Math.random() * 4,
              clay_percent: 15 + Math.random() * 2,
            },
            estimated_impact: {
              quality_improvement: 2 + Math.random() * 3,
              energy_savings: 1 + Math.random() * 2,
            },
          },
        },
        logistics: {
          truck_scheduling: {
            predicted_demand: Array.from({ length: 48 }, () => 15 + Math.random() * 10),
            optimal_schedule: Object.fromEntries(
              Array.from({ length: 24 }, (_, i) => [i, Math.floor(2 + Math.random() * 4)]),
            ),
            total_trucks_needed: 12 + Math.floor(Math.random() * 6),
            peak_demand_hours: [8, 9, 14, 15, 16],
          },
          performance_metrics: {
            current_supply_efficiency: 92 + Math.random() * 6,
            inventory_turnover: 4.2 + Math.random() * 0.8,
            average_delay: 15 + Math.random() * 10,
          },
          improvement_opportunities: [
            "Optimize route scheduling during peak hours",
            "Implement predictive maintenance for trucks",
          ],
        },
      },
      performance_metrics: {
        energy_efficiency: 85 + Math.random() * 10,
        material_flow_rate: 240 + Math.random() * 20,
        system_pressure: 4.0 + Math.random() * 0.8,
        kiln_temperature: 1450 + Math.random() * 100,
        quality_score: 90 + Math.random() * 8,
        anomaly_confidence: Math.random() * 0.3,
      },
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      setConnectionStatus("disconnected")
      return
    }

    setConnectionStatus("connecting")

    const connectTimeout = setTimeout(() => {
      setConnectionStatus("connected")
      console.log(`[v0] Connected to WebSocket for plant: ${plantId}`)
    }, 1000)

    const dataInterval = setInterval(() => {
      if (enabled) {
        const newData = generateMockData()
        setCurrentData(newData)
        setLastUpdate(new Date())
        setDataHistory((prev) => [...prev.slice(-99), newData])

        console.log(`[v0] Received analysis.update event`)
        if (newData.alerts.length > 0) {
          console.log(`[v0] Received alert.new event:`, newData.alerts[0])
        }
      }
    }, 2000)

    return () => {
      clearTimeout(connectTimeout)
      clearInterval(dataInterval)
      setConnectionStatus("disconnected")
      console.log(`[v0] Disconnected from WebSocket`)
    }
  }, [enabled, plantId, generateMockData])

  return {
    connectionStatus,
    lastUpdate,
    currentData,
    dataHistory,
  }
}
