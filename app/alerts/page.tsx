import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { AnomalyAlertsCenter } from "@/components/alerts/anomaly-alerts-center"

export default function AlertsPage() {
  return (
    <DashboardLayout>
      <AnomalyAlertsCenter />
    </DashboardLayout>
  )
}
