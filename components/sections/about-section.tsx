import { Reveal } from "@/components/motion/reveal";
import { PublicMedia } from "@/components/public/public-media";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionShell } from "@/components/ui/section-shell";
import type { AboutContent } from "@/types/domain";

export function AboutSection({
  locale,
  content,
}: {
  locale: string;
  content: AboutContent;
}) {
  const isArabic = locale === "ar";

  return (
    <SectionShell id="about">
      <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <Card className="rounded-[1.4rem] bg-[linear-gradient(180deg,rgba(193,161,103,0.12),rgba(255,255,255,0.02))] p-7 md:p-8">
            <p className="eyebrow mb-8">
              {isArabic
                ? "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0645\u0647\u0646\u064a"
                : "Profile"}
            </p>
            <div className="grid gap-6">
              <div className="relative overflow-hidden rounded-[1.7rem] border border-border bg-black/18">
                <div className="relative aspect-[4/3] w-full">
                  {content.imageUrl ? (
                    <PublicMedia
                      src={content.imageUrl}
                      alt={content.imageAlt ?? content.title}
                      sizes="(max-width: 1023px) 100vw, 34vw"
                      className="object-cover"
                      fallbackClassName="bg-[radial-gradient(circle_at_top,rgba(193,161,103,0.2),transparent_38%),linear-gradient(180deg,rgba(6,8,12,0.3),rgba(6,8,12,0.92))]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(193,161,103,0.2),transparent_38%),linear-gradient(180deg,rgba(6,8,12,0.3),rgba(6,8,12,0.92))]" />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,5,8,0.06),rgba(4,5,8,0.5))]" />
                </div>
              </div>
              <div className="grid gap-4">
                {content.highlights.map((item) => (
                  <div
                    key={item.label}
                    className="gold-dot border-b border-border pb-4 last:border-b-0 last:pb-0"
                  >
                    <p className="text-sm text-muted">{item.label}</p>
                    <p className="mt-2 text-[1.15rem] font-semibold text-foreground">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Reveal>
        <Reveal delay={0.08}>
          <div>
            <div className="section-frame">
              <SectionHeading
                eyebrow={content.eyebrow}
                title={content.title}
                description={content.summary}
              />
            </div>
            {content.certificationsSummary ? (
              <Card className="mt-8 border-border/70 bg-black/14 p-5">
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-accent">
                  {isArabic
                    ? "\u0627\u0639\u062a\u0645\u0627\u062f\u0627\u062a"
                    : "Credentials"}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {content.certificationsSummary}
                </p>
              </Card>
            ) : null}
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {content.credentials.map((credential, index) => (
                <Reveal key={credential.id} delay={0.12 + index * 0.05}>
                  <Card
                    interactive
                    className="rounded-none border-x-0 border-b-0 border-t border-border/80 bg-transparent p-6 shadow-none before:hidden hover:bg-white/[0.025] hover:shadow-none"
                  >
                    <p className="eyebrow mb-4">
                      {isArabic
                        ? "\u0627\u0639\u062a\u0645\u0627\u062f"
                        : "Credential"}
                    </p>
                    <p className="text-heading text-xl font-semibold text-foreground">
                      {credential.title}
                    </p>
                    <p className="balanced-copy mt-3 text-sm leading-8 text-muted-foreground">
                      {credential.description}
                    </p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
