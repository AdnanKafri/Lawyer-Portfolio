import { absoluteUrl } from "@/lib/seo/metadata";

export function buildAttorneySchemas(
  locale: string,
  content: {
    hero: { title: string; description: string };
    faqs: { question: string; answer: string }[];
    contact: { phone: string; email: string; address: string };
  },
  siteName = "Al Manzour Legal",
) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LegalService",
        "@id": absoluteUrl(`/${locale}#legal-service`),
        name: siteName,
        description: content.hero.description,
        areaServed: locale === "ar" ? "الشرق الأوسط" : "Middle East",
        telephone: content.contact.phone,
        email: content.contact.email,
      },
      {
        "@type": "Attorney",
        "@id": absoluteUrl(`/${locale}#attorney`),
        name: siteName,
        url: absoluteUrl(`/${locale}`),
      },
      {
        "@type": "FAQPage",
        "@id": absoluteUrl(`/${locale}#faq`),
        mainEntity: content.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      {
        "@type": "LocalBusiness",
        "@id": absoluteUrl(`/${locale}#business`),
        name: siteName,
        address: content.contact.address,
        telephone: content.contact.phone,
        email: content.contact.email,
      },
    ],
  };
}
