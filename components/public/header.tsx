"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { PendingLink } from "@/components/public/pending-link";
import { publicNavigation } from "@/lib/constants/navigation";
import { getDirection, swapLocale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";
import type { SiteSettings } from "@/types/domain";

export function Header({
  locale,
  siteSettings,
}: {
  locale: string;
  siteSettings: SiteSettings;
}) {
  const nextLocale = swapLocale(locale);
  const dir = getDirection(locale);
  const isArabic = locale === "ar";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const initials = siteSettings.siteName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 px-[var(--section-space-x)] pt-4"
      dir={dir}
    >
      <Reveal>
        <motion.div
          animate={{
            boxShadow: isScrolled
              ? "0 18px 55px rgba(0,0,0,0.34)"
              : "0 8px 28px rgba(0,0,0,0.12)",
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "mx-auto max-w-[var(--container)] rounded-[1.25rem] border backdrop-blur-xl",
            isScrolled
              ? "border-border-strong bg-background/88"
              : "border-white/8 bg-black/18",
          )}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5 lg:px-6">
            <Link
              href={`/${locale}`}
              className="flex min-w-0 items-center gap-3"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white/[0.04] text-sm font-semibold text-accent">
                {siteSettings.logoUrl ? (
                  <Image
                    src={siteSettings.logoUrl}
                    alt={siteSettings.siteName}
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[0.92rem] font-semibold tracking-[0.02em] text-foreground">
                  {siteSettings.siteName}
                </p>
                <p className="truncate text-[0.68rem] uppercase tracking-[0.26em] text-muted">
                  {siteSettings.tagline ??
                    (isArabic
                      ? "مكتب قانوني واستشارات تجارية"
                      : "Commercial law and dispute strategy")}
                </p>
              </div>
            </Link>
            <nav className="hidden items-center gap-1 lg:flex">
              {publicNavigation(locale).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-[0.82rem] text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <PendingLink
                href={`/${nextLocale}`}
                className="rounded-full px-3 py-2 text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground transition hover:bg-white/[0.04] hover:text-foreground"
              >
                {nextLocale.toUpperCase()}
              </PendingLink>
              <PendingLink
                href="/admin/login"
                className="hidden rounded-full border border-border bg-white/[0.03] px-4 py-2 text-[0.68rem] uppercase tracking-[0.24em] text-foreground transition hover:border-accent hover:text-accent sm:block"
              >
                Admin
              </PendingLink>
              <button
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/[0.03] text-muted-foreground lg:hidden"
                aria-label={isOpen ? "Close navigation" : "Open navigation"}
                aria-controls="public-mobile-navigation"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((current) => !current)}
                type="button"
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <AnimatePresence initial={false}>
            {isOpen ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                id="public-mobile-navigation"
                className="overflow-hidden border-t border-border lg:hidden"
              >
                <nav
                  aria-label="Mobile navigation"
                  className="grid gap-1 px-4 py-4"
                >
                  {publicNavigation(locale).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="rounded-xl border-b border-border/60 px-4 py-3 text-sm text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <PendingLink
                    href="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl px-4 py-3 text-sm text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
                  >
                    Admin
                  </PendingLink>
                </nav>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </Reveal>
    </header>
  );
}
