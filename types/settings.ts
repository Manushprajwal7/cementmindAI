export interface UserPreferences {
  theme: "light" | "dark" | "system"
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    criticalOnly: boolean
  }
  dashboard: {
    refreshInterval: number
    defaultView: string
    compactMode: boolean
  }
}

export interface SystemSettings {
  dataRetention: number
  alertThresholds: {
    temperature: { min: number; max: number }
    pressure: { min: number; max: number }
    flow: { min: number; max: number }
  }
  integrations: {
    enabled: string[]
    apiKeys: Record<string, string>
  }
  backup: {
    frequency: "daily" | "weekly"
    retention: number
    location: string
  }
}
