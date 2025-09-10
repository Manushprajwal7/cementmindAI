"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Mail, MessageSquare, Phone } from "lucide-react"

interface RoutingRule {
  id: string
  name: string
  conditions: {
    severity: string[]
    type: string[]
    timeRange?: string
  }
  actions: {
    notify: string[]
    escalate: boolean
    escalateAfter: string
  }
  enabled: boolean
}

export function AlertRoutingConfig() {
  const [rules, setRules] = useState<RoutingRule[]>([
    {
      id: "rule-1",
      name: "Critical Temperature Alerts",
      conditions: {
        severity: ["critical"],
        type: ["Temperature Spike"],
      },
      actions: {
        notify: ["email", "sms"],
        escalate: true,
        escalateAfter: "15m",
      },
      enabled: true,
    },
    {
      id: "rule-2",
      name: "Quality Deviations",
      conditions: {
        severity: ["high", "critical"],
        type: ["Quality Deviation"],
      },
      actions: {
        notify: ["email", "slack"],
        escalate: true,
        escalateAfter: "30m",
      },
      enabled: true,
    },
  ])

  const [newRule, setNewRule] = useState<Partial<RoutingRule>>({
    name: "",
    conditions: { severity: [], type: [] },
    actions: { notify: [], escalate: false, escalateAfter: "15m" },
    enabled: true,
  })

  const addRule = () => {
    if (newRule.name) {
      const rule: RoutingRule = {
        id: `rule-${Date.now()}`,
        name: newRule.name,
        conditions: newRule.conditions || { severity: [], type: [] },
        actions: newRule.actions || { notify: [], escalate: false, escalateAfter: "15m" },
        enabled: true,
      }
      setRules([...rules, rule])
      setNewRule({
        name: "",
        conditions: { severity: [], type: [] },
        actions: { notify: [], escalate: false, escalateAfter: "15m" },
        enabled: true,
      })
    }
  }

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule.id !== ruleId))
  }

  const toggleRule = (ruleId: string) => {
    setRules(rules.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alert Routing Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id} className={rule.enabled ? "border-green-200" : "border-gray-200"}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold">{rule.name}</h4>
                    <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => deleteRule(rule.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Conditions</p>
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {rule.conditions.severity.map((severity) => (
                          <Badge key={severity} variant="outline">
                            {severity}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {rule.conditions.type.map((type) => (
                          <Badge key={type} variant="secondary">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Notifications</p>
                    <div className="flex space-x-2">
                      {rule.actions.notify.includes("email") && <Mail className="h-4 w-4 text-blue-500" />}
                      {rule.actions.notify.includes("sms") && <Phone className="h-4 w-4 text-green-500" />}
                      {rule.actions.notify.includes("slack") && <MessageSquare className="h-4 w-4 text-purple-500" />}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Escalation</p>
                    <p className="text-sm text-muted-foreground">
                      {rule.actions.escalate ? `After ${rule.actions.escalateAfter}` : "Disabled"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Rule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Rule name"
              value={newRule.name || ""}
              onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
            />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={addRule} disabled={!newRule.name}>
            <Plus className="mr-2 h-4 w-4" />
            Add Rule
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
