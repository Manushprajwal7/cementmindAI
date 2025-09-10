"use client"

import { useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  flexRender,
  type SortingState,
} from "@tanstack/react-table"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, MoreHorizontal, User, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { AnomalyDetail } from "@/types/anomaly"
import { cn } from "@/lib/utils"

interface AlertsTableProps {
  data: AnomalyDetail[]
  onRowClick: (anomaly: AnomalyDetail) => void
}

export function AlertsTable({ data, onRowClick }: AlertsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const severityColors = {
    low: "bg-blue-100 text-blue-800 border-blue-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  }

  const statusColors = {
    new: "bg-red-100 text-red-800 border-red-200",
    acknowledged: "bg-amber-100 text-amber-800 border-amber-200",
    investigating: "bg-blue-100 text-blue-800 border-blue-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
  }

  const columns = useMemo<ColumnDef<AnomalyDetail>[]>(
    () => [
      {
        accessorKey: "timestamp",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Time
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue("timestamp"))
          return (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{date.toLocaleDateString()}</div>
                <div className="text-sm text-muted-foreground">{date.toLocaleTimeString()}</div>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "type",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => <div className="font-medium">{row.getValue("type")}</div>,
      },
      {
        accessorKey: "severity",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Severity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const severity = row.getValue("severity") as keyof typeof severityColors
          return (
            <Badge variant="outline" className={severityColors[severity]}>
              {severity.toUpperCase()}
            </Badge>
          )
        },
      },
      {
        accessorKey: "affected_sensors",
        header: "Affected Sensors",
        cell: ({ row }) => {
          const sensors = row.getValue("affected_sensors") as AnomalyDetail["affected_sensors"]
          return (
            <div className="space-y-1">
              {sensors.slice(0, 2).map((sensor, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{sensor.sensor}</span>
                  <span className="text-muted-foreground ml-2">({sensor.deviation_percent.toFixed(1)}%)</span>
                </div>
              ))}
              {sensors.length > 2 && <div className="text-xs text-muted-foreground">+{sensors.length - 2} more</div>}
            </div>
          )
        },
      },
      {
        accessorKey: "confidence",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Confidence
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const confidence = row.getValue("confidence") as number
          return <div className="font-medium">{(confidence * 100).toFixed(1)}%</div>
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as keyof typeof statusColors
          return (
            <Badge variant="outline" className={statusColors[status]}>
              {status.toUpperCase()}
            </Badge>
          )
        },
      },
      {
        accessorKey: "assignee",
        header: "Assignee",
        cell: ({ row }) => {
          const assignee = row.getValue("assignee") as string | null
          return assignee ? (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{assignee}</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Unassigned</span>
          )
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const anomaly = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onRowClick(anomaly)}>View Details</DropdownMenuItem>
                <DropdownMenuItem>Acknowledge</DropdownMenuItem>
                <DropdownMenuItem>Assign to Me</DropdownMenuItem>
                <DropdownMenuItem>Snooze</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [onRowClick],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={cn(
                  "cursor-pointer hover:bg-muted/50",
                  row.original.status === "new" && "bg-red-50/50",
                  row.original.severity === "critical" && "border-l-4 border-l-red-500",
                )}
                onClick={() => onRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No anomalies found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
