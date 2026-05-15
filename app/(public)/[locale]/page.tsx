import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FaqSection } from "@/components/sections/faq-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { StatsSection } from "@/components/sections/stats-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { StructuredData } from "@/components/structured-data";
import { getPublicSiteContent, getPublicSiteSettings } from "@/lib/domain/content";
import { getSeoMetadataForPage } from "@/lib/domain/seo";
import { createLocaleMetadata } from "@/lib/seo/metadata";
import { buildAttorneySchemas } from "@/lib/seo/schema";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const normalizedLocale = locale === "ar" ? "ar" : "en";
  const [seo, siteSettings] = await Promise.all([
    getSeoMetadataForPage(normalizedLocale, "home"),
    getPublicSiteSettings(),
  ]);

  return createLocaleMetadata({
    locale,
    siteName: siteSettings.siteSettings.siteName,
    title:
      seo?.meta_title ??
      (locale === "ar"
        ? "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u062a\u0639\u0631\u064a\u0641\u064a \u0644\u0644\u0645\u062d\u0627\u0645\u064a"
        : "Lawyer Portfolio Platform"),
    description:
      seo?.meta_description ??
      (locale === "ar"
        ? "\u0645\u0646\u0635\u0629 \u0627\u062d\u062a\u0631\u0627\u0641\u064a\u0629 \u062b\u0646\u0627\u0626\u064a\u0629 \u0627\u0644\u0644\u063a\u0629 \u0644\u0639\u0631\u0636 \u0627\u0644\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0642\u0627\u0646\u0648\u0646\u064a\u0629 \u0648\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0645\u062d\u062a\u0648\u0649."
        : "A premium bilingual platform for legal services, authority, and trust."),
    path: `/${locale}`,
  });
}

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale } = await params;
  const normalizedLocale = locale === "ar" ? "ar" : "en";
  const [content, settings] = await Promise.all([
    getPublicSiteContent(normalizedLocale),
    getPublicSiteSettings(),
  ]);
  const schema = buildAttorneySchemas(locale, content, settings.siteSettings.siteName);

  return (
    <>
      <StructuredData data={schema} />
      <HeroSection locale={locale} content={content.hero} />
      <ServicesSection locale={locale} content={content.services} />
      <AboutSection locale={locale} content={content.about} />
      <StatsSection content={content.statistics} />
      <TestimonialsSection locale={locale} content={content.testimonials} />
      <FaqSection locale={locale} content={content.faqs} />
      <ContactSection locale={locale} content={content.contact} />
    </>
  );
}
