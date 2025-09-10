"use client"

import { useMemo, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, Eye, CheckCircle, UserPlus } from "lucide-react"

interface Alert {
  id: string
  timestamp: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  affected_sensors: string[]
  confidence: number
  status: "new" | "acknowledged" | "assigned" | "resolved"
  assignee?: string
  message: string
}

interface VirtualizedAlertsTableProps {
  alerts: Alert[]
  onAcknowledge: (alertIds: string[]) => void
  onAssign: (alertIds: string[], assignee: string) => void
  onView: (alert: Alert) => void
}

export function VirtualizedAlertsTable({ alerts, onAcknowledge, onAssign, onView }: VirtualizedAlertsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [severityFilter, setSeverityFilter] = useState<string>("all")

  const tableContainerRef = useRef<HTMLDivElement>(null)

  const columns = useMemo<ColumnDef<Alert>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "timestamp",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => new Date(row.getValue("timestamp")).toLocaleString(),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {row.getValue("type")}
          </Badge>
        ),
      },
      {
        accessorKey: "severity",
        header: "Severity",
        cell: ({ row }) => {
          const severity = row.getValue("severity") as string
          const colors = {
            low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
            medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
            high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
            critical: "bg-red-500/10 text-red-500 border-red-500/20",
          }
          return <Badge className={colors[severity as keyof typeof colors]}>{severity.toUpperCase()}</Badge>
        },
      },
      {
        accessorKey: "affected_sensors",
        header: "Affected Sensors",
        cell: ({ row }) => {
          const sensors = row.getValue("affected_sensors") as string[]
          return (
            <div className="flex flex-wrap gap-1">
              {sensors.slice(0, 2).map((sensor) => (
                <Badge key={sensor} variant="secondary" className="text-xs">
                  {sensor}
                </Badge>
              ))}
              {sensors.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{sensors.length - 2}
                </Badge>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: "confidence",
        header: "Confidence",
        cell: ({ row }) => {
          const confidence = row.getValue("confidence") as number
          return `${(confidence * 100).toFixed(1)}%`
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string
          const colors = {
            new: "bg-blue-500/10 text-blue-500 border-blue-500/20",
            acknowledged: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
            assigned: "bg-purple-500/10 text-purple-500 border-purple-500/20",
            resolved: "bg-green-500/10 text-green-500 border-green-500/20",
          }
          return <Badge className={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Badge>
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onView(row.original)}>
              <Eye className="h-4 w-4" />
            </Button>
            {row.original.status === "new" && (
              <Button variant="ghost" size="sm" onClick={() => onAcknowledge([row.original.id])}>
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [onAcknowledge, onView],
  )

  const filteredData = useMemo(() => {
    if (severityFilter === "all") return alerts
    return alerts.filter((alert) => alert.severity === severityFilter)
  }, [alerts, severityFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 60,
    overscan: 10,
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedAlertIds = selectedRows.map((row) => row.original.id)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Filter alerts..."
            value={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("type")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedAlertIds.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">{selectedAlertIds.length} selected</span>
            <Button size="sm" onClick={() => onAcknowledge(selectedAlertIds)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Acknowledge
            </Button>
            <Button size="sm" variant="outline" onClick={() => onAssign(selectedAlertIds, "operator-1")}>
              <UserPlus className="h-4 w-4 mr-2" />
              Assign
            </Button>
          </div>
        )}
      </div>

      <div ref={tableContainerRef} className="h-[600px] overflow-auto border rounded-md" style={{ contain: "strict" }}>
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
          <table className="w-full">
            <thead className="sticky top-0 bg-background border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-left font-medium">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index]
                return (
                  <tr
                    key={row.id}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="absolute w-full border-b hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
