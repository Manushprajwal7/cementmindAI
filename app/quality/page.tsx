import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { QualityControlPanel } from "@/components/quality/quality-control-panel"

export default function QualityPage() {
  return (
    <DashboardLayout>
      <QualityControlPanel />
    </DashboardLayout>
  )
}
