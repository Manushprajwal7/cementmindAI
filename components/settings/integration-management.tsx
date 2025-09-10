"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plug, Key, Webhook, Database, Cloud, AlertCircle, CheckCircle } from "lucide-react"

interface Integration {
  id: string
  name: string
  type: "api" | "webhook" | "database" | "cloud"
  status: "connected" | "disconnected" | "error"
  description: string
  lastSync?: Date
  apiKey?: string
  webhookUrl?: string
  config: Record<string, any>
}

interface WebhookEndpoint {
  id: string
  name: string
  url: string
  events: string[]
  status: "active" | "inactive"
  lastTriggered?: Date
  successRate: number
}

const mockIntegrations: Integration[] = [
  {
    id: "1",
    name: "SCADA System",
    type: "api",
    status: "connected",
    description: "Real-time sensor data from plant SCADA system",
    lastSync: new Date("2024-01-09T16:45:00"),
    apiKey: "scada_***************",
    config: { endpoint: "https://scada.plant.com/api", refreshRate: 5000 },
  },
  {
    id: "2",
    name: "ERP Integration",
    type: "database",
    status: "connected",
    description: "Production planning and inventory data",
    lastSync: new Date("2024-01-09T16:30:00"),
    config: { host: "erp.company.com", database: "production", port: 5432 },
  },
  {
    id: "3",
    name: "Weather Service",
    type: "api",
    status: "error",
    description: "Weather data for production optimization",
    apiKey: "weather_***************",
    config: { provider: "OpenWeather", location: "plant_coordinates" },
  },
  {
    id: "4",
    name: "Cloud Storage",
    type: "cloud",
    status: "connected",
    description: "Backup and archive storage for reports",
    lastSync: new Date("2024-01-09T15:00:00"),
    config: { provider: "AWS S3", bucket: "cement-plant-data" },
  },
]

const mockWebhooks: WebhookEndpoint[] = [
  {
    id: "1",
    name: "Alert Notifications",
    url: "https://alerts.company.com/webhook",
    events: ["alert.created", "alert.resolved", "anomaly.detected"],
    status: "active",
    lastTriggered: new Date("2024-01-09T16:20:00"),
    successRate: 98.5,
  },
  {
    id: "2",
    name: "Production Updates",
    url: "https://erp.company.com/production/webhook",
    events: ["production.batch_complete", "quality.test_result"],
    status: "active",
    lastTriggered: new Date("2024-01-09T15:45:00"),
    successRate: 95.2,
  },
  {
    id: "3",
    name: "Maintenance System",
    url: "https://maintenance.company.com/webhook",
    events: ["maintenance.scheduled", "equipment.failure"],
    status: "inactive",
    successRate: 87.3,
  },
]

export function IntegrationManagement() {
  const [integrations, setIntegrations] = useState(mockIntegrations)
  const [webhooks, setWebhooks] = useState(mockWebhooks)
  const [activeTab, setActiveTab] = useState("integrations")
  const [showNewIntegration, setShowNewIntegration] = useState(false)
  const [newIntegration, setNewIntegration] = useState({
    name: "",
    type: "api" as const,
    description: "",
    apiKey: "",
    webhookUrl: "",
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "disconnected":
        return "bg-gray-100 text-gray-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "api":
        return <Plug className="w-4 h-4" />
      case "webhook":
        return <Webhook className="w-4 h-4" />
      case "database":
        return <Database className="w-4 h-4" />
      case "cloud":
        return <Cloud className="w-4 h-4" />
      default:
        return <Plug className="w-4 h-4" />
    }
  }

  const toggleIntegrationStatus = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? {
              ...integration,
              status: integration.status === "connected" ? "disconnected" : ("connected" as const),
            }
          : integration,
      ),
    )
  }

  const toggleWebhookStatus = (webhookId: string) => {
    setWebhooks((prev) =>
      prev.map((webhook) =>
        webhook.id === webhookId
          ? {
              ...webhook,
              status: webhook.status === "active" ? "inactive" : ("active" as const),
            }
          : webhook,
      ),
    )
  }

  const handleCreateIntegration = () => {
    const integration: Integration = {
      id: Date.now().toString(),
      name: newIntegration.name,
      type: newIntegration.type,
      status: "disconnected",
      description: newIntegration.description,
      apiKey: newIntegration.apiKey,
      webhookUrl: newIntegration.webhookUrl,
      config: {},
    }

    setIntegrations((prev) => [...prev, integration])
    setNewIntegration({ name: "", type: "api", description: "", apiKey: "", webhookUrl: "" })
    setShowNewIntegration(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Integration Management</h3>
          <p className="text-muted-foreground">Manage external system integrations and webhooks</p>
        </div>
        <Button onClick={() => setShowNewIntegration(true)} className="bg-red-600 hover:bg-red-700">
          <Plug className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Integrations</p>
                <p className="text-2xl font-bold text-blue-600">{integrations.length}</p>
              </div>
              <Plug className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Connected</p>
                <p className="text-2xl font-bold text-green-600">
                  {integrations.filter((i) => i.status === "connected").length}
                </p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Webhooks</p>
                <p className="text-2xl font-bold text-purple-600">
                  {webhooks.filter((w) => w.status === "active").length}
                </p>
              </div>
              <Webhook className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold text-red-600">
                  {integrations.filter((i) => i.status === "error").length}
                </p>
              </div>
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-6">
          {/* New Integration Form */}
          {showNewIntegration && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Integration</CardTitle>
                <CardDescription>Connect a new external system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Integration Name</label>
                    <Input
                      placeholder="Enter integration name"
                      value={newIntegration.name}
                      onChange={(e) => setNewIntegration((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newIntegration.type}
                      onChange={(e) => setNewIntegration((prev) => ({ ...prev, type: e.target.value as any }))}
                    >
                      <option value="api">API</option>
                      <option value="webhook">Webhook</option>
                      <option value="database">Database</option>
                      <option value="cloud">Cloud Service</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Enter integration description"
                    value={newIntegration.description}
                    onChange={(e) => setNewIntegration((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">API Key (optional)</label>
                    <Input
                      type="password"
                      placeholder="Enter API key"
                      value={newIntegration.apiKey}
                      onChange={(e) => setNewIntegration((prev) => ({ ...prev, apiKey: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Webhook URL (optional)</label>
                    <Input
                      placeholder="Enter webhook URL"
                      value={newIntegration.webhookUrl}
                      onChange={(e) => setNewIntegration((prev) => ({ ...prev, webhookUrl: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateIntegration} className="bg-red-600 hover:bg-red-700">
                    Create Integration
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewIntegration(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Integrations List */}
          <div className="space-y-4">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(integration.type)}
                        <h3 className="font-semibold text-lg">{integration.name}</h3>
                        <Badge className={getStatusColor(integration.status)}>
                          {getStatusIcon(integration.status)}
                          {integration.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{integration.type.toUpperCase()}</Badge>
                      </div>
                      <p className="text-muted-foreground">{integration.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {integration.lastSync && (
                          <div>
                            <p className="text-muted-foreground">Last Sync</p>
                            <p className="font-medium">{integration.lastSync.toLocaleString()}</p>
                          </div>
                        )}
                        {integration.apiKey && (
                          <div>
                            <p className="text-muted-foreground">API Key</p>
                            <p className="font-medium font-mono">{integration.apiKey}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-muted-foreground">Configuration</p>
                          <p className="font-medium">{Object.keys(integration.config).length} settings</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={integration.status === "connected"}
                            onCheckedChange={() => toggleIntegrationStatus(integration.id)}
                          />
                          <span className="text-sm">
                            {integration.status === "connected" ? "Connected" : "Disconnected"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        Configure
                      </Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Test Connection
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          {webhooks.map((webhook) => (
            <Card key={webhook.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <Webhook className="w-5 h-5" />
                      <h3 className="font-semibold text-lg">{webhook.name}</h3>
                      <Badge className={getStatusColor(webhook.status)}>
                        {getStatusIcon(webhook.status)}
                        {webhook.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Webhook URL:</p>
                      <code className="text-sm bg-background px-2 py-1 rounded">{webhook.url}</code>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Events</p>
                        <p className="font-medium">{webhook.events.length} events</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Success Rate</p>
                        <p className="font-medium">{webhook.successRate}%</p>
                      </div>
                      {webhook.lastTriggered && (
                        <div>
                          <p className="text-muted-foreground">Last Triggered</p>
                          <p className="font-medium">{webhook.lastTriggered.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map((event, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={webhook.status === "active"}
                          onCheckedChange={() => toggleWebhookStatus(webhook.id)}
                        />
                        <span className="text-sm">{webhook.status === "active" ? "Active" : "Inactive"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Test Webhook
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Key Management</CardTitle>
              <CardDescription>Manage API keys for external integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations
                  .filter((i) => i.apiKey)
                  .map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium">{integration.name}</p>
                          <p className="text-sm text-muted-foreground font-mono">{integration.apiKey}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Regenerate
                        </Button>
                        <Button size="sm" variant="outline">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  ))}
                <Button className="bg-red-600 hover:bg-red-700">
                  <Key className="w-4 h-4 mr-2" />
                  Generate New API Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
