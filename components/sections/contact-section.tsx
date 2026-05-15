import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/forms/contact-form";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionShell } from "@/components/ui/section-shell";
import type { ContactInfo } from "@/types/domain";

export function ContactSection({
  locale,
  content,
}: {
  locale: string;
  content: ContactInfo;
}) {
  const isArabic = locale === "ar";
  const responseLabel = content.responseTimeLabel?.toLowerCase();

  return (
    <SectionShell id="contact" className="pb-24">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div>
            <div className="section-frame">
              <SectionHeading
                eyebrow={content.eyebrow}
                title={content.title}
                description={content.description}
              />
            </div>
            <div className="mt-10 grid gap-4">
              {[
                {
                  icon: Phone,
                  label: isArabic ? "\u0627\u0644\u0647\u0627\u062a\u0641" : "Phone",
                  value: content.phone,
                },
                {
                  icon: MessageCircle,
                  label: "WhatsApp",
                  value: content.whatsapp,
                },
                {
                  icon: Mail,
                  label: isArabic ? "\u0627\u0644\u0628\u0631\u064a\u062f" : "Email",
                  value: content.email,
                },
                {
                  icon: MapPin,
                  label: isArabic ? "\u0627\u0644\u0639\u0646\u0648\u0627\u0646" : "Address",
                  value: content.address,
                },
              ].map((item, index) => (
                <Reveal key={item.label} delay={index * 0.05}>
                  <Card interactive className="flex items-center gap-4 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] border border-border bg-accent/10 text-accent">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted">{item.label}</p>
                      <p className="text-sm font-semibold text-foreground">{item.value}</p>
                    </div>
                  </Card>
                </Reveal>
              ))}
            </div>
            {content.responseTimeLabel ? (
              <Card className="mt-4 border-border/70 bg-black/12 p-5">
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-accent">
                  {isArabic ? "\u0627\u0644\u0627\u0633\u062a\u062c\u0627\u0628\u0629" : "Response"}
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {isArabic
                    ? `نتعامل عادة مع الطلبات الأولية خلال ${content.responseTimeLabel}.`
                    : `Initial inquiries are usually reviewed ${responseLabel ?? "within 24 hours"}.`}
                </p>
              </Card>
            ) : null}
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <Card className="p-7 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-5">
              <div>
                <p className="eyebrow mb-3">
                  {isArabic
                    ? "\u0646\u0645\u0648\u0630\u062c \u0627\u0644\u0627\u0633\u062a\u0634\u0627\u0631\u0629"
                    : "Consultation form"}
                </p>
                <p className="text-heading text-2xl font-semibold text-foreground">
                  {isArabic
                    ? "\u0627\u0628\u062f\u0623 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0627\u0644\u0645\u0647\u0646\u064a"
                    : "Start a professional inquiry"}
                </p>
              </div>
            </div>
            <ContactForm locale={isArabic ? "ar" : "en"} />
            {content.mapEmbedUrl ? (
              <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-border bg-black/15">
                <iframe
                  title={isArabic ? "\u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u0645\u0643\u062a\u0628" : "Office map"}
                  src={content.mapEmbedUrl}
                  className="h-56 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}
            <div className="mt-6 rounded-[1.6rem] border border-dashed border-border bg-white/[0.02] px-5 py-6 text-sm leading-7 text-muted-foreground">
              {isArabic
                ? "\u0633\u064a\u062a\u0645 \u062d\u0641\u0638 \u0627\u0644\u0637\u0644\u0628\u0627\u062a \u0641\u064a Supabase \u0645\u0639 \u0625\u0645\u0643\u0627\u0646\u064a\u0629 \u0625\u0631\u0633\u0627\u0644 \u0625\u0634\u0639\u0627\u0631 \u0628\u0631\u064a\u062f \u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0639\u0646\u062f \u0627\u0644\u062a\u0647\u064a\u0626\u0629."
                : "Submissions are prepared to persist in Supabase, with optional email notification when the provider is configured."}
            </div>
          </Card>
        </Reveal>
      </div>
    </SectionShell>
  );
}
