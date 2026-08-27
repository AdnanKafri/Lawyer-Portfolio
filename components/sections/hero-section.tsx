import Image from "next/image";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { SectionShell } from "@/components/ui/section-shell";
import { cn } from "@/lib/utils/cn";
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
      className="section-grid overflow-hidden pb-[calc(var(--section-space-y)-1rem)] pt-6 md:pt-8"
      id="hero"
    >
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className={cn(
          "relative overflow-hidden rounded-[1.6rem] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018))] p-2 shadow-[0_30px_90px_rgba(0,0,0,0.22)] sm:p-3 md:p-5 lg:p-7",
          isArabic && "font-arabic",
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(193,161,103,0.11),transparent_26%),radial-gradient(circle_at_88%_16%,rgba(255,255,255,0.04),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.015),transparent)]" />
        <div className="relative grid gap-4 lg:grid-cols-[minmax(0,0.96fr)_minmax(360px,0.84fr)] lg:gap-8">
          <Reveal
            className={cn("min-w-0", isArabic ? "lg:order-2" : "lg:order-1")}
          >
            <div
              className={cn(
                "flex h-full flex-col justify-center px-4 py-5 sm:px-6 sm:py-6 md:px-8 lg:px-10 lg:py-8",
                isArabic && "text-right",
              )}
            >
              <div className="max-w-3xl space-y-6 lg:space-y-7">
                <div className="flex items-center gap-4">
                  <span className="eyebrow">{content.eyebrow}</span>
                  <span className="h-px w-16 bg-gradient-to-r from-accent/70 to-transparent" />
                </div>

                <div className="space-y-4">
                  <h1
                    className={cn(
                      "balanced-copy font-semibold text-foreground",
                      isArabic
                        ? "max-w-[10.2ch] text-[clamp(2.65rem,4.9vw,5.15rem)] leading-[1.07] tracking-[-0.028em]"
                        : "max-w-[11ch] text-[clamp(2.7rem,4.8vw,5rem)] leading-[0.96] tracking-[-0.05em]",
                    )}
                  >
                    {content.title}
                  </h1>
                  <p
                    className={cn(
                      "balanced-copy max-w-[38rem] text-[0.98rem] text-muted-foreground md:text-[1.05rem]",
                      isArabic ? "leading-[1.95]" : "leading-[1.88]",
                    )}
                  >
                    {content.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
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

                <div className="grid gap-3 pt-2 sm:grid-cols-3">
                  {content.trustPoints.map((item, index) => (
                    <Reveal key={item} delay={0.08 + index * 0.05}>
                      <div className="border-t border-border px-1 py-4 sm:px-0">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-accent/10 text-accent">
                            <BadgeCheck className="h-4 w-4" />
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {item}
                          </span>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>

                <div className="border-y border-border bg-black/10 px-1 py-4 sm:px-0 sm:py-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    {content.previewPanels.slice(0, 2).map((panel, index) => (
                      <div
                        key={panel.title}
                        className={cn(
                          "space-y-2",
                          index === 0
                            ? "md:border-l-0"
                            : "md:border-s md:border-border md:ps-5",
                        )}
                      >
                        <p className="text-sm font-semibold text-foreground">
                          {panel.title}
                        </p>
                        <p className="text-sm leading-7 text-muted-foreground">
                          {panel.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal
            delay={0.08}
            className={cn(isArabic ? "lg:order-1" : "lg:order-2")}
          >
            <Card className="relative h-full overflow-hidden rounded-[1.2rem] border-border bg-black/16 p-0">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <div className="relative h-full">
                <div className="relative aspect-[4/4.9] min-h-[420px] w-full lg:min-h-[620px]">
                  {content.imageUrl ? (
                    <Image
                      src={content.imageUrl}
                      alt={content.imageAlt ?? content.title}
                      fill
                      priority
                      className="object-cover object-[50%_18%]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(193,161,103,0.22),transparent_34%),linear-gradient(180deg,rgba(7,9,13,0.75),rgba(7,9,13,0.96))]" />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,5,8,0.04),rgba(4,5,8,0.5)_52%,rgba(4,5,8,0.88))]" />

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <div className="rounded-[1.8rem] border border-white/10 bg-black/36 p-4 backdrop-blur-xl sm:p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-[0.66rem] uppercase tracking-[0.24em] text-white/60">
                            {isArabic ? "مجال الممارسة" : "Practice focus"}
                          </p>
                          <p className="mt-1 text-lg font-semibold text-white">
                            {isArabic
                              ? "العقود والنزاعات التجارية"
                              : "Contracts and commercial disputes"}
                          </p>
                        </div>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-white/78">
                          {isArabic ? "دبي" : "Dubai"}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-white/72">
                        {isArabic
                          ? "تمثيل قانوني هادئ في الملفات الحساسة، مع وضوح مهني يحترم القرار وسمعة العميل."
                          : "Calm legal representation for sensitive matters, with practical judgment and professional discretion."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
