import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { TelemetryConsole } from "@/components/telemetry/telemetry-console"

export default function TelemetryPage() {
  return (
    <DashboardLayout>
      <TelemetryConsole />
    </DashboardLayout>
  )
}
