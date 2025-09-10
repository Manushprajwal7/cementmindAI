export interface TruckSchedule {
  id: string
  truck_number: string
  driver: string
  status: "loading" | "transit" | "unloading" | "idle" | "maintenance"
  current_location: {
    lat: number
    lng: number
    address: string
  }
  destination: {
    lat: number
    lng: number
    address: string
    site_name: string
  }
  eta: string
  load_capacity: number
  current_load: number
  route_distance: number
  fuel_level: number
  last_updated: string
}

export interface LogisticsRecommendation {
  truck_scheduling: {
    predicted_demand: number[]
    optimal_schedule: { [hour: number]: number }
    total_trucks_needed: number
    peak_demand_hours: number[]
  }
  performance_metrics: {
    current_supply_efficiency: number
    inventory_turnover: number
    average_delay: number
    fuel_efficiency: number
  }
  improvement_opportunities: string[]
}

export interface RouteOptimization {
  route_id: string
  origin: string
  destination: string
  distance: number
  estimated_time: number
  traffic_level: "low" | "medium" | "high"
  fuel_cost: number
  priority: "low" | "medium" | "high" | "critical"
  assigned_trucks: string[]
}
