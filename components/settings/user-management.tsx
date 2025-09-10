"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, UserPlus, Shield, Mail, MoreHorizontal } from "lucide-react"

interface SystemUser {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "operator" | "viewer"
  department: string
  status: "active" | "inactive" | "pending"
  lastLogin?: Date
  createdAt: Date
  permissions: string[]
}

interface UserRole {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
}

const mockUsers: SystemUser[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@company.com",
    role: "admin",
    department: "IT",
    status: "active",
    lastLogin: new Date("2024-01-09T16:30:00"),
    createdAt: new Date("2023-06-15"),
    permissions: ["all"],
  },
  {
    id: "2",
    name: "Maria Garcia",
    email: "maria.garcia@company.com",
    role: "manager",
    department: "Production",
    status: "active",
    lastLogin: new Date("2024-01-09T14:15:00"),
    createdAt: new Date("2023-08-20"),
    permissions: ["view_production", "manage_quality", "view_reports"],
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@company.com",
    role: "operator",
    department: "Operations",
    status: "active",
    lastLogin: new Date("2024-01-09T12:45:00"),
    createdAt: new Date("2023-11-10"),
    permissions: ["view_telemetry", "acknowledge_alerts"],
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    role: "viewer",
    department: "Quality",
    status: "pending",
    createdAt: new Date("2024-01-08"),
    permissions: ["view_quality", "view_reports"],
  },
]

const mockRoles: UserRole[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full system access and user management",
    permissions: ["all"],
    userCount: 1,
  },
  {
    id: "manager",
    name: "Manager",
    description: "Department management and reporting access",
    permissions: ["view_production", "manage_quality", "view_reports", "manage_users"],
    userCount: 3,
  },
  {
    id: "operator",
    name: "Operator",
    description: "Operational monitoring and basic controls",
    permissions: ["view_telemetry", "acknowledge_alerts", "view_logistics"],
    userCount: 8,
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access to reports and dashboards",
    permissions: ["view_reports", "view_quality"],
    userCount: 5,
  },
]

export function UserManagement() {
  const [users, setUsers] = useState(mockUsers)
  const [roles, setRoles] = useState(mockRoles)
  const [activeTab, setActiveTab] = useState("users")
  const [showNewUserForm, setShowNewUserForm] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "viewer" as const,
    department: "",
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "manager":
        return "bg-blue-100 text-blue-800"
      case "operator":
        return "bg-green-100 text-green-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateUser = () => {
    const user: SystemUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      status: "pending",
      createdAt: new Date(),
      permissions: roles.find((r) => r.id === newUser.role)?.permissions || [],
    }

    setUsers((prev) => [...prev, user])
    setNewUser({ name: "", email: "", role: "viewer", department: "" })
    setShowNewUserForm(false)
  }

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : ("active" as const) } : user,
      ),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">User Management</h3>
          <p className="text-muted-foreground">Manage system users and access permissions</p>
        </div>
        <Button onClick={() => setShowNewUserForm(true)} className="bg-red-600 hover:bg-red-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              </div>
              <User className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold text-green-600">{users.filter((u) => u.status === "active").length}</p>
              </div>
              <Shield className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Invites</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {users.filter((u) => u.status === "pending").length}
                </p>
              </div>
              <Mail className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">User Roles</p>
                <p className="text-2xl font-bold text-purple-600">{roles.length}</p>
              </div>
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* New User Form */}
          {showNewUserForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New User</CardTitle>
                <CardDescription>Create a new user account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      placeholder="Enter full name"
                      value={newUser.name}
                      onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={newUser.email}
                      onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value: any) => setNewUser((prev) => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Department</label>
                    <Select
                      value={newUser.department}
                      onValueChange={(value) => setNewUser((prev) => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Production">Production</SelectItem>
                        <SelectItem value="Quality">Quality</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="Logistics">Logistics</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Management">Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateUser} className="bg-red-600 hover:bg-red-700">
                    Create User
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewUserForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users List */}
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <Badge className={getRoleColor(user.role)}>{user.role.toUpperCase()}</Badge>
                        <Badge className={getStatusColor(user.status)}>{user.status.toUpperCase()}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Department</p>
                          <p className="font-medium">{user.department}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p className="font-medium">{user.createdAt.toLocaleDateString()}</p>
                        </div>
                        {user.lastLogin && (
                          <div>
                            <p className="text-muted-foreground">Last Login</p>
                            <p className="font-medium">{user.lastLogin.toLocaleString()}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-muted-foreground">Permissions</p>
                          <p className="font-medium">{user.permissions.length} permissions</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={user.status === "active"}
                            onCheckedChange={() => toggleUserStatus(user.id)}
                          />
                          <span className="text-sm">{user.status === "active" ? "Active" : "Inactive"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        {role.name}
                      </CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{role.userCount} users</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Permissions</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {permission.replace("_", " ").toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Edit Role
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      View Users
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Activity Log</CardTitle>
              <CardDescription>Recent user actions and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { user: "John Smith", action: "Logged in", time: "2 minutes ago", type: "login" },
                  { user: "Maria Garcia", action: "Generated quality report", time: "15 minutes ago", type: "report" },
                  { user: "Robert Johnson", action: "Acknowledged alert #ALT-001", time: "1 hour ago", type: "alert" },
                  { user: "Sarah Wilson", action: "Account created", time: "2 hours ago", type: "account" },
                  { user: "John Smith", action: "Updated user permissions", time: "3 hours ago", type: "admin" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
