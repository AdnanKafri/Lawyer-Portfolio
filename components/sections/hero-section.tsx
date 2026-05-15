import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { SectionShell } from "@/components/ui/section-shell";
import type { HeroContent } from "@/types/domain";

export function HeroSection({
  locale,
  content,
}: {
  locale: string;
  content: HeroContent;
}) {
  const isArabic = locale === "ar";

  return (
    <SectionShell
      className="section-grid overflow-hidden pb-[calc(var(--section-space-y)-1rem)] pt-8 md:pt-10"
      id="hero"
    >
      <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
        <Reveal className="relative">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="eyebrow">{content.eyebrow}</span>
            <span className="rounded-full border border-border bg-white/[0.03] px-4 py-2 text-[0.72rem] uppercase tracking-[0.24em] text-muted-foreground">
              {isArabic ? "\u062b\u0642\u0629 \u0648\u0648\u0636\u0648\u062d" : "Trust and clarity"}
            </span>
          </div>
          <h1 className="text-display balanced-copy max-w-4xl text-[3.1rem] font-semibold text-foreground sm:text-[4rem] lg:text-[5.55rem]">
            {content.title}
          </h1>
          <p className="balanced-copy text-body-lg mt-7 max-w-2xl text-muted-foreground">
            {content.description}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-[0.96rem] font-medium text-accent-foreground shadow-[0_16px_36px_rgba(193,161,103,0.22)] transition hover:-translate-y-0.5 hover:bg-accent-strong"
            >
              {content.primaryCta}
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white/[0.02] px-6 py-3.5 text-[0.96rem] font-medium text-foreground transition hover:-translate-y-0.5 hover:border-border-strong hover:bg-white/[0.04] hover:text-accent"
            >
              {content.secondaryCta}
            </Link>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {content.trustPoints.map((item, index) => (
              <Reveal key={item} delay={0.08 + index * 0.06}>
                <div className="rounded-[1.6rem] border border-border bg-white/[0.03] px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/12 text-accent">
                      <BadgeCheck className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <Card className="relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(193,161,103,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.012))] p-0">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />
            <div className="grid gap-6 p-6 sm:p-8">
              <div className="relative overflow-hidden rounded-[2rem] border border-border bg-black/20">
                <div className="relative aspect-[4/5] min-h-[320px] w-full">
                  {content.imageUrl ? (
                    <Image
                      src={content.imageUrl}
                      alt={content.imageAlt ?? content.title}
                      fill
                      priority
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(193,161,103,0.24),transparent_35%),linear-gradient(180deg,rgba(7,9,13,0.78),rgba(7,9,13,0.96))]" />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,5,8,0.05),rgba(4,5,8,0.72))]" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      {content.trustPoints.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.2em] text-white/85 backdrop-blur"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    value: isArabic ? "\u0633\u0631\u064a\u0629" : "Confidential",
                    label: isArabic ? "\u062a\u0639\u0627\u0645\u0644 \u0647\u0627\u062f\u0626" : "Measured advisory",
                  },
                  {
                    value: isArabic ? "\u062b\u0646\u0627\u0626\u064a" : "Bilingual",
                    label: isArabic ? "\u062a\u0648\u0627\u0635\u0644 \u0648\u062f\u064a" : "Arabic and English",
                  },
                  {
                    value: "24h",
                    label: isArabic ? "\u0627\u0633\u062a\u062c\u0627\u0628\u0629" : "Initial response",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[1.4rem] border border-border bg-black/16 px-4 py-4"
                  >
                    <p className="text-[1.05rem] font-semibold text-foreground">{stat.value}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-4">
                {content.previewPanels.map((panel, index) => (
                  <Reveal key={panel.title} delay={0.16 + index * 0.07}>
                    <div className="interactive-lift rounded-[1.6rem] border border-border bg-black/18 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-base font-semibold text-foreground">{panel.title}</p>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            {panel.description}
                          </p>
                        </div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/[0.03] text-accent">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </SectionShell>
  );
}
