import { SectionShell } from "@/components/ui/section-shell";

type LegalPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: LegalPageProps) {
  const { locale } = await params;
  const isArabic = locale === "ar";

  return (
    <SectionShell className="min-h-[60vh] pt-20">
      <div className="max-w-3xl">
        <p className="mb-4 text-xs uppercase tracking-[0.32em] text-accent">
          {isArabic ? "قانوني" : "Legal"}
        </p>
        <h1 className="text-4xl font-semibold text-foreground">
          {isArabic ? "سياسة الخصوصية" : "Privacy policy"}
        </h1>
        <div className="mt-6 space-y-5 text-base leading-8 text-muted-foreground">
          {isArabic ? (
            <>
              <p>
                نحترم سرية كل استفسار يُرسل عبر هذا الموقع. تُستخدم المعلومات
                المقدمة فقط لتقييم المسألة، والرد على الطلب، وتقديم الخدمات
                القانونية عند الاقتضاء.
              </p>
              <p>
                لا نقوم ببيع البيانات الشخصية. أي معلومات تحتفظ بها أنظمتنا تُدار
                بسرية مهنية ووفق ضوابط وصول مناسبة لبيئة العمل القانوني.
              </p>
              <p>
                إذا كنت ترغب في نسخة كاملة من سياسة الخصوصية أو لديك سؤال حول
                طريقة التعامل مع بياناتك، يرجى التواصل مع المكتب عبر بيانات
                الاتصال الظاهرة في الصفحة الرئيسية.
              </p>
            </>
          ) : (
            <>
              <p>
                We respect the confidentiality of every inquiry submitted through
                this website. Information shared with us is used only to evaluate
                the matter, respond to your request, and, where appropriate,
                provide legal services.
              </p>
              <p>
                We do not sell personal information. Any data retained through our
                systems is handled with professional discretion and protected
                through access controls intended for legal practice operations.
              </p>
              <p>
                If you would like a copy of the full privacy policy or want to ask
                how your information is handled, contact the firm directly using
                the details listed on the main page.
              </p>
            </>
          )}
        </div>
      </div>
    </SectionShell>
  );
}
