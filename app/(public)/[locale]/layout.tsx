import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/public/footer";
import { Header } from "@/components/public/header";
import { getDirection, hasLocale, locales } from "@/lib/i18n/config";
import { getPublicSiteSettings } from "@/lib/domain/content";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const { siteSettings, socialLinks } = await getPublicSiteSettings();

  if (!hasLocale(locale)) {
    notFound();
  }

  return (
    <div
      className={locale === "ar" ? "min-h-screen font-arabic" : "min-h-screen"}
      dir={getDirection(locale)}
      lang={locale}
    >
      <Header locale={locale} siteSettings={siteSettings} />
      <main>{children}</main>
      <Footer locale={locale} siteSettings={siteSettings} socialLinks={socialLinks} />
    </div>
  );
}
