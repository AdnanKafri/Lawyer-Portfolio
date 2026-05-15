"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { adminNavigation } from "@/lib/constants/navigation";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 grid gap-2">
      {adminNavigation.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-2xl border px-4 py-3 text-sm transition",
              isActive
                ? "border-border-strong bg-white/[0.06] text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.16)]"
                : "border-transparent text-muted-foreground hover:border-border hover:bg-white/[0.04] hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
