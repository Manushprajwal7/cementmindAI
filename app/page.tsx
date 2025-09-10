import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { OverviewDashboard } from "@/components/dashboard/overview-dashboard"

export default function HomePage() {
  return (
    <DashboardLayout>
      <OverviewDashboard />
    </DashboardLayout>
  )
}
