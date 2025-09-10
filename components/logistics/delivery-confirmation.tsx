"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, MapPin, Camera, FileText, AlertCircle } from "lucide-react"
import type { TruckSchedule } from "@/types/logistics"

interface DeliveryConfirmation {
  id: string
  truckId: string
  truckNumber: string
  deliveryId: string
  customerName: string
  deliveryAddress: string
  scheduledTime: Date
  actualDeliveryTime?: Date
  status: "pending" | "in-transit" | "delivered" | "failed" | "delayed"
  quantity: number
  customerSignature?: string
  driverNotes?: string
  photos?: string[]
  confirmationCode?: string
}

const mockDeliveries: DeliveryConfirmation[] = [
  {
    id: "1",
    truckId: "truck-001",
    truckNumber: "T-001",
    deliveryId: "DEL-2024-001",
    customerName: "ABC Construction Co.",
    deliveryAddress: "123 Main St, New York, NY 10001",
    scheduledTime: new Date("2024-01-09T14:30:00"),
    actualDeliveryTime: new Date("2024-01-09T14:25:00"),
    status: "delivered",
    quantity: 25,
    confirmationCode: "ABC123",
    driverNotes: "Delivered to loading dock as requested. Customer satisfied with quality.",
  },
  {
    id: "2",
    truckId: "truck-002",
    truckNumber: "T-002",
    deliveryId: "DEL-2024-002",
    customerName: "Metro Building Corp.",
    deliveryAddress: "456 Oak Ave, Brooklyn, NY 11201",
    scheduledTime: new Date("2024-01-09T15:15:00"),
    status: "in-transit",
    quantity: 30,
  },
  {
    id: "3",
    truckId: "truck-003",
    truckNumber: "T-003",
    deliveryId: "DEL-2024-003",
    customerName: "City Infrastructure Ltd.",
    deliveryAddress: "789 Pine St, Queens, NY 11375",
    scheduledTime: new Date("2024-01-09T16:00:00"),
    status: "delayed",
    quantity: 20,
    driverNotes: "Traffic delay on highway. ETA updated to 16:30.",
  },
]

interface DeliveryConfirmationProps {
  trucks: TruckSchedule[]
}

export function DeliveryConfirmation({ trucks }: DeliveryConfirmationProps) {
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryConfirmation | null>(null)
  const [activeTab, setActiveTab] = useState("pending")
  const [confirmationForm, setConfirmationForm] = useState({
    quantity: "",
    notes: "",
    signature: "",
    photos: [] as string[],
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in-transit":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "delayed":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "in-transit":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-gray-600" />
      case "delayed":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const handleConfirmDelivery = (deliveryId: string) => {
    console.log("[v0] Confirming delivery:", deliveryId, confirmationForm)
    // Simulate delivery confirmation
  }

  const pendingDeliveries = mockDeliveries.filter((d) => d.status === "pending" || d.status === "in-transit")
  const completedDeliveries = mockDeliveries.filter((d) => d.status === "delivered")
  const issueDeliveries = mockDeliveries.filter((d) => d.status === "delayed" || d.status === "failed")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Delivery Confirmation</h3>
          <p className="text-muted-foreground">Track and confirm cement deliveries</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <FileText className="w-4 h-4 mr-2" />
          Delivery Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Deliveries</p>
                <p className="text-2xl font-bold text-blue-600">{pendingDeliveries.length}</p>
              </div>
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold text-green-600">{completedDeliveries.length}</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Issues/Delays</p>
                <p className="text-2xl font-bold text-yellow-600">{issueDeliveries.length}</p>
              </div>
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">On-Time Rate</p>
                <p className="text-2xl font-bold text-green-600">94%</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending Deliveries</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="confirm">Confirm Delivery</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingDeliveries.map((delivery) => (
            <Card key={delivery.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{delivery.deliveryId}</h3>
                      <Badge className={getStatusColor(delivery.status)}>
                        {getStatusIcon(delivery.status)}
                        {delivery.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Customer</p>
                        <p className="font-medium">{delivery.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Truck</p>
                        <p className="font-medium">{delivery.truckNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p className="font-medium">{delivery.quantity} tons</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground">Delivery Address</p>
                        <p className="font-medium">{delivery.deliveryAddress}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Scheduled Time</p>
                      <p className="font-medium">{delivery.scheduledTime.toLocaleString()}</p>
                    </div>
                    {delivery.driverNotes && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Driver Notes:</p>
                        <p className="text-sm">{delivery.driverNotes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      Track Location
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Contact Driver
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedDeliveries.map((delivery) => (
            <Card key={delivery.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{delivery.deliveryId}</h3>
                      <Badge className={getStatusColor(delivery.status)}>
                        {getStatusIcon(delivery.status)}
                        DELIVERED
                      </Badge>
                      {delivery.confirmationCode && <Badge variant="outline">Code: {delivery.confirmationCode}</Badge>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Customer</p>
                        <p className="font-medium">{delivery.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Delivered</p>
                        <p className="font-medium">{delivery.actualDeliveryTime?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p className="font-medium">{delivery.quantity} tons</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-medium text-green-600">✓ Confirmed</p>
                      </div>
                    </div>
                    {delivery.driverNotes && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Delivery Notes:</p>
                        <p className="text-sm">{delivery.driverNotes}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline">
                      View Receipt
                    </Button>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      Download POD
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="confirm" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Confirm Delivery</CardTitle>
              <CardDescription>Complete delivery confirmation with customer signature and photos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Delivery ID</label>
                    <Input placeholder="Enter delivery ID" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Quantity Delivered (tons)</label>
                    <Input
                      type="number"
                      placeholder="Enter actual quantity"
                      value={confirmationForm.quantity}
                      onChange={(e) => setConfirmationForm((prev) => ({ ...prev, quantity: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Delivery Notes</label>
                    <Textarea
                      placeholder="Enter any delivery notes or special instructions"
                      value={confirmationForm.notes}
                      onChange={(e) => setConfirmationForm((prev) => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Customer Signature</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Capture customer signature</p>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        Open Signature Pad
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Delivery Photos</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Take photos of delivery</p>
                      <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                        <Camera className="w-4 h-4 mr-2" />
                        Take Photos
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button className="bg-green-600 hover:bg-green-700 flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Delivery
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Report Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
