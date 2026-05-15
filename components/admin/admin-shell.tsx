import type { ReactNode } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/admin/logout-button";
import { AdminNav } from "@/components/admin/admin-nav";
import type { AdminContext } from "@/lib/domain/admin";

export function AdminShell({
  children,
  adminContext,
}: {
  children: ReactNode;
  adminContext: AdminContext | null;
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0b0d11_0%,#0f131b_100%)]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-border bg-surface/75 p-6 backdrop-blur">
          <Link href="/admin" className="block rounded-[28px] border border-border bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.28em] text-accent">Dashboard</p>
            <h1 className="mt-3 text-2xl font-semibold text-foreground">
              Al Manzour Legal CMS
            </h1>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Premium content operations for a bilingual law firm presence.
            </p>
          </Link>
          <AdminNav />
        </aside>
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-border px-6 py-5 md:px-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-muted">
                  Editorial dashboard
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">
                  Content operations and site management
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {adminContext ? (
                  <div className="hidden rounded-full border border-border px-4 py-2 text-right sm:block">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">
                      {adminContext.adminUser.role.replace("_", " ")}
                    </p>
                    <p className="text-sm text-foreground">{adminContext.email}</p>
                  </div>
                ) : null}
                <Link
                  href="/en"
                  className="rounded-full border border-border px-5 py-3 text-sm text-foreground hover:border-accent hover:text-accent"
                >
                  View website
                </Link>
                {adminContext ? <LogoutButton /> : null}
              </div>
            </div>
          </header>
          <main className="flex-1 px-6 py-8 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
