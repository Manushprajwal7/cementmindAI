"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Bell, Database, Lock, Palette, Save, User } from "lucide-react"
import type { UserPreferences, SystemSettings } from "@/types/settings"
import { UserManagement } from "./user-management"
import { IntegrationManagement } from "./integration-management"
import { AuditLogs } from "./audit-logs"

export function SettingsPanel() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: "system",
    language: "en",
    timezone: "UTC",
    notifications: {
      email: true,
      push: true,
      sms: false,
      criticalOnly: false,
    },
    dashboard: {
      refreshInterval: 5000,
      defaultView: "overview",
      compactMode: false,
    },
  })

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    dataRetention: 90,
    alertThresholds: {
      temperature: { min: 800, max: 1200 },
      pressure: { min: 2, max: 8 },
      flow: { min: 100, max: 500 },
    },
    integrations: {
      enabled: ["sensors", "alerts"],
      apiKeys: {},
    },
    backup: {
      frequency: "daily",
      retention: 30,
      location: "cloud",
    },
  })

  const handleSavePreferences = () => {
    console.log("[v0] Saving user preferences:", preferences)
    // Simulate save
  }

  const handleSaveSystemSettings = () => {
    console.log("[v0] Saving system settings:", systemSettings)
    // Simulate save
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your preferences and system configuration</p>
      </div>

      <Tabs defaultValue="preferences" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="preferences">
            <User className="w-4 h-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system">
            <Database className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Appearance & Display
              </CardTitle>
              <CardDescription>Customize your dashboard appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value: any) => setPreferences((prev) => ({ ...prev, theme: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => setPreferences((prev) => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Mode</Label>
                    <p className="text-sm text-gray-600">Reduce spacing and padding for more content</p>
                  </div>
                  <Switch
                    checked={preferences.dashboard.compactMode}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({
                        ...prev,
                        dashboard: { ...prev.dashboard, compactMode: checked },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dashboard Refresh Interval: {preferences.dashboard.refreshInterval / 1000}s</Label>
                  <Slider
                    value={[preferences.dashboard.refreshInterval]}
                    onValueChange={([value]) =>
                      setPreferences((prev) => ({
                        ...prev,
                        dashboard: { ...prev.dashboard, refreshInterval: value },
                      }))
                    }
                    min={1000}
                    max={30000}
                    step={1000}
                    className="w-full"
                  />
                </div>
              </div>

              <Button onClick={handleSavePreferences} className="bg-red-600 hover:bg-red-700">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive alerts and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive alerts via email</p>
                  </div>
                  <Switch
                    checked={preferences.notifications.email}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-600">Browser push notifications</p>
                  </div>
                  <Switch
                    checked={preferences.notifications.push}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, push: checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Alerts</Label>
                    <p className="text-sm text-gray-600">Critical alerts via SMS</p>
                  </div>
                  <Switch
                    checked={preferences.notifications.sms}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, sms: checked },
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Critical Only</Label>
                    <p className="text-sm text-gray-600">Only receive critical severity alerts</p>
                  </div>
                  <Switch
                    checked={preferences.notifications.criticalOnly}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, criticalOnly: checked },
                      }))
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSavePreferences} className="bg-red-600 hover:bg-red-700">
                <Save className="w-4 h-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Configure system-wide settings and thresholds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Data Retention (days)</Label>
                  <Input
                    type="number"
                    value={systemSettings.dataRetention}
                    onChange={(e) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        dataRetention: Number.parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Select
                    value={systemSettings.backup.frequency}
                    onValueChange={(value: any) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        backup: { ...prev.backup, frequency: value },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Alert Thresholds</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Temperature (°C)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min"
                        type="number"
                        value={systemSettings.alertThresholds.temperature.min}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({
                            ...prev,
                            alertThresholds: {
                              ...prev.alertThresholds,
                              temperature: {
                                ...prev.alertThresholds.temperature,
                                min: Number.parseInt(e.target.value),
                              },
                            },
                          }))
                        }
                      />
                      <Input
                        placeholder="Max"
                        type="number"
                        value={systemSettings.alertThresholds.temperature.max}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({
                            ...prev,
                            alertThresholds: {
                              ...prev.alertThresholds,
                              temperature: {
                                ...prev.alertThresholds.temperature,
                                max: Number.parseInt(e.target.value),
                              },
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Pressure (bar)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min"
                        type="number"
                        value={systemSettings.alertThresholds.pressure.min}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({
                            ...prev,
                            alertThresholds: {
                              ...prev.alertThresholds,
                              pressure: {
                                ...prev.alertThresholds.pressure,
                                min: Number.parseInt(e.target.value),
                              },
                            },
                          }))
                        }
                      />
                      <Input
                        placeholder="Max"
                        type="number"
                        value={systemSettings.alertThresholds.pressure.max}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({
                            ...prev,
                            alertThresholds: {
                              ...prev.alertThresholds,
                              pressure: {
                                ...prev.alertThresholds.pressure,
                                max: Number.parseInt(e.target.value),
                              },
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Flow Rate (t/h)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min"
                        type="number"
                        value={systemSettings.alertThresholds.flow.min}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({
                            ...prev,
                            alertThresholds: {
                              ...prev.alertThresholds,
                              flow: {
                                ...prev.alertThresholds.flow,
                                min: Number.parseInt(e.target.value),
                              },
                            },
                          }))
                        }
                      />
                      <Input
                        placeholder="Max"
                        type="number"
                        value={systemSettings.alertThresholds.flow.max}
                        onChange={(e) =>
                          setSystemSettings((prev) => ({
                            ...prev,
                            alertThresholds: {
                              ...prev.alertThresholds,
                              flow: {
                                ...prev.alertThresholds.flow,
                                max: Number.parseInt(e.target.value),
                              },
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveSystemSettings} className="bg-red-600 hover:bg-red-700">
                <Save className="w-4 h-4 mr-2" />
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="Enter current password" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" placeholder="Enter new password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input type="password" placeholder="Confirm new password" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Session Management</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-logout after inactivity</Label>
                    <p className="text-sm text-gray-600">Automatically log out after 30 minutes of inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-factor authentication</Label>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Button className="bg-red-600 hover:bg-red-700">
                <Save className="w-4 h-4 mr-2" />
                Update Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <IntegrationManagement />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <AuditLogs />
        </TabsContent>
      </Tabs>
    </div>
  )
}
