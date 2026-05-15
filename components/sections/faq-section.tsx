import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionShell } from "@/components/ui/section-shell";
import type { FaqItem } from "@/types/domain";

export function FaqSection({
  locale,
  content,
}: {
  locale: string;
  content: FaqItem[];
}) {
  const isArabic = locale === "ar";

  return (
    <SectionShell id="faq">
      <Reveal className="section-frame">
        <SectionHeading
          eyebrow={isArabic ? "\u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629" : "FAQ"}
          title={
            isArabic
              ? "أسئلة شائعة تساعدك على فهم طريقة العمل قبل بدء التواصل"
              : "Common questions answered with enough clarity to help you make a confident first step"
          }
          description={
            isArabic
              ? "الهدف هو تبسيط نقاط القرار الأساسية مثل السرية، والتواصل، ونوع الملفات التي نقبلها."
              : "The answers focus on the practical details that matter first: confidentiality, responsiveness, and the types of matters we accept."
          }
        />
      </Reveal>
      <div className="mt-12 space-y-4">
        {content.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.04}>
            <Card interactive className="p-0">
              <details className="group rounded-[28px]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 md:px-7">
                  <span className="balanced-copy text-left text-base font-semibold text-foreground">
                    {item.question}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/[0.03]">
                    <ChevronDown className="h-5 w-5 text-muted transition group-open:rotate-180" />
                  </span>
                </summary>
                <div className="balanced-copy px-6 pb-6 text-sm leading-8 text-muted-foreground md:px-7">
                  {item.answer}
                </div>
              </details>
            </Card>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
