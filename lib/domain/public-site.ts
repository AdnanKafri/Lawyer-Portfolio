import type {
  AboutContent,
  ContactInfo,
  FaqItem,
  HeroContent,
  ServiceItem,
  SiteSettings,
  SocialLink,
  StatisticItem,
  TestimonialItem,
} from "@/types/domain";
import {
  BRAND_EMAIL,
  BRAND_LINKEDIN_URL,
  BRAND_NAME,
  BRAND_TAGLINE,
} from "@/lib/constants/brand";

function createHero(locale: string): HeroContent {
  const isArabic = locale === "ar";

  return {
    eyebrow: isArabic ? "محمد نور" : "Mohammad Nour",
    title: isArabic
      ? "محاماة تجارية رصينة للشركات والأفراد"
      : "Commercial counsel for businesses and disputes",
    description: isArabic
      ? "نقدم استشارات قانونية هادئة وتمثيلًا مهنيًا في العقود والنزاعات والمسائل التجارية الحساسة، مع تركيز واضح على السرية وسرعة الاستجابة."
      : "We advise founders, executives, investors, and private clients on commercial risk, dispute strategy, contracts, and high-stakes decisions with calm precision.",
    primaryCta: isArabic ? "احجز استشارة" : "Book a consultation",
    secondaryCta: isArabic ? "استعرض مجالات العمل" : "Explore practice areas",
    trustPoints: isArabic
      ? ["استجابة خلال 24 ساعة", "سرية مهنية", "العربية والإنجليزية"]
      : ["Response within 24 hours", "Strict confidentiality", "Bilingual representation"],
    previewPanels: isArabic
      ? [
          {
            title: "النزاعات التجارية",
            description: "استراتيجية هادئة للتفاوض والمطالبات والمواقف الحساسة.",
          },
          {
            title: "العقود والحوكمة",
            description: "صياغة ومراجعة الاتفاقات وترتيبات الشركاء والوثائق التنفيذية.",
          },
        ]
      : [
          {
            title: "Commercial disputes",
            description: "Measured strategy for negotiations, claims, and sensitive business exposure.",
          },
          {
            title: "Contracts and governance",
            description: "Drafting and reviewing agreements, shareholder arrangements, and executive documents.",
          },
        ],
  };
}

function createServices(locale: string): ServiceItem[] {
  const isArabic = locale === "ar";

  return [
    {
      id: "commercial-advisory",
      slug: "commercial-advisory",
      title: isArabic ? "الاستشارات التجارية" : "Commercial advisory",
      description: isArabic
        ? "مساندة قانونية للشركات في القرارات اليومية والصفقات والتعرضات التعاقدية."
        : "Ongoing legal support for companies navigating contracts, negotiations, and commercial risk.",
      iconKey: "scale",
    },
    {
      id: "contracts",
      slug: "contracts",
      title: isArabic ? "العقود والاتفاقيات" : "Contracts and agreements",
      description: isArabic
        ? "صياغة ومراجعة العقود التجارية واتفاقيات الشركاء والعمل بسرية ووضوح."
        : "Drafting and review of commercial agreements, partnership terms, and executive-facing documents.",
      iconKey: "scroll",
    },
    {
      id: "disputes",
      slug: "disputes",
      title: isArabic ? "حل النزاعات والتمثيل" : "Dispute resolution",
      description: isArabic
        ? "تمثيل مهني في النزاعات التجارية والمدنية مع تركيز على الحلول العملية والنتائج."
        : "Strategic representation in commercial and civil disputes, with a focus on practical outcomes.",
      iconKey: "shield",
    },
  ];
}

function createAbout(locale: string): AboutContent {
  const isArabic = locale === "ar";

  return {
    eyebrow: isArabic ? "نبذة مهنية" : "Professional profile",
    title: isArabic
      ? "خبرة قانونية تجمع بين الانضباط المهني وفهم الواقع التجاري"
      : "Mohammad Nour combines disciplined counsel, commercial awareness, and measured advocacy",
    summary: isArabic
      ? "نحن نعمل مع الشركات والأفراد الذين يحتاجون إلى استشارة دقيقة وتمثيل موثوق في القضايا التي لا تحتمل الارتجال أو الغموض."
      : "Our work is centered on matters where reputation, clarity, and legal judgment matter. We combine advisory discipline with practical representation for clients who value precision.",
    highlights: isArabic
      ? [
          { label: "سنوات الخبرة", value: "18+" },
          { label: "اللغات", value: "العربية والإنجليزية" },
          { label: "مجالات التركيز", value: "تجاري، عقود، نزاعات" },
        ]
      : [
          { label: "Years of experience", value: "18+" },
          { label: "Languages", value: "Arabic and English" },
          { label: "Core focus", value: "Commercial, contracts, disputes" },
        ],
    yearsExperience: 18,
    languages: isArabic ? ["العربية", "الإنجليزية"] : ["Arabic", "English"],
    certificationsSummary: isArabic
      ? "عضويات مهنية واعتمادات قانونية متعددة"
      : "Bar memberships and professional legal credentials",
    credentials: [
      {
        id: "cred-1",
        title: isArabic ? "عضوية وترخيص" : "Bar admission and licensing",
        description: isArabic
          ? "ترخيص مزاولة وممارسة مهنية قائمة على المسؤولية والانضباط."
          : "Licensed practice supported by strong professional discipline and regulatory awareness.",
      },
      {
        id: "cred-2",
        title: isArabic ? "عمل ثنائي اللغة" : "Bilingual legal delivery",
        description: isArabic
          ? "إدارة الملفات والمراسلات والمفاوضات القانونية بالعربية والإنجليزية."
          : "Legal documentation, negotiation, and client communication in both Arabic and English.",
      },
    ],
  };
}

function createStatistics(locale: string): StatisticItem[] {
  const isArabic = locale === "ar";

  return [
    {
      id: "stat-1",
      label: isArabic ? "سنوات من الخبرة" : "Years of experience",
      value: "18+",
      description: isArabic
        ? "خبرة عملية في الملفات التجارية والتمثيل القانوني."
        : "Hands-on experience across commercial matters and client representation.",
    },
    {
      id: "stat-2",
      label: isArabic ? "ملفات تم التعامل معها" : "Matters handled",
      value: "500+",
      description: isArabic
        ? "قضايا واستشارات واتفاقيات لقطاعات متنوعة."
        : "Advisory matters, disputes, and agreements across multiple sectors.",
    },
    {
      id: "stat-3",
      label: isArabic ? "متوسط الاستجابة" : "Average response",
      value: "24h",
      description: isArabic
        ? "استجابة أولية سريعة وواضحة للطلبات الجديدة."
        : "Fast first-response expectations for new inquiries.",
    },
    {
      id: "stat-4",
      label: isArabic ? "لغات العمل" : "Working languages",
      value: "2",
      description: isArabic
        ? "خدمة قانونية احترافية بالعربية والإنجليزية."
        : "Professional bilingual delivery in Arabic and English.",
    },
  ];
}

function createTestimonials(locale: string): TestimonialItem[] {
  const isArabic = locale === "ar";

  return [
    {
      id: "testimonial-1",
      quote: isArabic
        ? "تلقينا استشارة واضحة ومباشرة في وقت حساس، وكان الأسلوب هادئاً واحترافياً منذ البداية وحتى إغلاق الملف."
        : "We received clear, practical advice during a sensitive matter, and the representation remained calm, responsive, and highly professional throughout.",
      author: isArabic ? "عميل في قطاع الأعمال" : "Corporate client",
      role: isArabic ? "نزاع تجاري" : "Commercial dispute",
      rating: 5,
    },
    {
      id: "testimonial-2",
      quote: isArabic
        ? "تمت مراجعة العقود والهيكل التفاوضي بدقة عالية، ما وفر علينا مخاطر قانونية كبيرة قبل التوقيع."
        : "The contract review and negotiation structure were handled with exceptional care, helping us avoid substantial legal exposure before execution.",
      author: isArabic ? "مدير تنفيذي" : "Managing director",
      role: isArabic ? "عقود وشراكات" : "Contracts and partnerships",
      rating: 5,
    },
    {
      id: "testimonial-3",
      quote: isArabic
        ? "أكثر ما يميز التجربة هو الوضوح، والسرية، والقدرة على تبسيط الخيارات القانونية دون تبسيط المخاطر."
        : "What stood out most was the clarity, discretion, and ability to explain legal options without understating the risks.",
      author: isArabic ? "عميل خاص" : "Private client",
      role: isArabic ? "استشارة استراتيجية" : "Strategic advisory",
      rating: 5,
    },
  ];
}

function createFaqs(locale: string): FaqItem[] {
  const isArabic = locale === "ar";

  return [
    {
      id: "faq-1",
      question: isArabic
        ? "ما نوع القضايا التي تقبلونها؟"
        : "What types of matters do you handle?",
      answer: isArabic
        ? "نركز على الملفات التجارية والعقود والنزاعات المدنية والتجارية والاستشارات القانونية المرتبطة بالأعمال."
        : "We focus on commercial matters, contracts, dispute strategy, and business-related legal advisory work.",
    },
    {
      id: "faq-2",
      question: isArabic
        ? "هل يمكن ترتيب استشارة أولية عن بعد؟"
        : "Can an initial consultation be arranged remotely?",
      answer: isArabic
        ? "نعم، يمكن ترتيب استشارة أولية عبر الهاتف أو عبر اجتماع افتراضي بحسب طبيعة الملف ودرجة الاستعجال."
        : "Yes. Initial consultations can be arranged by phone or virtual meeting depending on the matter and urgency.",
    },
    {
      id: "faq-3",
      question: isArabic
        ? "هل يتم التعامل مع الملفات بسرية كاملة؟"
        : "Are matters handled with full confidentiality?",
      answer: isArabic
        ? "السرية المهنية جزء أساسي من آلية العمل، ويتم التعامل مع جميع المعلومات والوثائق وفق أعلى درجات الخصوصية."
        : "Confidentiality is fundamental to the practice, and all information and documentation are handled with strict professional discretion.",
    },
  ];
}

function createContact(locale: string): ContactInfo {
  const isArabic = locale === "ar";

  return {
    eyebrow: isArabic ? "التواصل" : "Contact",
    title: isArabic
      ? "ابدأ استشارتك القانونية بثقة ووضوح"
      : "Begin your legal consultation with clarity and discretion",
    description: isArabic
      ? "إذا كانت لديك مسألة قانونية تتطلب تقييماً سريعاً أو تمثيلاً مهنياً، يمكنك إرسال تفاصيل أولية وسيتم الرد عليك في أقرب وقت."
      : "If your matter calls for prompt legal judgment or careful representation, share the essentials and we will respond with discretion and urgency.",
    phone: "+971 4 555 0188",
    whatsapp: "+971 50 555 0188",
    email: BRAND_EMAIL,
    address: isArabic ? "دبي، الإمارات العربية المتحدة" : "Dubai, United Arab Emirates",
    responseTimeLabel: isArabic ? "خلال 24 ساعة" : "Within 24 hours",
    mapEmbedUrl: null,
  };
}

export function getDefaultSiteSettings(): SiteSettings {
  return {
    siteName: BRAND_NAME,
    tagline: BRAND_TAGLINE,
    primaryPhone: "+971 4 555 0188",
    primaryEmail: BRAND_EMAIL,
    officeAddress: "Dubai, United Arab Emirates",
  };
}

export function getDefaultSocialLinks(): SocialLink[] {
  return [
    {
      id: "linkedin",
      platform: "linkedin",
      label: "LinkedIn",
      url: BRAND_LINKEDIN_URL,
      sortOrder: 0,
      isActive: true,
    },
    {
      id: "whatsapp",
      platform: "whatsapp",
      label: "WhatsApp",
      url: "https://wa.me/971505550188",
      sortOrder: 1,
      isActive: true,
    },
  ];
}

export function getPublicSiteScaffold(locale: string) {
  return {
    hero: createHero(locale),
    services: createServices(locale),
    about: createAbout(locale),
    statistics: createStatistics(locale),
    testimonials: createTestimonials(locale),
    faqs: createFaqs(locale),
    contact: createContact(locale),
    siteSettings: getDefaultSiteSettings(),
    socialLinks: getDefaultSocialLinks(),
  };
}
