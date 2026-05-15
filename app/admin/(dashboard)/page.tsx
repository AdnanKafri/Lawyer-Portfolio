import { AdminOverview } from "@/components/admin/admin-overview";
import { requireAdminContext } from "@/lib/domain/admin";
import { getDashboardSummary } from "@/lib/domain/dashboard";

export default async function AdminPage() {
  const adminContext = await requireAdminContext();
  const stats = await getDashboardSummary(adminContext.adminUser.organization_id);

  return <AdminOverview stats={stats} />;
}
