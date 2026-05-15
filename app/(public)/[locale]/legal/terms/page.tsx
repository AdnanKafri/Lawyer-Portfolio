import { SectionShell } from "@/components/ui/section-shell";

type LegalPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function TermsPage({ params }: LegalPageProps) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return (
    <SectionShell className="min-h-[60vh] pt-20">
      <div className="max-w-3xl">
        <p className="mb-4 text-xs uppercase tracking-[0.32em] text-accent">
          {isArabic ? "قانوني" : "Legal"}
        </p>
        <h1 className="text-4xl font-semibold text-foreground">
          {isArabic ? "الشروط والأحكام" : "Terms and conditions"}
        </h1>
        <div className="mt-6 space-y-5 text-base leading-8 text-muted-foreground">
          {isArabic ? (
            <>
              <p>
                يخضع استخدام هذا الموقع لتوقعات مهنية وقانونية معتادة. المادة
                المنشورة هنا هي لأغراض المعلومات العامة فقط، ولا يجب اعتبارها
                استشارة قانونية نهائية قبل مراجعة المسألة بشكل مباشر.
              </p>
              <p>
                لا تبدأ أي علاقة مهنية مع المكتب إلا بعد الاتفاق كتابةً على نطاق
                العمل، ومتطلبات السرية، والمدة المتوقعة، والأتعاب المهنية.
              </p>
              <p>
                إذا كنت تفكر في طلب تمثيل قانوني، فننصح بالتواصل مع المكتب لمناقشة
                الشروط المرتبطة بمسألتك بشكل مباشر وواضح.
              </p>
            </>
          ) : (
            <>
              <p>
                Use of this website is subject to standard professional and legal
                expectations. The material provided here is for general
                information only and should not be treated as formal legal advice
                until a matter is reviewed directly.
              </p>
              <p>
                Any engagement with the firm begins only after the scope, timing,
                confidentiality obligations, and professional fees are confirmed
                in writing.
              </p>
              <p>
                If you are considering representation, we encourage you to
                contact the office so the relevant terms can be discussed in the
                context of your specific matter.
              </p>
            </>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
