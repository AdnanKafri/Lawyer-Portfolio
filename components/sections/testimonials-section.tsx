import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionShell } from "@/components/ui/section-shell";
import { cn } from "@/lib/utils/cn";
import type { TestimonialItem } from "@/types/domain";

export function TestimonialsSection({
  locale,
  content,
}: {
  locale: string;
  content: TestimonialItem[];
}) {
  const isArabic = locale === "ar";

  return (
    <SectionShell id="testimonials">
      <Reveal className="section-frame">
        <SectionHeading
          eyebrow={isArabic ? "\u0627\u0644\u062b\u0642\u0629" : "Trust"}
          title={
            isArabic
              ? "ما يقوله العملاء بعد التعامل مع ملفات حساسة ومهمّة"
              : "What clients say after handling sensitive and high-stakes matters"
          }
          description={
            isArabic
              ? "تجارب العملاء هنا تركز على الوضوح، والسرية، وسرعة الاستجابة، وهي العناصر التي تهم عند اختيار ممثل قانوني."
              : "These testimonials emphasize clarity, discretion, and responsiveness - the qualities that matter when choosing legal representation."
          }
        />
      </Reveal>
      <div className="mt-12 grid items-start gap-5 lg:grid-cols-3">
        {content.map((item, index) => (
          <Reveal
            key={item.id}
            delay={index * 0.07}
            className={cn(index === 0 && "lg:col-span-2")}
          >
            <Card
              interactive
              className={cn(
                "flex flex-col rounded-[1.4rem] p-7",
                index === 0 && "lg:p-9",
              )}
            >
              <div className="flex items-center justify-between">
                <Quote className="h-8 w-8 text-accent" />
                <span className="text-[0.68rem] uppercase tracking-[0.22em] text-muted">
                  {isArabic
                    ? "\u0635\u0648\u062a \u0627\u0644\u0639\u0645\u064a\u0644"
                    : "Client voice"}
                </span>
              </div>
              <p
                className={cn(
                  "balanced-copy mt-6 text-[1.02rem] leading-8 text-muted-foreground",
                  index === 0 && "lg:max-w-3xl lg:text-[1.15rem] lg:leading-9",
                )}
              >
                {item.quote}
              </p>
              {item.rating ? (
                <div
                  className="mt-6 flex items-center gap-1 text-accent"
                  aria-label={`${item.rating} out of 5`}
                >
                  {Array.from({ length: item.rating }).map((_, ratingIndex) => (
                    <Star key={ratingIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              ) : null}
              <div className="mt-8 border-t border-border pt-5">
                <p className="font-semibold text-foreground">{item.author}</p>
                <p className="mt-1 text-sm text-muted">{item.role}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
