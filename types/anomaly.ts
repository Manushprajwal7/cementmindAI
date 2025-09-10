export interface AnomalyDetail {
  id: string
  timestamp: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  confidence: number
  status: "new" | "acknowledged" | "investigating" | "resolved"
  affected_sensors: Array<{
    sensor: string
    current_value: number
    expected_range: [number, number]
    deviation_percent: number
  }>
  potential_causes: string[]
  recommended_actions: string[]
  description: string
  assignee?: string | null
}
