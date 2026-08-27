"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { adminNavigation } from "@/lib/constants/navigation";

function navLinkClass(isActive: boolean) {
  return cn(
    "block rounded-2xl border px-4 py-3 text-sm transition",
    isActive
      ? "border-border-strong bg-white/[0.06] text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.16)]"
      : "border-transparent text-muted-foreground hover:border-border hover:bg-white/[0.04] hover:text-foreground",
  );
}

export function AdminNav({
  variant = "desktop",
}: {
  variant?: "desktop" | "mobile";
}) {
  const pathname = usePathname();
  const [hydratedPath, setHydratedPath] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const mobileNavId = useId();
  const activePath = hydratedPath || pathname;

  useEffect(() => {
    setHydratedPath(pathname);
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const links = (
    <nav
      aria-label="Admin navigation"
      className={variant === "desktop" ? "mt-8 grid gap-2" : "grid gap-2"}
    >
      {adminNavigation.map((item) => {
        const isActive =
          item.href === "/admin"
            ? activePath === item.href
            : activePath === item.href ||
              activePath.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            onClick={() => variant === "mobile" && setIsOpen(false)}
            className={navLinkClass(isActive)}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  if (variant === "desktop") {
    return links;
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={isOpen ? "Close admin navigation" : "Open admin navigation"}
        aria-expanded={isOpen}
        aria-controls={mobileNavId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/[0.03] text-muted-foreground transition hover:border-border-strong hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {isOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
      {isOpen ? (
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
              triggerRef.current?.focus();
            }
          }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onMouseDown={() => {
              setIsOpen(false);
              triggerRef.current?.focus();
            }}
          />
          <aside
            id={mobileNavId}
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            onMouseDown={(event) => event.stopPropagation()}
            className="absolute inset-y-0 left-0 w-[min(21rem,86vw)] border-r border-border bg-surface/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.28em] text-accent">
                Dashboard menu
              </p>
              <button
                ref={closeRef}
                type="button"
                aria-label="Close admin navigation"
                onClick={() => {
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-border-strong hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6">{links}</div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
