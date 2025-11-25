"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  IndianRupee,
  TrendingDown,
  TrendingUp,
  Fuel,
  Wrench,
  Truck,
  Calendar,
} from "lucide-react";

interface CostData {
  category: string;
  amount: number;
  percentage: number;
  change: number;
}

interface MonthlyCostData {
  month: string;
  fuel: number;
  maintenance: number;
  labor: number;
  total: number;
}

const generateCostData = (): CostData[] => [
  { category: "Fuel", amount: 12500, percentage: 45, change: -5 },
  { category: "Maintenance", amount: 8200, percentage: 30, change: 12 },
  { category: "Labor", amount: 5300, percentage: 19, change: 3 },
  { category: "Other", amount: 1700, percentage: 6, change: -2 },
];

const generateMonthlyCostData = (): MonthlyCostData[] => [
  { month: "Jan", fuel: 11200, maintenance: 7800, labor: 5100, total: 24100 },
  { month: "Feb", fuel: 10800, maintenance: 8100, labor: 5000, total: 23900 },
  { month: "Mar", fuel: 12100, maintenance: 7900, labor: 5200, total: 25200 },
  { month: "Apr", fuel: 13200, maintenance: 8300, labor: 5400, total: 26900 },
  { month: "May", fuel: 11800, maintenance: 8000, labor: 5300, total: 25100 },
  { month: "Jun", fuel: 12500, maintenance: 8200, labor: 5300, total: 26000 },
];

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];

export function CostAnalytics() {
  const [costData] = useState<CostData[]>(generateCostData());
  const [monthlyData] = useState<MonthlyCostData[]>(generateMonthlyCostData());
  const [timeframe, setTimeframe] = useState<"monthly" | "quarterly">(
    "monthly"
  );

  const totalCost = costData.reduce((sum, item) => sum + item.amount, 0);
  const savings = 1250; // Mock savings from optimizations

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <IndianRupee className="h-5 w-5" />
            <span>Cost Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-2">
              <Button
                variant={timeframe === "monthly" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={timeframe === "quarterly" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("quarterly")}
              >
                Quarterly
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">
                Potential Savings:{" "}
                <span className="font-medium text-green-600">
                  ₹{savings.toLocaleString()}
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={costData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ name, value }) => `${name}`}
                    >
                      {costData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        `₹${value.toLocaleString()}`,
                        "Amount",
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <div className="space-y-4">
                {costData.map((item, index) => (
                  <div key={item.category} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-12 rounded-sm"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        <div>
                          <div className="font-medium">{item.category}</div>
                          <div className="text-2xl font-bold">
                            ₹{item.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {item.percentage}% of total
                        </div>
                        <div
                          className={`flex items-center justify-end ${
                            item.change < 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {item.change < 0 ? (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          )}
                          <span>{Math.abs(item.change)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center space-x-4 text-sm text-muted-foreground">
                      {item.category === "Fuel" && (
                        <>
                          <div className="flex items-center space-x-1">
                            <Fuel className="h-4 w-4" />
                            <span>12,500 liters</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Truck className="h-4 w-4" />
                            <span>850 trips</span>
                          </div>
                        </>
                      )}
                      {item.category === "Maintenance" && (
                        <>
                          <div className="flex items-center space-x-1">
                            <Wrench className="h-4 w-4" />
                            <span>24 services</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>98% on-time</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Cost Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip
                  formatter={(value) => [
                    `₹${value.toLocaleString()}`,
                    "Amount",
                  ]}
                />
                <Legend />
                <Bar dataKey="fuel" name="Fuel Costs" fill="#3b82f6" />
                <Bar dataKey="maintenance" name="Maintenance" fill="#10b981" />
                <Bar dataKey="labor" name="Labor Costs" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              <TrendingDown className="h-4 w-4" />
              <span>
                Total costs decreased by 3.2% compared to last quarter
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
