import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { SectionShell } from "@/components/ui/section-shell";
import type { StatisticItem } from "@/types/domain";

export function StatsSection({ content }: { content: StatisticItem[] }) {
  return (
    <SectionShell id="statistics" className="pt-0">
      <div className="border-y border-border py-5 md:py-6">
        <div className="grid items-start gap-0 md:grid-cols-2 xl:grid-cols-4">
          {content.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <Card
                interactive
                className={`rounded-none border-0 bg-transparent p-5 shadow-none before:hidden hover:bg-white/[0.025] hover:shadow-none md:p-6 ${index > 0 ? "md:border-s md:border-border md:ps-6" : ""}`}
              >
                <p className="text-[2.4rem] font-semibold tracking-[-0.05em] text-accent">
                  {item.value}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
