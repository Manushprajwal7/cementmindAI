"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area } from "recharts"
import type { TooltipProps } from "recharts"

// Color scheme for quality metrics
const qualityColors = {
  overall_score: {
    line: '#4F46E5', // Indigo-600
    gradientStart: 'rgba(99, 102, 241, 0.2)', // Indigo-500 with opacity
    gradientEnd: 'rgba(99, 102, 241, 0.05)'
  },
  fineness: {
    line: '#10B981', // Emerald-500
    gradientStart: 'rgba(16, 185, 129, 0.2)',
    gradientEnd: 'rgba(16, 185, 129, 0.05)'
  },
  strength: {
    line: '#F59E0B', // Amber-500
    gradientStart: 'rgba(245, 158, 11, 0.2)',
    gradientEnd: 'rgba(245, 158, 11, 0.05)'
  },
  setting_time: {
    line: '#8B5CF6', // Violet-500
    gradientStart: 'rgba(139, 92, 246, 0.2)',
    gradientEnd: 'rgba(139, 92, 246, 0.05)'
  }
}

// Custom tooltip component
interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value?: number | string | Array<number | string>;
    name: string;
    color?: string;
    dataKey?: string;
  }>;
  label?: string | number;
  unit?: string;
}

const CustomTooltip = ({ active, payload, label, unit = '' }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-md p-3 shadow-lg backdrop-blur-sm">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        {payload?.map((entry: { value?: number | string | Array<number | string>; name: string; color?: string; dataKey?: string }, index: number) => (
          <div key={`tooltip-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm font-medium">
              {typeof entry.value === 'number' 
                ? entry.value.toFixed(entry.dataKey === 'overall_score' ? 1 : entry.dataKey === 'strength' ? 1 : 0)
                : 'N/A'}
              {unit && ` ${unit}`}
              <span className="text-muted-foreground ml-1 font-normal">
                {entry.name}
              </span>
            </p>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Generate mock trend data
const generateTrendData = () => {
  const data = []
  const now = new Date()

  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      time: timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      fineness: 3400 + Math.sin(i * 0.3) * 100 + Math.random() * 50,
      setting_time: 180 + Math.sin(i * 0.2) * 20 + Math.random() * 10,
      strength: 42 + Math.sin(i * 0.4) * 3 + Math.random() * 2,
      overall_score: 85 + Math.sin(i * 0.25) * 8 + Math.random() * 4,
    })
  }

  return data
}

export function QualityTrends() {
  const data = generateTrendData()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quality Score Trends (24 Hours)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <defs>
                  <linearGradient id="colorOverallScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={qualityColors.overall_score.gradientStart} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={qualityColors.overall_score.gradientEnd} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" strokeOpacity={0.3} />
                <XAxis 
                  dataKey="time" 
                  className="text-xs fill-muted-foreground" 
                  tickLine={false}
                  axisLine={false}
                  interval={Math.floor(data.length / 5)}
                />
                <YAxis 
                  className="text-xs fill-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  content={<CustomTooltip unit="%" />}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="overall_score"
                  stroke="transparent"
                  fillOpacity={1}
                  fill="url(#colorOverallScore)"
                />
                <Line
                  type="monotone"
                  dataKey="overall_score"
                  stroke={qualityColors.overall_score.line}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 5,
                    stroke: qualityColors.overall_score.line,
                    strokeWidth: 2,
                    fill: "hsl(var(--card))"
                  }}
                  name="Overall Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fineness Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <defs>
                    <linearGradient id="colorFineness" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={qualityColors.fineness.gradientStart} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={qualityColors.fineness.gradientEnd} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="time" 
                    className="text-xs fill-muted-foreground" 
                    tickLine={false}
                    axisLine={false}
                    interval={Math.floor(data.length / 4)}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    content={<CustomTooltip unit="cm²/g" />}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="fineness"
                    stroke="transparent"
                    fillOpacity={1}
                    fill="url(#colorFineness)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fineness" 
                    stroke={qualityColors.fineness.line} 
                    strokeWidth={2.5} 
                    dot={false}
                    activeDot={{
                      r: 5,
                      stroke: qualityColors.fineness.line,
                      strokeWidth: 2,
                      fill: "hsl(var(--card))"
                    }}
                    name="Fineness"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strength Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <defs>
                    <linearGradient id="colorStrength" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={qualityColors.strength.gradientStart} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={qualityColors.strength.gradientEnd} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" strokeOpacity={0.3} />
                  <XAxis 
                    dataKey="time" 
                    className="text-xs fill-muted-foreground" 
                    tickLine={false}
                    axisLine={false}
                    interval={Math.floor(data.length / 4)}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    content={<CustomTooltip unit="MPa" />}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="strength"
                    stroke="transparent"
                    fillOpacity={1}
                    fill="url(#colorStrength)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="strength" 
                    stroke={qualityColors.strength.line} 
                    strokeWidth={2.5} 
                    dot={false}
                    activeDot={{
                      r: 5,
                      stroke: qualityColors.strength.line,
                      strokeWidth: 2,
                      fill: "hsl(var(--card))"
                    }}
                    name="Strength"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
