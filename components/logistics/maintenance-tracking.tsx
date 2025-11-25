"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Wrench,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  CalendarCheck,
} from "lucide-react";

interface MaintenanceTask {
  id: string;
  truckId: string;
  task: string;
  status: "pending" | "in-progress" | "completed" | "overdue";
  dueDate: string;
  assignedTo: string;
  priority: "low" | "medium" | "high" | "critical";
  completion: number;
}

const generateMaintenanceTasks = (): MaintenanceTask[] => [
  {
    id: "mnt-001",
    truckId: "T-001",
    task: "Engine Oil Change",
    status: "completed",
    dueDate: "2023-06-15",
    assignedTo: "Mike Johnson",
    priority: "medium",
    completion: 100,
  },
  {
    id: "mnt-002",
    truckId: "T-002",
    task: "Brake Inspection",
    status: "in-progress",
    dueDate: "2023-06-20",
    assignedTo: "Sarah Williams",
    priority: "high",
    completion: 60,
  },
  {
    id: "mnt-003",
    truckId: "T-003",
    task: "Tire Rotation",
    status: "pending",
    dueDate: "2023-06-25",
    assignedTo: "Tom Brown",
    priority: "low",
    completion: 0,
  },
  {
    id: "mnt-004",
    truckId: "T-001",
    task: "Coolant System Check",
    status: "overdue",
    dueDate: "2023-06-10",
    assignedTo: "Mike Johnson",
    priority: "critical",
    completion: 0,
  },
];

export function MaintenanceTracking() {
  const [tasks] = useState<MaintenanceTask[]>(generateMaintenanceTasks());
  const [filter, setFilter] = useState<
    "all" | "pending" | "in-progress" | "completed" | "overdue"
  >("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "overdue":
        return "Overdue";
      default:
        return "Pending";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  const overdueCount = tasks.filter((task) => task.status === "overdue").length;
  const inProgressCount = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const pendingCount = tasks.filter((task) => task.status === "pending").length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wrench className="h-5 w-5" />
            <span>Maintenance Tracking</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Overdue
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {overdueCount}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      In Progress
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {inProgressCount}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {pendingCount}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-gray-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Tasks
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {tasks.length}
                    </p>
                  </div>
                  <Wrench className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All Tasks
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={filter === "in-progress" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("in-progress")}
            >
              In Progress
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
            >
              Completed
            </Button>
            <Button
              variant={filter === "overdue" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("overdue")}
            >
              Overdue
            </Button>
          </div>

          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">{getStatusIcon(task.status)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{task.task}</h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Truck className="h-4 w-4" />
                          <span>{task.truckId}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {task.dueDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Wrench className="h-4 w-4" />
                          <span>{task.assignedTo}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">
                            Progress
                          </span>
                          <span className="text-sm font-medium">
                            {task.completion}%
                          </span>
                        </div>
                        <Progress value={task.completion} className="w-full" />
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <CalendarCheck className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                    <Button variant="outline" size="sm">
                      Assign
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
