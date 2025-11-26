"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wrench,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  CalendarCheck,
  Plus,
  Search,
  Filter,
  User,
  CalendarDays,
  IndianRupee,
  Activity,
  Eye,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [tasks, setTasks] = useState<MaintenanceTask[]>(
    generateMaintenanceTasks()
  );
  const [filter, setFilter] = useState<
    "all" | "pending" | "in-progress" | "completed" | "overdue"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showCustomDateDialog, setShowCustomDateDialog] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<any>(null);
  const [customDate, setCustomDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newTask, setNewTask] = useState({
    truckId: "",
    task: "",
    dueDate: new Date().toISOString().split("T")[0],
    assignedTo: "",
    priority: "medium" as "low" | "medium" | "high" | "critical",
  });

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

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === "all" || task.status === filter;
    const matchesSearch =
      task.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.truckId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const overdueCount = tasks.filter((task) => task.status === "overdue").length;
  const inProgressCount = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const pendingCount = tasks.filter((task) => task.status === "pending").length;
  const completedCount = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  // Calculate predictive maintenance indicators
  const predictiveIndicators = [
    {
      id: "pm-001",
      truckId: "T-001",
      recommendation: "Oil change recommended in 500 km",
      priority: "medium",
      estimatedCost: "₹1,200",
    },
    {
      id: "pm-002",
      truckId: "T-003",
      recommendation: "Brake inspection due soon",
      priority: "high",
      estimatedCost: "₹2,500",
    },
    {
      id: "pm-003",
      truckId: "T-005",
      recommendation: "Tire rotation recommended",
      priority: "low",
      estimatedCost: "₹800",
    },
  ];

  const handleAddTask = () => {
    if (!newTask.truckId || !newTask.task || !newTask.assignedTo) {
      alert("Please fill in all required fields");
      return;
    }

    const task: MaintenanceTask = {
      id: `mnt-${String(tasks.length + 1).padStart(3, "0")}`,
      truckId: newTask.truckId,
      task: newTask.task,
      status: "pending",
      dueDate: newTask.dueDate,
      assignedTo: newTask.assignedTo,
      priority: newTask.priority,
      completion: 0,
    };

    setTasks([...tasks, task]);
    setShowAddTaskDialog(false);
    setNewTask({
      truckId: "",
      task: "",
      dueDate: new Date().toISOString().split("T")[0],
      assignedTo: "",
      priority: "medium",
    });
    alert(`Maintenance task "${task.task}" added successfully!`);
  };

  const updateTaskStatus = (
    taskId: string,
    newStatus: MaintenanceTask["status"]
  ) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    alert(`Task status updated to ${getStatusText(newStatus)}`);
  };

  const updateTaskCompletion = (taskId: string, completion: number) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, completion } : task))
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wrench className="h-5 w-5" />
              <span>Maintenance Tracking</span>
            </div>
            <Button onClick={() => setShowAddTaskDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {completedCount}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
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

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks, trucks, or assignees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter:</span>
            </div>
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
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{task.task}</h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Truck className="h-4 w-4" />
                          <span>{task.truckId}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {task.dueDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
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

                        {/* Progress adjustment for in-progress tasks */}
                        {task.status === "in-progress" && (
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newCompletion = Math.max(
                                  0,
                                  task.completion - 10
                                );
                                updateTaskCompletion(task.id, newCompletion);
                              }}
                            >
                              -
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newCompletion = Math.min(
                                  100,
                                  task.completion + 10
                                );
                                updateTaskCompletion(task.id, newCompletion);
                              }}
                            >
                              +
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newStatus =
                            task.status === "pending"
                              ? "in-progress"
                              : task.status === "in-progress"
                              ? "completed"
                              : task.status === "completed"
                              ? "pending"
                              : "in-progress";
                          updateTaskStatus(task.id, newStatus);
                        }}
                      >
                        {task.status === "pending"
                          ? "Start"
                          : task.status === "in-progress"
                          ? "Complete"
                          : task.status === "completed"
                          ? "Reopen"
                          : "Start"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // In a real app, this would open a scheduling dialog
                          alert(
                            `Scheduling maintenance task ${task.id} for ${task.truckId}`
                          );
                        }}
                      >
                        <CalendarCheck className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // In a real app, this would open an assignment dialog
                          alert(
                            `Assigning maintenance task ${task.id} to technician`
                          );
                        }}
                      >
                        <User className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // In a real app, this would show task details
                          alert(`Viewing details for task ${task.id}`);
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Maintenance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            <span>Predictive Maintenance Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictiveIndicators.map((indicator) => (
              <div key={indicator.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">
                          {indicator.recommendation}
                        </h3>
                        <Badge className={getPriorityColor(indicator.priority)}>
                          {indicator.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Truck className="h-4 w-4" />
                          <span>{indicator.truckId}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <IndianRupee className="h-4 w-4" />
                          <span>{indicator.estimatedCost}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Create a new maintenance task based on this recommendation
                        const newTaskData = {
                          truckId: indicator.truckId,
                          task: indicator.recommendation,
                          dueDate: new Date(
                            Date.now() + 7 * 24 * 60 * 60 * 1000
                          )
                            .toISOString()
                            .split("T")[0], // 1 week from now
                          assignedTo: "Maintenance Team",
                          priority: indicator.priority as
                            | "low"
                            | "medium"
                            | "high"
                            | "critical",
                        };
                        setNewTask(newTaskData);
                        setShowAddTaskDialog(true);
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule (1w)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Open custom date dialog
                        setSelectedRecommendation(indicator);
                        setCustomDate(new Date().toISOString().split("T")[0]);
                        setShowCustomDateDialog(true);
                      }}
                    >
                      <CalendarDays className="h-4 w-4 mr-1" />
                      Custom Date
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        // Schedule for tomorrow
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const tomorrowStr = tomorrow
                          .toISOString()
                          .split("T")[0];

                        const newTaskData = {
                          truckId: indicator.truckId,
                          task: indicator.recommendation,
                          dueDate: tomorrowStr,
                          assignedTo: "Maintenance Team",
                          priority: indicator.priority as
                            | "low"
                            | "medium"
                            | "high"
                            | "critical",
                        };
                        setNewTask(newTaskData);
                        setShowAddTaskDialog(true);
                        alert(
                          `Maintenance task scheduled for tomorrow (${tomorrowStr})`
                        );
                      }}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Tomorrow
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Show detailed information about this recommendation
                        alert(
                          `Recommendation Details:
Truck: ${indicator.truckId}
Task: ${indicator.recommendation}
Priority: ${indicator.priority}
Estimated Cost: ${indicator.estimatedCost}

This recommendation is based on predictive analytics and vehicle usage patterns.`
                        );
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Dismiss this recommendation
                        alert(
                          `Recommendation for ${indicator.truckId} has been dismissed. It will not appear again unless conditions change.`
                        );
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600" />
              AI-Powered Maintenance Insights
            </h4>
            <p className="text-sm text-blue-700">
              Our predictive maintenance system analyzes vehicle data, usage
              patterns, and historical records to recommend proactive
              maintenance actions. This helps prevent unexpected breakdowns and
              extends vehicle lifespan while reducing overall maintenance costs.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Custom Date Dialog */}
      <Dialog
        open={showCustomDateDialog}
        onOpenChange={setShowCustomDateDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              <span>Schedule Maintenance</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedRecommendation && (
              <div className="space-y-2">
                <div className="text-sm">
                  <div className="font-medium">Truck ID</div>
                  <div>{selectedRecommendation.truckId}</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Task</div>
                  <div>{selectedRecommendation.recommendation}</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Priority</div>
                  <div className="capitalize">
                    {selectedRecommendation.priority}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Estimated Cost</div>
                  <div>{selectedRecommendation.estimatedCost}</div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCustomDateDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedRecommendation) {
                    const newTaskData = {
                      truckId: selectedRecommendation.truckId,
                      task: selectedRecommendation.recommendation,
                      dueDate: customDate,
                      assignedTo: "Maintenance Team",
                      priority: selectedRecommendation.priority as
                        | "low"
                        | "medium"
                        | "high"
                        | "critical",
                    };
                    setNewTask(newTaskData);
                    setShowCustomDateDialog(false);
                    setShowAddTaskDialog(true);
                    alert(`Maintenance task scheduled for ${customDate}`);
                  }
                }}
              >
                Schedule Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              <span>Add Maintenance Task</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Truck ID</label>
              <Input
                placeholder="e.g., T-001"
                value={newTask.truckId}
                onChange={(e) =>
                  setNewTask({ ...newTask, truckId: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Task Description</label>
              <Textarea
                placeholder="Describe the maintenance task..."
                value={newTask.task}
                onChange={(e) =>
                  setNewTask({ ...newTask, task: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assigned To</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Technician name"
                  value={newTask.assignedTo}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignedTo: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={newTask.priority}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, priority: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddTaskDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddTask}>Add Task</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
