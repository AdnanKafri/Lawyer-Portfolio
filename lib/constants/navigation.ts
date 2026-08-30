export const adminNavigation = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/content/hero", label: "Hero" },
  { href: "/admin/content/services", label: "Services" },
  { href: "/admin/content/about", label: "About" },
  { href: "/admin/content/statistics", label: "Statistics" },
  { href: "/admin/content/testimonials", label: "Testimonials" },
  { href: "/admin/content/faqs", label: "FAQs" },
  { href: "/admin/content/contact", label: "Contact" },
  { href: "/admin/content/social-links", label: "Social links" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/settings", label: "Site settings" },
];

export function publicNavigation(locale: string) {
  const isArabic = locale === "ar";

  return [
    { href: `/${locale}#hero`, label: isArabic ? "الرئيسية" : "Home" },
    { href: `/${locale}#services`, label: isArabic ? "الخدمات" : "Services" },
    { href: `/${locale}#about`, label: isArabic ? "نبذة" : "About" },
    {
      href: `/${locale}#testimonials`,
      label: isArabic ? "الآراء" : "Testimonials",
    },
    { href: `/${locale}#faq`, label: isArabic ? "الأسئلة" : "FAQ" },
    { href: `/${locale}#contact`, label: isArabic ? "التواصل" : "Contact" },
  ].filter((item) => !item.href.endsWith("#testimonials"));
}
