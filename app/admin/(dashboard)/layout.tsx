import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminContext } from "@/lib/domain/admin";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const adminContext = await getAdminContext();

  return <AdminShell adminContext={adminContext}>{children}</AdminShell>;
}
