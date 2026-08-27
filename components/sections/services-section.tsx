import {
  BriefcaseBusiness,
  FileText,
  Landmark,
  Scale,
  ScrollText,
  Shield,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionShell } from "@/components/ui/section-shell";
import type { ServiceItem } from "@/types/domain";

const iconMap = {
  scale: Scale,
  shield: Shield,
  scroll: ScrollText,
  briefcase: BriefcaseBusiness,
  landmark: Landmark,
  file: FileText,
};

export function ServicesSection({
  locale,
  content,
}: {
  locale: string;
  content: ServiceItem[];
}) {
  const isArabic = locale === "ar";

  return (
    <SectionShell id="services" className="pt-0">
      <Reveal className="section-frame">
        <SectionHeading
          eyebrow={
            isArabic ? "\u0627\u0644\u062e\u062f\u0645\u0627\u062a" : "Services"
          }
          title={
            isArabic
              ? "خدمات قانونية مركزة للشركات والأفراد الذين يحتاجون إلى وضوح، وسرعة، وتمثيل موثوق"
              : "Focused legal services for businesses and private clients who expect clarity, speed, and trusted representation"
          }
          description={
            isArabic
              ? "تُعرض مجالات الممارسة هنا بصورة هادئة ومباشرة، مع مساحة كافية لتوسيع كل خدمة لاحقًا دون تغيير البنية."
              : "Each practice area is presented with editorial restraint so the section feels authoritative, not overdesigned."
          }
        />
      </Reveal>
      <div className="mt-12 grid gap-x-8 md:grid-cols-2 xl:grid-cols-3">
        {content.map((service, index) => {
          const Icon =
            iconMap[service.iconKey as keyof typeof iconMap] ??
            [Scale, Shield, ScrollText, BriefcaseBusiness, Landmark, FileText][
              index % 6
            ];

          return (
            <Reveal key={service.id} delay={index * 0.07}>
              <Card
                interactive
                className="h-full rounded-none border-x-0 border-b-0 border-t border-border/80 bg-transparent p-7 shadow-none before:hidden hover:bg-white/[0.025] hover:shadow-none"
              >
                <div className="mb-7 flex items-center justify-between gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[0.68rem] uppercase tracking-[0.22em] text-muted">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-heading text-[1.35rem] font-semibold text-foreground">
                  {service.title}
                </h3>
                <p className="balanced-copy mt-4 text-sm leading-8 text-muted-foreground">
                  {service.description}
                </p>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
