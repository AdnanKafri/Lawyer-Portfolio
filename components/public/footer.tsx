import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { PendingLink } from "@/components/public/pending-link";
import { publicNavigation } from "@/lib/constants/navigation";
import type { SiteSettings, SocialLink } from "@/types/domain";

type FooterProps = {
  locale: string;
  siteSettings: SiteSettings;
  socialLinks: SocialLink[];
};

export function Footer({ locale, siteSettings, socialLinks }: FooterProps) {
  const isArabic = locale === "ar";
  const year = new Date().getFullYear();
  const activeSocialLinks = socialLinks.filter(
    (link) => link.isActive !== false,
  );
  const navItems = publicNavigation(locale);
  const initials = siteSettings.siteName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <footer className="px-[var(--section-space-x)] pb-8 pt-6">
      <Reveal>
        <div className="mx-auto max-w-[var(--container)] rounded-[1.35rem] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-6 py-8 shadow-[0_28px_80px_rgba(0,0,0,0.24)] sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white/[0.04] text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-accent">
                  {siteSettings.logoUrl ? (
                    <Image
                      src={siteSettings.logoUrl}
                      alt={siteSettings.siteName}
                      width={48}
                      height={48}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold tracking-[0.02em] text-foreground">
                    {siteSettings.siteName}
                  </p>
                  <p className="truncate text-[0.68rem] uppercase tracking-[0.26em] text-muted-foreground">
                    {siteSettings.tagline ??
                      (isArabic
                        ? "مكتب قانوني واستشارات تجارية"
                        : "Commercial law and dispute strategy")}
                  </p>
                </div>
              </div>

              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                {isArabic
                  ? "تم تصميم هذا الموقع ليعرض المكتب بصورة هادئة وموثوقة، مع تركيز واضح على السرية، والوضوح، والتمثيل القانوني الجاد."
                  : "This site is designed to present the practice with calm authority, emphasizing confidentiality, clarity, and serious legal representation."}
              </p>

              <div className="space-y-3">
                {[
                  {
                    icon: Phone,
                    label: isArabic ? "الهاتف" : "Phone",
                    value: siteSettings.primaryPhone,
                    href: siteSettings.primaryPhone
                      ? `tel:${siteSettings.primaryPhone}`
                      : undefined,
                  },
                  {
                    icon: Mail,
                    label: isArabic ? "البريد" : "Email",
                    value: siteSettings.primaryEmail,
                    href: siteSettings.primaryEmail
                      ? `mailto:${siteSettings.primaryEmail}`
                      : undefined,
                  },
                  {
                    icon: MapPin,
                    label: isArabic ? "المكتب" : "Office",
                    value: siteSettings.officeAddress,
                  },
                ]
                  .filter((item) => Boolean(item.value))
                  .map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white/[0.03] text-accent">
                        <item.icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-muted">
                          {item.label}
                        </p>
                        {item.href ? (
                          <Link
                            href={item.href}
                            className="mt-1 block text-sm font-medium text-foreground transition hover:text-accent"
                          >
                            {item.value}
                          </Link>
                        ) : (
                          <p className="mt-1 text-sm font-medium text-foreground">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <p className="eyebrow mb-5">{isArabic ? "التنقل" : "Navigate"}</p>
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="border-b border-border/60 px-1 py-3 text-sm text-muted-foreground transition hover:border-accent hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="eyebrow mb-5">{isArabic ? "تواصل" : "Connect"}</p>
                <div className="flex flex-wrap gap-3">
                  {activeSocialLinks.length > 0 ? (
                    activeSocialLinks.map((link) => (
                      <Link
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-4 py-2 text-sm text-foreground transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm leading-7 text-muted-foreground">
                      {isArabic
                        ? "ستظهر الروابط الاجتماعية هنا بعد تفعيلها من لوحة التحكم."
                        : "Social links will appear here once they are enabled in the dashboard."}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-border bg-black/14 p-5">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-accent">
                  {isArabic ? "ملاحظة قانونية" : "Legal note"}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {isArabic
                    ? "الموقع مخصص للتعريف بالمكتب والخدمات العامة، ولا يشكل استشارة قانونية في أي ملف بعينه."
                    : "This website is intended to introduce the practice and services. It does not constitute legal advice for any specific matter."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-border pt-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {siteSettings.siteName}.{" "}
              {isArabic ? "جميع الحقوق محفوظة." : "All rights reserved."}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <PendingLink
                href={`/${locale}/legal/privacy`}
                className="transition hover:text-foreground"
              >
                {isArabic ? "الخصوصية" : "Privacy"}
              </PendingLink>
              <span className="text-border">/</span>
              <PendingLink
                href={`/${locale}/legal/terms`}
                className="transition hover:text-foreground"
              >
                {isArabic ? "الشروط" : "Terms"}
              </PendingLink>
              <span className="text-border">/</span>
              <Link
                href={`/${locale}#hero`}
                className="transition hover:text-foreground"
              >
                {isArabic ? "أعلى الصفحة" : "Back to top"}
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
