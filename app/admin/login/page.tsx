import { ShieldCheck } from "lucide-react";
import { AdminLoginCard } from "@/components/admin/admin-login-card";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-[32px] border border-border bg-surface/80 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">
              Admin access
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              Secure control panel
            </h1>
          </div>
        </div>
        <AdminLoginCard />
      </div>
    </div>
  );
}
